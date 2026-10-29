import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DishesService } from '../dishes/dishes.service.js';
import {
  STORE_CONFIG,
  type StoreConfig,
} from '../shared/config/app-config.provider.js';
import {
  FEE_CALCULATOR,
  type FeeCalculator,
} from '../shared/config/fee-calculator.provider.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { Order } from './entities/order.entity.js';

@Injectable()
export class OrdersService implements OnModuleInit {
  private readonly logger = new Logger(OrdersService.name);
  private readonly orders: Order[] = [];

  constructor(
    private readonly dishesService: DishesService,
    @Inject(FEE_CALCULATOR) private readonly feeCalculator: FeeCalculator,
    @Inject(STORE_CONFIG) private readonly storeConfig: StoreConfig,
  ) {}

  onModuleInit() {
    this.logger.log(
      `OrdersService успішно ініціалізовано. Магазин: "${this.storeConfig.storeName}", Ставка податку: ${this.storeConfig.taxPercent}%, Валюта: ${this.storeConfig.defaultCurrency}.`,
    );
  }

  findAll(): Order[] {
    return [...this.orders];
  }

  findOne(id: string): Order {
    const order = this.orders.find((item) => item.id === id);
    if (!order) {
      throw new NotFoundException(`Замовлення з ID ${id} не знайдено`);
    }
    return order;
  }

  createOrder(dto: CreateOrderDto): Order {
    if (!dto?.productId) {
      throw new BadRequestException('Поле productId є обов’язковим');
    }

    const quantity = Number(dto.quantity);
    if (Number.isNaN(quantity) || quantity <= 0) {
      throw new BadRequestException(
        'Кількість товару (quantity) повинна бути позитивним числом',
      );
    }

    // Отримуємо товар із суміжного Feature Module (DishesService)
    const dish = this.dishesService.findOne(dto.productId);
    if (!dish) {
      throw new NotFoundException(`Товар з ID ${dto.productId} не знайдено`);
    }

    const subtotal = dish.price * quantity;
    const tax = this.feeCalculator.calculateTax(subtotal);
    const totalAmount = Math.round((subtotal + tax) * 100) / 100;

    const newOrder: Order = {
      id: randomUUID(),
      productId: dish.id,
      productTitle: dish.title,
      unitPrice: dish.price,
      quantity,
      subtotal,
      tax,
      taxPercent: this.storeConfig.taxPercent,
      totalAmount,
      currency: this.storeConfig.defaultCurrency,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    };

    this.orders.push(newOrder);
    this.logger.log(
      `Створено нове замовлення ${newOrder.id} для страви "${dish.title}" (${quantity} шт.) на суму ${newOrder.totalAmount} ${newOrder.currency} (включаючи податок ${newOrder.tax} ${newOrder.currency})`,
    );

    return newOrder;
  }
}
