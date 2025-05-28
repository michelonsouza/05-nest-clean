/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { fakerPT_BR as faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import { addHours } from 'date-fns';
import supertest from 'supertest';

import { AppModule } from '@infra/app.module';
import { PrismaService } from '@infra/database/prisma/prisma.service';

describe.only('List recent questions', () => {
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
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const questionsQuantity = faker.number.int({ min: 1, max: 40 });
    const baseDate = faker.date.past();

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

    const questionsToCreate = Array.from({ length: questionsQuantity }).map(
      (_, index) => {
        const title = faker.lorem.sentence();

        return {
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraphs(),
          authorId: user.id,
          slug: faker.helpers.slugify(title),
          createdAt: addHours(baseDate, index),
        };
      },
    );

    await Promise.all(
      questionsToCreate.map((question) =>
        prismaService.question.create({ data: question }),
      ),
    );

    const response = await supertest(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`);

    const formattedCreatedQuestion = {
      ...questionsToCreate[questionsQuantity - 1],
      createdAt:
        questionsToCreate[questionsQuantity - 1].createdAt.toISOString(),
    };

    const compareValue = response.body?.data?.[0] as unknown;

    expect(response.statusCode).toBe(200);
    expect(compareValue).toEqual(
      expect.objectContaining({
        createdAt: formattedCreatedQuestion.createdAt,
      }),
    );
  });
});
