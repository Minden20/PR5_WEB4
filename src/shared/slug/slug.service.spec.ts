import { Test, TestingModule } from '@nestjs/testing';
import { SlugService } from './slug.service.js';

describe('SlugService', () => {
  let service: SlugService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SlugService],
    }).compile();

    service = module.get<SlugService>(SlugService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should transform English text to slug', () => {
    expect(service.generateSlug('Pro Laptop 16')).toBe('pro-laptop-16');
  });

  it('should transliterate Ukrainian Cyrillic text to slug', () => {
    expect(service.generateSlug('Український борщ із пампушками')).toBe(
      'ukrayinskyi-borshch-iz-pampushkamy',
    );
  });

  it('should handle special symbols and apostrophes correctly', () => {
    expect(service.generateSlug('М’ясна піца & паста!')).toBe('myasna-pitsa-pasta');
  });

  it('should handle multiple consecutive spaces and dashes', () => {
    expect(service.generateSlug('  Смачна    страва --- №1  ')).toBe(
      'smachna-strava-1',
    );
  });

  it('should return empty string for empty input', () => {
    expect(service.generateSlug('')).toBe('');
  });
});
