import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
import { ProductSvcModule } from './../src/product-svc.module';

describe('ProductSvcController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProductSvcModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
});
