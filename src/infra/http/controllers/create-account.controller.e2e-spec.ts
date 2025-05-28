import { fakerPT_BR as faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import supertest from 'supertest';

import { AppModule } from '@infra/app.module';
import { PrismaService } from '@infra/database/prisma/prisma.service';

describe('Create account', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prismaService = moduleRef.get<PrismaService>(PrismaService);

    await app.init();
  });

  it('[POST] /accounts', async () => {
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    const response = await supertest(app.getHttpServer())
      .post('/accounts')
      .send({
        name,
        email,
        password,
      });

    const userOnDatabase = await prismaService.user.findUnique({
      where: {
        email,
      },
    });

    expect(response.statusCode).toBe(201);
    expect(userOnDatabase).toBeTruthy();
  });

  it('[POST] /accounts - 409', async () => {
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    await prismaService.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    const response = await supertest(app.getHttpServer())
      .post('/accounts')
      .send({
        name,
        email,
        password,
      });

    expect(response.statusCode).toBe(409);
  });
});
