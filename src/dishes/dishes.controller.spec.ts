import { Test, TestingModule } from '@nestjs/testing';
import { DishesController } from './dishes.controller.js';
import { DishesService } from './dishes.service.js';
import { SlugService } from '../shared/slug/slug.service.js';

describe('DishesController', () => {
  let controller: DishesController;
  let service: DishesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DishesController],
      providers: [DishesService, SlugService],
    }).compile();

    controller = module.get<DishesController>(DishesController);
    service = module.get<DishesService>(DishesService);
    service.onModuleInit();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of dishes', () => {
      const result = controller.findAll();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(3);
    });

    it('should parse query params and filter results', () => {
      const spicyResults = controller.findAll(undefined, 'true', undefined);
      expect(spicyResults.every((d) => d.isSpicy === true)).toBe(true);

      const searchResults = controller.findAll('борщ');
      expect(searchResults.length).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return dish with matching id', () => {
      const dish = controller.findOne('1');
      expect(dish.id).toBe('1');
    });
  });

  describe('findBySlug', () => {
    it('should return dish with matching slug', () => {
      const dish = controller.findBySlug('ukrayinskyi-borshch-iz-pampushkamy');
      expect(dish.id).toBe('1');
    });
  });

  describe('create', () => {
    it('should create and return the created dish with slug', () => {
      const created = controller.create({
        title: 'Удон з яловичиною',
        price: 260,
        weightGrams: 320,
        calories: 520,
        isSpicy: true,
      });

      expect(created.title).toBe('Удон з яловичиною');
      expect(created.slug).toBe('udon-z-yalovychynoyu');
      expect(created.id).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update dish fields', () => {
      const updated = controller.update('1', { price: 215 });
      expect(updated.price).toBe(215);
    });
  });

  describe('remove', () => {
    it('should call service remove', () => {
      expect(() => controller.remove('2')).not.toThrow();
    });
  });
});
