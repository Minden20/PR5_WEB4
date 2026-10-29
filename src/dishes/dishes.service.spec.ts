import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DishesService } from './dishes.service.js';
import { SlugService } from '../shared/slug/slug.service.js';

describe('DishesService', () => {
  let service: DishesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DishesService, SlugService],
    }).compile();

    service = module.get<DishesService>(DishesService);
    service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all initial dishes with slugs', () => {
      const dishes = service.findAll();
      expect(dishes.length).toBeGreaterThanOrEqual(3);
      expect(dishes[0].slug).toBeDefined();
    });

    it('should filter by title search query (case-insensitive)', () => {
      const results = service.findAll({ search: 'борщ' });
      expect(results.length).toBe(1);
      expect(results[0].title).toContain('борщ');
    });

    it('should filter by isSpicy flag', () => {
      const spicyDishes = service.findAll({ isSpicy: true });
      expect(spicyDishes.every((d) => d.isSpicy === true)).toBe(true);
    });

    it('should filter by maxPrice', () => {
      const cheapDishes = service.findAll({ maxPrice: 200 });
      expect(cheapDishes.every((d) => d.price <= 200)).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should return a dish when it exists', () => {
      const dish = service.findOne('1');
      expect(dish).toBeDefined();
      expect(dish.id).toBe('1');
    });

    it('should throw NotFoundException when dish does not exist', () => {
      expect(() => service.findOne('non-existent-id')).toThrow(
        NotFoundException,
      );
    });
  });

  describe('findBySlug', () => {
    it('should find dish by slug', () => {
      const dish = service.findBySlug('ukrayinskyi-borshch-iz-pampushkamy');
      expect(dish).toBeDefined();
      expect(dish.id).toBe('1');
    });

    it('should throw NotFoundException when dish with slug does not exist', () => {
      expect(() => service.findBySlug('unknown-slug')).toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create and return a new dish with generated id and slug', () => {
      const newDish = service.create({
        title: 'Салат Цезар з куркою',
        price: 210,
        weightGrams: 280,
        calories: 450,
        isSpicy: false,
      });

      expect(newDish.id).toBeDefined();
      expect(newDish.title).toBe('Салат Цезар з куркою');
      expect(newDish.slug).toBe('salat-tsezar-z-kurkoyu');
      expect(newDish.price).toBe(210);

      const found = service.findOne(newDish.id);
      expect(found).toEqual(newDish);
    });
  });

  describe('update', () => {
    it('should update existing dish fields and update slug when title changes', () => {
      const updated = service.update('1', {
        title: 'Борщ полтавський',
        price: 220,
        isSpicy: true,
      });

      expect(updated.id).toBe('1');
      expect(updated.price).toBe(220);
      expect(updated.isSpicy).toBe(true);
      expect(updated.title).toBe('Борщ полтавський');
      expect(updated.slug).toBe('borshch-poltavskyi');
    });

    it('should throw NotFoundException when updating non-existent dish', () => {
      expect(() => service.update('999999', { title: 'Ghost dish' })).toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove existing dish', () => {
      service.remove('1');
      expect(() => service.findOne('1')).toThrow(NotFoundException);
    });

    it('should throw NotFoundException when removing non-existent dish', () => {
      expect(() => service.remove('999999')).toThrow(NotFoundException);
    });
  });
});
