import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { DishesService } from '../dishes/dishes.service.js';
import { SlugService } from '../shared/slug/slug.service.js';
import {
  STORE_CONFIG,
  StoreConfig,
} from '../shared/config/app-config.provider.js';
import {
  FEE_CALCULATOR,
  FeeCalculator,
} from '../shared/config/fee-calculator.provider.js';

describe('OrdersService', () => {
  let service: OrdersService;
  let dishesService: DishesService;

  const mockStoreConfig: StoreConfig = {
    storeName: 'Test Store',
    defaultCurrency: 'UAH',
    taxPercent: 10,
  };

  const mockFeeCalculator: FeeCalculator = {
    calculateTax: (amount: number) => (amount * 10) / 100,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        DishesService,
        SlugService,
        {
          provide: STORE_CONFIG,
          useValue: mockStoreConfig,
        },
        {
          provide: FEE_CALCULATOR,
          useValue: mockFeeCalculator,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    dishesService = module.get<DishesService>(DishesService);
    dishesService.onModuleInit();
    service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(dishesService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return empty list initially', () => {
      expect(service.findAll()).toEqual([]);
    });
  });

  describe('createOrder', () => {
    it('should successfully create an order for an existing dish with tax calculated', () => {
      // Dish with ID '1' exists: price 195
      const order = service.createOrder({
        productId: '1',
        quantity: 2,
      });

      expect(order).toBeDefined();
      expect(order.id).toBeDefined();
      expect(order.productId).toBe('1');
      expect(order.productTitle).toBe('Український борщ із пампушками');
      expect(order.unitPrice).toBe(195);
      expect(order.quantity).toBe(2);
      expect(order.subtotal).toBe(390); // 195 * 2
      expect(order.tax).toBe(39); // 10% of 390
      expect(order.totalAmount).toBe(429); // 390 + 39
      expect(order.currency).toBe('UAH');
      expect(order.status).toBe('CONFIRMED');

      expect(service.findAll().length).toBe(1);
    });

    it('should throw NotFoundException if product is not found', () => {
      expect(() =>
        service.createOrder({
          productId: 'non-existing-product-id',
          quantity: 1,
        }),
      ).toThrow(NotFoundException);
    });

    it('should throw BadRequestException if quantity is zero or negative', () => {
      expect(() =>
        service.createOrder({
          productId: '1',
          quantity: 0,
        }),
      ).toThrow(BadRequestException);

      expect(() =>
        service.createOrder({
          productId: '1',
          quantity: -3,
        }),
      ).toThrow(BadRequestException);
    });

    it('should throw BadRequestException if productId is missing', () => {
      expect(() =>
        service.createOrder({
          productId: '',
          quantity: 2,
        }),
      ).toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should find existing order by id', () => {
      const created = service.createOrder({
        productId: '2',
        quantity: 1,
      });

      const found = service.findOne(created.id);
      expect(found).toEqual(created);
    });

    it('should throw NotFoundException if order does not exist', () => {
      expect(() => service.findOne('unknown-order-id')).toThrow(
        NotFoundException,
      );
    });
  });
});
