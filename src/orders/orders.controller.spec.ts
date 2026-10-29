import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller.js';
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

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;
  let dishesService: DishesService;

  const mockStoreConfig: StoreConfig = {
    storeName: 'Test Food Store',
    defaultCurrency: 'UAH',
    taxPercent: 5,
  };

  const mockFeeCalculator: FeeCalculator = {
    calculateTax: (amount: number) => (amount * 5) / 100,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
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

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
    dishesService = module.get<DishesService>(DishesService);
    dishesService.onModuleInit();
    service.onModuleInit();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all orders', () => {
      expect(controller.findAll()).toEqual([]);
    });
  });

  describe('createOrder', () => {
    it('should create and return order', () => {
      const order = controller.createOrder({
        productId: '3',
        quantity: 2,
      });

      expect(order.productId).toBe('3');
      expect(order.productTitle).toBe('Том Ям з королівськими креветками');
      expect(order.quantity).toBe(2);
      expect(order.unitPrice).toBe(340);
      expect(order.subtotal).toBe(680);
      expect(order.tax).toBe(34);
      expect(order.totalAmount).toBe(714);
    });
  });

  describe('findOne', () => {
    it('should return order by id', () => {
      const order = controller.createOrder({
        productId: '1',
        quantity: 1,
      });

      const found = controller.findOne(order.id);
      expect(found.id).toBe(order.id);
    });
  });
});
