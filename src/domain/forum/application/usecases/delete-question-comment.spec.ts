import { fakerPT_BR as faker } from '@faker-js/faker';

import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';
import { makeQuestion } from 'tests/factories/make-question';
import { makeQuestionComment } from 'tests/factories/make-question-comment';
import { InMemoryQuestionAttachementsRepository } from 'tests/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionCommentsRepository } from 'tests/repositories/in-memory-question-comments-repository';
import { InMemoryQuestionsRepository } from 'tests/repositories/in-memory-questions-repository';

import { DeleteQuestionCommentUseCase } from './delete-question-comment';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachementsRepository;
let sut: DeleteQuestionCommentUseCase;

describe('DeleteQuestionCommentUseCaseUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachementsRepository();
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository);
  });

  it('should be able to delete a question comment', async () => {
    const { question } = makeQuestion();
    const { authorId, questionComment } = makeQuestionComment({
      questionId: question.id,
    });
    const questionCommentId = questionComment.id.toString();

    await inMemoryQuestionsRepository.create(question);
    await inMemoryQuestionCommentsRepository.create(questionComment);

    await sut.execute({ authorId, questionCommentId });

    const questionCommentDeleted =
      await inMemoryQuestionCommentsRepository.findById(questionCommentId);

    expect(questionCommentDeleted).toEqual(null);
  });

  it('should not be able to delete another user question comment', async () => {
    const { question } = makeQuestion();
    const { questionComment } = makeQuestionComment({
      questionId: question.id,
    });
    const questionCommentId = questionComment.id.toString();
    const wrongAuthorId = faker.string.uuid();

    await inMemoryQuestionsRepository.create(question);
    await inMemoryQuestionCommentsRepository.create(questionComment);

    const result = await sut.execute({
      authorId: wrongAuthorId,
      questionCommentId,
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to delete not found question comment', async () => {
    const wrongAuthorId = faker.string.uuid();
    const wrongQuestionCommentId = faker.string.uuid();

    const result = await sut.execute({
      authorId: wrongAuthorId,
      questionCommentId: wrongQuestionCommentId,
    });

    expect(result.isLeft()).toBe(true);
    expect(result?.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
