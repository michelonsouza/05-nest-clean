import { fakerPT_BR as faker } from '@faker-js/faker';

import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';
import { makeAnswer } from 'tests/factories/make-answer';
import { makeAnswerComment } from 'tests/factories/make-answer-comment';
import { InMemoryAnswerAttachementsRepository } from 'tests/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswerCommentsRepository } from 'tests/repositories/in-memory-answer-comments-repository';
import { InMemoryAnswersRepository } from 'tests/repositories/in-memory-answers-repository';

import { DeleteAnswerCommentUseCase } from './delete-answer-comment';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachementsRepository: InMemoryAnswerAttachementsRepository;
let sut: DeleteAnswerCommentUseCase;

describe('DeleteAnswerCommentUseCaseUseCase', () => {
  beforeEach(() => {
    inMemoryAnswerAttachementsRepository =
      new InMemoryAnswerAttachementsRepository();
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachementsRepository,
    );
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository);
  });

  it('should be able to delete a question comment', async () => {
    const { answer } = makeAnswer();
    const { authorId, answerComment } = makeAnswerComment({
      answerId: answer.id,
    });
    const answerCommentId = answerComment.id.toString();

    await inMemoryAnswersRepository.create(answer);
    await inMemoryAnswerCommentsRepository.create(answerComment);

    await sut.execute({ authorId, answerCommentId });

    const questionCommentDeleted =
      await inMemoryAnswerCommentsRepository.findById(answerCommentId);

    expect(questionCommentDeleted).toEqual(null);
  });

  it('should not be able to delete another user question comment', async () => {
    const { answer } = makeAnswer();
    const { answerComment } = makeAnswerComment({
      answerId: answer.id,
    });
    const answerCommentId = answerComment.id.toString();
    const wrongAuthorId = faker.string.uuid();

    await inMemoryAnswersRepository.create(answer);
    await inMemoryAnswerCommentsRepository.create(answerComment);

    const result = await sut.execute({
      authorId: wrongAuthorId,
      answerCommentId,
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to delete not found question comment', async () => {
    const wrongAuthorId = faker.string.uuid();
    const wronganswerCommentId = faker.string.uuid();

    const result = await sut.execute({
      authorId: wrongAuthorId,
      answerCommentId: wronganswerCommentId,
    });
    expect(result.isLeft()).toBe(true);
    expect(result?.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
