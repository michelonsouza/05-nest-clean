import { fakerPT_BR as faker } from '@faker-js/faker';
import { subDays } from 'date-fns';

import { makeQuestion } from 'tests/factories/make-question';
import { makeQuestionComment } from 'tests/factories/make-question-comment';
import { InMemoryQuestionAttachementsRepository } from 'tests/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionCommentsRepository } from 'tests/repositories/in-memory-question-comments-repository';
import { InMemoryQuestionsRepository } from 'tests/repositories/in-memory-questions-repository';

import { ListQuestionCommentsUseCase } from './list-question-comments';
import type { Question } from '../../enterprise/entities/question';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachementsRepository;
let sut: ListQuestionCommentsUseCase;
let question: Question;
let anotherQuestion: Question;

describe('ListQuestionCommentsUseCase', () => {
  beforeEach(async () => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachementsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    sut = new ListQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);

    const { question: q } = makeQuestion();
    const { question: anotherQ } = makeQuestion();
    question = q;
    anotherQuestion = anotherQ;

    await Promise.all([
      inMemoryQuestionsRepository.create(question),
      inMemoryQuestionsRepository.create(anotherQuestion),
    ]);
  });

  it('should be able to list question comments by question ID', async () => {
    const questionId = question.id;
    const anotherQuestionId = anotherQuestion.id;
    const questionIds = [questionId.toString(), anotherQuestionId.toString()];
    const questionIndex = faker.number.int({
      min: 0,
      max: 1,
    });
    const answersQuantity = faker.number.int({ min: 2, max: 20 });
    const anotherQuestionCommentsQuantity = faker.number.int({
      min: 2,
      max: 20,
    });
    const questionComments = Array.from({ length: answersQuantity }, () => {
      const { questionComment } = makeQuestionComment({
        questionId,
        createdAt: subDays(new Date(), faker.number.int({ min: 1, max: 30 })),
      });

      return questionComment;
    });
    const anotherQuestionComments = Array.from(
      { length: anotherQuestionCommentsQuantity },
      () => {
        const { questionComment } = makeQuestionComment({
          questionId: anotherQuestionId,
          createdAt: subDays(new Date(), faker.number.int({ min: 1, max: 30 })),
        });

        return questionComment;
      },
    );
    const allComments = [...questionComments, ...anotherQuestionComments];
    const answersToCompare =
      questionIndex === 0 ? questionComments : anotherQuestionComments;

    await Promise.all(
      allComments.map((comment) => {
        return inMemoryQuestionCommentsRepository.create(comment);
      }),
    );

    const result = await sut.execute({
      questionId: questionIds[questionIndex],
      page: 1,
    });

    const { data } = result.value!;

    expect(result.isRight()).toBe(true);
    expect(data).toHaveLength(answersToCompare.length);
    expect(data).toEqual(expect.arrayContaining(answersToCompare));
  });

  it('should be able to list paginated question comments by question ID', async () => {
    const questionId = question.id;
    const answersQuantity = faker.number.int({ min: 20, max: 60 });
    const mockedAnswers = Array.from({ length: answersQuantity }, () => {
      const { questionComment } = makeQuestionComment({
        questionId,
        createdAt: subDays(new Date(), faker.number.int({ min: 1, max: 30 })),
      });

      return questionComment;
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
        return inMemoryQuestionCommentsRepository.create(answer);
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
