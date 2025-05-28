import { fakerPT_BR as faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import supertest from 'supertest';

import { AppModule } from '@infra/app.module';
import { PrismaService } from '@infra/database/prisma/prisma.service';

describe('Authenticate', () => {
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

  it('[POST] /sessions', async () => {
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    await prismaService.user.create({
      data: {
        name,
        email,
        password: await hash(password, 10),
      },
    });

    const response = await supertest(app.getHttpServer())
      .post('/sessions')
      .send({
        email,
        password,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      accessToken: expect.any(String) as string,
    });
  });

  it('[POST] /sessions - 401 (Password not match)', async () => {
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    await prismaService.user.create({
      data: {
        name,
        email,
        password: await hash(password, 10),
      },
    });

    const response = await supertest(app.getHttpServer())
      .post('/sessions')
      .send({
        email,
        password: faker.internet.password(), // Using a different password to simulate user not exists
      });

    expect(response.statusCode).toBe(401);
  });

  it('[POST] /sessions - 401 (User not exists)', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();

    const response = await supertest(app.getHttpServer())
      .post('/sessions')
      .send({
        email,
        password,
      });

    expect(response.statusCode).toBe(401);
  });
});
