import { fakerPT_BR as faker } from '@faker-js/faker';
import { subDays } from 'date-fns';

import { makeAnswer } from 'tests/factories/make-answer';
import { makeQuestion } from 'tests/factories/make-question';
import { InMemoryAnswerAttachementsRepository } from 'tests/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswersRepository } from 'tests/repositories/in-memory-answers-repository';
import { InMemoryQuestionAttachementsRepository } from 'tests/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from 'tests/repositories/in-memory-questions-repository';

import { ListQuestionAnswersUseCase } from './list-question-answers';
import type { Question } from '../../enterprise/entities/question';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachementsRepository;
let inMemoryAnswerAttachementsRepository: InMemoryAnswerAttachementsRepository;
let sut: ListQuestionAnswersUseCase;
let question: Question;
let anotherQuestion: Question;

describe('ListQuestionAnswersUseCase', () => {
  beforeEach(async () => {
    inMemoryAnswerAttachementsRepository =
      new InMemoryAnswerAttachementsRepository();
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachementsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachementsRepository,
    );
    sut = new ListQuestionAnswersUseCase(inMemoryAnswersRepository);

    const { question: q } = makeQuestion();
    const { question: anotherQ } = makeQuestion();
    question = q;
    anotherQuestion = anotherQ;

    await Promise.all([
      inMemoryQuestionsRepository.create(question),
      inMemoryQuestionsRepository.create(anotherQuestion),
    ]);
  });

  it('should be able to list question answers by question ID', async () => {
    const questionId = question.id;
    const anotherQuestionId = anotherQuestion.id;
    const questionIds = [questionId.toString(), anotherQuestionId.toString()];
    const questionIndex = faker.number.int({
      min: 0,
      max: 1,
    });
    const answersQuantity = faker.number.int({ min: 2, max: 20 });
    const anotherAnswersQuantity = faker.number.int({ min: 2, max: 20 });
    const answers = Array.from({ length: answersQuantity }, () => {
      const { answer } = makeAnswer({
        questionId,
        createdAt: subDays(new Date(), faker.number.int({ min: 1, max: 30 })),
      });

      return answer;
    });
    const anotherAnswers = Array.from(
      { length: anotherAnswersQuantity },
      () => {
        const { answer } = makeAnswer({
          questionId: anotherQuestionId,
          createdAt: subDays(new Date(), faker.number.int({ min: 1, max: 30 })),
        });

        return answer;
      },
    );
    const allAnswers = [...answers, ...anotherAnswers];
    const answersToCompare = questionIndex === 0 ? answers : anotherAnswers;

    await Promise.all(
      allAnswers.map((answer) => {
        return inMemoryAnswersRepository.create(answer);
      }),
    );

    const result = await sut.execute({
      questionId: questionIds[questionIndex],
      page: 1,
    });

    const { data } = result.value!;

    expect(data).toHaveLength(answersToCompare.length);
    expect(data).toEqual(expect.arrayContaining(answersToCompare));
  });

  it('should be able to list paginated question answers by question ID', async () => {
    const questionId = question.id;
    const answersQuantity = faker.number.int({ min: 20, max: 60 });
    const mockedAnswers = Array.from({ length: answersQuantity }, () => {
      const { answer } = makeAnswer({
        questionId,
        createdAt: subDays(new Date(), faker.number.int({ min: 1, max: 30 })),
      });

      return answer;
    });
    let page = answersQuantity % 3 === 0 ? 3 : 1;

    if (answersQuantity % 2 === 0) {
      page = 2;
    }

    const mockedAnswersPerPage = [...mockedAnswers].slice(
      (page - 1) * 20,
      page * 20,
    );

    await Promise.all(
      mockedAnswers.map((answer) => {
        return inMemoryAnswersRepository.create(answer);
      }),
    );

    const result = await sut.execute({
      questionId: question.id.toString(),
      page,
    });

    const { data: answers } = result.value!;

    expect(result.isRight()).toBe(true);
    expect(answers.length).toEqual(mockedAnswersPerPage.length);
  });
});
