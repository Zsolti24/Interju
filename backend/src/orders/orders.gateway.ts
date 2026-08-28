import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class OrdersGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  @SubscribeMessage('joinOrder')
  async handleJoinOrder(
    @MessageBody() data: { orderId: number; token: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const payload = this.jwtService.verify<{ sub: number }>(data.token);
      const order = await this.prisma.order.findUnique({
        where: { id: data.orderId },
      });
      if (order && order.userId === payload.sub) {
        await client.join(`order:${data.orderId}`);
      }
    } catch {
      return;
    }
  }

  @SubscribeMessage('joinUser')
  async handleJoinUser(
    @MessageBody() data: { token: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const payload = this.jwtService.verify<{ sub: number }>(data.token);
      await client.join(`user:${payload.sub}`);
    } catch {
      return;
    }
  }

  emitStatusChange(orderId: number, userId: number, status: string) {
    this.server.to(`order:${orderId}`).emit('orderStatusChanged', { status });
    this.server
      .to(`user:${userId}`)
      .emit('orderStatusChanged', { orderId, status });
  }
}
