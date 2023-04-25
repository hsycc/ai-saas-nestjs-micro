import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
import { OrderSvcModule } from './../src/order-svc.module';

describe('OrderSvcController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [OrderSvcModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
});
