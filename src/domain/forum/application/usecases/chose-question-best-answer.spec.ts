import { fakerPT_BR as faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';
import { makeAnswer } from 'tests/factories/make-answer';
import { makeQuestion } from 'tests/factories/make-question';
import { InMemoryAnswerAttachementsRepository } from 'tests/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswersRepository } from 'tests/repositories/in-memory-answers-repository';
import { InMemoryQuestionAttachementsRepository } from 'tests/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from 'tests/repositories/in-memory-questions-repository';

import { ChoseQuestionBestAnswerUseCase } from './chose-question-best-answer';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswerAttachementsRepository: InMemoryAnswerAttachementsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachementsRepository;
let sut: ChoseQuestionBestAnswerUseCase;

describe('ChoseQuestionBestAnswerUseCase', () => {
  beforeEach(() => {
    inMemoryAnswerAttachementsRepository =
      new InMemoryAnswerAttachementsRepository();
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachementsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachementsRepository,
    );
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    sut = new ChoseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository,
    );
  });

  it('should be able to chose question best answer', async () => {
    const { question } = makeQuestion();
    const { answer } = makeAnswer({
      authorId: question.authorId,
      questionId: question.id,
    });

    await inMemoryQuestionsRepository.create(question);
    await inMemoryAnswersRepository.create(answer);

    await sut.execute({
      answerId: answer.id.toValue(),
      authorId: question.authorId.toValue(),
    });

    expect(
      inMemoryQuestionsRepository.items[0].bestAnswerId?.toValue(),
    ).toEqual(answer.id.toValue());
  });

  it('should not be able to chose another user question best answer', async () => {
    const { question } = makeQuestion();
    const { answer } = makeAnswer({
      authorId: question.authorId,
      questionId: question.id,
    });

    await inMemoryQuestionsRepository.create(question);
    await inMemoryAnswersRepository.create(answer);

    const result = await sut.execute({
      answerId: answer.id.toValue(),
      authorId: faker.string.uuid(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to chose not found question', async () => {
    const { answer } = makeAnswer({
      authorId: new UniqueEntityID(faker.string.uuid()),
      questionId: new UniqueEntityID(faker.string.uuid()),
    });

    await inMemoryAnswersRepository.create(answer);

    const result = await sut.execute({
      answerId: answer.id.toValue(),
      authorId: answer.authorId.toValue(),
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to chose not found answer', async () => {
    const result = await sut.execute({
      answerId: faker.string.uuid(),
      authorId: faker.string.uuid(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
