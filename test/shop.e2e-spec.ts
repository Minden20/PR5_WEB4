import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('Online Store (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/dishes', () => {
    it('GET /dishes returns all dishes with slug', async () => {
      const response = await request(app.getHttpServer())
        .get('/dishes')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(3);
      expect(response.body[0].slug).toBe('ukrayinskyi-borshch-iz-pampushkamy');
    });

    it('GET /dishes/slug/:slug returns specific dish', async () => {
      const response = await request(app.getHttpServer())
        .get('/dishes/slug/ukrayinskyi-borshch-iz-pampushkamy')
        .expect(200);

      expect(response.body.id).toBe('1');
      expect(response.body.title).toBe('Український борщ із пампушками');
    });

    it('POST /dishes creates new dish with generated slug', async () => {
      const newDish = {
        title: 'Грибний крем-суп',
        price: 180,
        weightGrams: 300,
        calories: 320,
        isSpicy: false,
      };

      const response = await request(app.getHttpServer())
        .post('/dishes')
        .send(newDish)
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.title).toBe('Грибний крем-суп');
      expect(response.body.slug).toBe('hrybnyi-krem-sup');
    });
  });

  describe('/orders', () => {
    it('POST /orders creates an order with tax and fee calculation via custom providers', async () => {
      const orderPayload = {
        productId: '1',
        quantity: 2,
      };

      const response = await request(app.getHttpServer())
        .post('/orders')
        .send(orderPayload)
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.productId).toBe('1');
      expect(response.body.productTitle).toBe('Український борщ із пампушками');
      expect(response.body.quantity).toBe(2);
      expect(response.body.unitPrice).toBe(195);
      expect(response.body.subtotal).toBe(390);
      expect(response.body.taxPercent).toBe(5);
      expect(response.body.tax).toBe(19.5);
      expect(response.body.totalAmount).toBe(409.5);
      expect(response.body.currency).toBe('UAH');
    });

    it('POST /orders returns 404 for non-existent product', async () => {
      await request(app.getHttpServer())
        .post('/orders')
        .send({ productId: 'invalid-id-999', quantity: 1 })
        .expect(404);
    });

    it('GET /orders returns list of created orders', async () => {
      await request(app.getHttpServer())
        .post('/orders')
        .send({ productId: '2', quantity: 1 })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/orders')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });
  });
});
