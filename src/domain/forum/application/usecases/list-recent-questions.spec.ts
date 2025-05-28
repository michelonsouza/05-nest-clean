import { fakerPT_BR as faker } from '@faker-js/faker';
import { subDays } from 'date-fns';

import { makeQuestion } from 'tests/factories/make-question';
import { InMemoryQuestionAttachementsRepository } from 'tests/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from 'tests/repositories/in-memory-questions-repository';

import { ListRecentQuestionsUseCase } from './list-recent-questions';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachementsRepository;
let sut: ListRecentQuestionsUseCase;

describe('ListRecentQuestionsUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachementsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    sut = new ListRecentQuestionsUseCase(inMemoryQuestionsRepository);
  });

  it('should be able to list recent questions', async () => {
    const questionsQuantity = faker.number.int({ min: 2, max: 20 });
    const createdAt = faker.date.past({ refDate: new Date() });
    const mockedQuestions = Array.from(
      { length: questionsQuantity },
      (_, index) => {
        const { question } = makeQuestion({
          createdAt: subDays(createdAt, index),
        });

        return question;
      },
    );

    await Promise.all(
      mockedQuestions.map(async (question) =>
        inMemoryQuestionsRepository.create(question),
      ),
    );

    const result = await sut.execute({ page: 1 });
    const { data: questions } = result.value!;

    expect(result.isRight()).toBe(true);
    expect(questions).toEqual(expect.arrayContaining(mockedQuestions));
    expect(questions[0].createdAt).toEqual(createdAt);
  });

  it('should be able to list paginated recent questions', async () => {
    const questionsQuantity = faker.number.int({ min: 20, max: 60 });
    const createdAt = faker.date.past({ refDate: new Date() });
    let page = questionsQuantity % 3 === 0 ? 3 : 1;

    if (questionsQuantity % 2 === 0) {
      page = 2;
    }

    const mockedQuestions = Array.from(
      { length: questionsQuantity },
      (_, index) => {
        const { question } = makeQuestion({
          createdAt: subDays(createdAt, index),
        });

        return question;
      },
    );
    const mockedQuestionsPerPage = [...mockedQuestions].slice(
      (page - 1) * 20,
      page * 20,
    );

    await Promise.all(
      mockedQuestions.map(async (question) =>
        inMemoryQuestionsRepository.create(question),
      ),
    );

    const result = await sut.execute({ page });
    const { data: questions } = result.value!;

    expect(result.isRight()).toBe(true);
    expect(questions).toEqual(expect.arrayContaining(mockedQuestionsPerPage));
  });
});
