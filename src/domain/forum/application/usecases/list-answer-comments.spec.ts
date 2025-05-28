import { fakerPT_BR as faker } from '@faker-js/faker';
import { subDays } from 'date-fns';

import { makeAnswer } from 'tests/factories/make-answer';
import { makeAnswerComment } from 'tests/factories/make-answer-comment';
import { InMemoryAnswerAttachementsRepository } from 'tests/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswerCommentsRepository } from 'tests/repositories/in-memory-answer-comments-repository';
import { InMemoryAnswersRepository } from 'tests/repositories/in-memory-answers-repository';

import { ListAnswerCommentsUseCase } from './list-answer-comments';
import type { Answer } from '../../enterprise/entities/answer';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryAnswerAttachementsRepository: InMemoryAnswerAttachementsRepository;
let sut: ListAnswerCommentsUseCase;
let answer: Answer;
let anotherAnswer: Answer;

describe('ListAnswerCommentsUseCase', () => {
  beforeEach(async () => {
    inMemoryAnswerAttachementsRepository =
      new InMemoryAnswerAttachementsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachementsRepository,
    );
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new ListAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);

    const { answer: a } = makeAnswer();
    const { answer: anotherA } = makeAnswer();
    answer = a;
    anotherAnswer = anotherA;

    await Promise.all([
      inMemoryAnswersRepository.create(answer),
      inMemoryAnswersRepository.create(anotherAnswer),
    ]);
  });

  it('should be able to list answer comments by question ID', async () => {
    const answerId = answer.id;
    const anotherAnswerId = anotherAnswer.id;
    const answerIds = [answerId.toString(), anotherAnswerId.toString()];
    const answerIndex = faker.number.int({
      min: 0,
      max: 1,
    });
    const answersQuantity = faker.number.int({ min: 2, max: 20 });
    const anotherAnswerCommentsQuantity = faker.number.int({
      min: 2,
      max: 20,
    });
    const answerComments = Array.from({ length: answersQuantity }, () => {
      const { answerComment } = makeAnswerComment({
        answerId,
        createdAt: subDays(new Date(), faker.number.int({ min: 1, max: 30 })),
      });

      return answerComment;
    });
    const anotherAnswerComments = Array.from(
      { length: anotherAnswerCommentsQuantity },
      () => {
        const { answerComment } = makeAnswerComment({
          answerId: anotherAnswerId,
          createdAt: subDays(new Date(), faker.number.int({ min: 1, max: 30 })),
        });

        return answerComment;
      },
    );
    const allComments = [...answerComments, ...anotherAnswerComments];
    const answersToCompare =
      answerIndex === 0 ? answerComments : anotherAnswerComments;

    await Promise.all(
      allComments.map((comment) => {
        return inMemoryAnswerCommentsRepository.create(comment);
      }),
    );

    const result = await sut.execute({
      answerId: answerIds[answerIndex],
      page: 1,
    });

    const { data: comments } = result.value!;

    expect(result.isRight()).toBe(true);
    expect(comments).toHaveLength(answersToCompare.length);
    expect(comments).toEqual(expect.arrayContaining(answersToCompare));
  });

  it('should be able to list paginated answer comments by question ID', async () => {
    const answerId = answer.id;
    const answersQuantity = faker.number.int({ min: 20, max: 60 });
    const mockedAnswers = Array.from({ length: answersQuantity }, () => {
      const { answerComment } = makeAnswerComment({
        answerId,
        createdAt: subDays(new Date(), faker.number.int({ min: 1, max: 30 })),
      });

      return answerComment;
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
        return inMemoryAnswerCommentsRepository.create(answer);
      }),
    );

    const result = await sut.execute({
      answerId: answer.id.toString(),
      page,
    });

    const answers = result?.value?.data;

    expect(result?.isRight()).toBe(true);
    expect(answers?.length).toEqual(mockedAnswersPerPage.length);
  });
});
