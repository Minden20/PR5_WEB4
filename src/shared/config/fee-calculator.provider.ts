import { Provider } from '@nestjs/common';
import { STORE_CONFIG, StoreConfig } from './app-config.provider.js';

export const FEE_CALCULATOR = 'FEE_CALCULATOR';

export interface FeeCalculator {
  calculateTax(amount: number): number;
}

export const FeeCalculatorProvider: Provider = {
  provide: FEE_CALCULATOR,
  useFactory: (config: StoreConfig): FeeCalculator => {
    return {
      calculateTax: (amount: number): number => {
        const tax = (amount * config.taxPercent) / 100;
        return Math.round(tax * 100) / 100;
      },
    };
  },
  inject: [STORE_CONFIG],
};
