import { Module } from '@nestjs/common';
import { SlugService } from './slug/slug.service.js';
import {
  STORE_CONFIG,
  StoreConfigProvider,
} from './config/app-config.provider.js';
import {
  FEE_CALCULATOR,
  FeeCalculatorProvider,
} from './config/fee-calculator.provider.js';

@Module({
  providers: [SlugService, StoreConfigProvider, FeeCalculatorProvider],
  exports: [
    SlugService,
    STORE_CONFIG,
    StoreConfigProvider,
    FEE_CALCULATOR,
    FeeCalculatorProvider,
  ],
})
export class SharedModule {}
