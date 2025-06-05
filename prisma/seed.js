/* eslint-disable @typescript-eslint/no-require-imports */
const { fakerPT_BR: faker } = require('@faker-js/faker');
const { hash } = require('bcryptjs');
require('dotenv/config');

const { PrismaClient } = require('./generated/prisma/index.js');


const prisma = new PrismaClient();

async function seed() {
  const basePassword = await hash('123456', 8);
  const dataLength = 10;

  const fakeUsers = Array.from({ length: dataLength }, () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;
    const email = faker.internet.email({ firstName, lastName });

    return {
      name,
      email,
      password: basePassword,
    }
  });

  const createdUsers = await prisma.user.createMany({
    data: fakeUsers,
  });
  console.log(`Created ${createdUsers.count} users`);

  const users = await prisma.user.findMany();

  const fakeQuestions = Array.from({ length: dataLength }, (_, index) => {
    const title = faker.lorem.sentence();
    const slug = faker.helpers.slugify(title);

    return {
      slug,
      title,
      authorId: users[index]?.id,
      content: faker.lorem.paragraph(),
    }
  });

  const createdQuestions = await prisma.question.createMany({
    data: fakeQuestions,
  });
  console.log(`Created ${createdQuestions.count} questions`);

  const questions = await prisma.question.findMany();
  const fakeQuestionAnswers = Array.from({ length: dataLength }, (_, index) => {
    return {
      content: faker.lorem.paragraph(),
      questionId: questions[index]?.id,
      authorId: users[index]?.id,
    }
  });

  const createdQuestionAnswers = await prisma.answer.createMany({
    data: fakeQuestionAnswers,
  });
  console.log(`Created ${createdQuestionAnswers.count} question answers`);
}

seed().catch(error => {
  console.error('Error seeding database:', error);
  process.exit(1);
}).finally(() => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  prisma.$disconnect();
})
