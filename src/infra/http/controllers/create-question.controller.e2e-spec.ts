import { fakerPT_BR as faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import supertest from 'supertest';

import { AppModule } from '@infra/app.module';
import { PrismaService } from '@infra/database/prisma/prisma.service';

describe('Create Question', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prismaService = moduleRef.get<PrismaService>(PrismaService);
    jwtService = moduleRef.get<JwtService>(JwtService);

    await app.init();
  });

  it('[POST] /questions', async () => {
    const title = faker.lorem.sentence();
    const content = faker.lorem.paragraphs();

    const name = faker.person.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    const user = await prismaService.user.create({
      data: {
        name,
        email,
        password: await hash(password, 10),
      },
    });

    const accessToken = jwtService.sign({
      sub: user.id,
    });

    const response = await supertest(app.getHttpServer())
      .post('/questions')
      .send({
        title,
        content,
      })
      .set('Authorization', `Bearer ${accessToken}`);

    const questionOnDatabase = await prismaService.question.findFirst({
      where: {
        title,
      },
    });

    expect(response.statusCode).toBe(201);
    expect(questionOnDatabase).toBeTruthy();
  });
});
