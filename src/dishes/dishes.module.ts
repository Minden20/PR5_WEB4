import { Module } from '@nestjs/common';
import { DishesController } from './dishes.controller.js';
import { DishesService } from './dishes.service.js';
import { SharedModule } from '../shared/shared.module.js';

@Module({
  imports: [SharedModule],
  controllers: [DishesController],
  providers: [DishesService],
  exports: [DishesService],
})
export class DishesModule {}
