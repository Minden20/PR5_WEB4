import { Module } from '@nestjs/common';
import { DishesModule } from '../dishes/dishes.module.js';
import { SharedModule } from '../shared/shared.module.js';
import { OrdersController } from './orders.controller.js';
import { OrdersService } from './orders.service.js';

@Module({
  imports: [DishesModule, SharedModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
