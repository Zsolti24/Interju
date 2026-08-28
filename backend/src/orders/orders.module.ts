import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersGateway } from './orders.gateway';
import { OrderStatusListenerService } from './order-status-listener.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersGateway, OrderStatusListenerService],
})
export class OrdersModule {}
