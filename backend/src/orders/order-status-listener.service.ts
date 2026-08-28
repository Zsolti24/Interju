import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';
import { OrdersGateway } from './orders.gateway';

type StatusChangePayload = {
  orderId: number;
  userId: number;
  status: string;
};

@Injectable()
export class OrderStatusListenerService
  implements OnModuleInit, OnModuleDestroy
{
  private client: Client;

  constructor(
    private readonly config: ConfigService,
    private readonly ordersGateway: OrdersGateway,
  ) {}

  async onModuleInit() {
    this.client = new Client({
      connectionString: this.config.get<string>('DATABASE_URL'),
    });
    await this.client.connect();
    await this.client.query('LISTEN order_status_changed');

    this.client.on('notification', (message) => {
      if (!message.payload) {
        return;
      }
      const payload = JSON.parse(message.payload) as StatusChangePayload;
      this.ordersGateway.emitStatusChange(
        payload.orderId,
        payload.userId,
        payload.status,
      );
    });
  }

  async onModuleDestroy() {
    await this.client.end();
  }
}
