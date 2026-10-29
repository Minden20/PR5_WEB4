import { Provider } from '@nestjs/common';

export const STORE_CONFIG = 'STORE_CONFIG';

export interface StoreConfig {
  storeName: string;
  defaultCurrency: string;
  taxPercent: number;
}

export const storeConfigValue: StoreConfig = {
  storeName: 'Gourmet Express Delivery',
  defaultCurrency: 'UAH',
  taxPercent: 5,
};

export const StoreConfigProvider: Provider = {
  provide: STORE_CONFIG,
  useValue: storeConfigValue,
};
