import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthSvcModule } from './../src/auth-svc.module';

describe('AuthSvcController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthSvcModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
});
