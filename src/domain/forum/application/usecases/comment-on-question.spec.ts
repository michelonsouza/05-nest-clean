import { ResourceNotFoundError } from '@/core/errors/resource-not-found';
import { makeQuestion } from 'tests/factories/make-question';
import { makeQuestionComment } from 'tests/factories/make-question-comment';
import { InMemoryQuestionAttachementsRepository } from 'tests/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionCommentsRepository } from 'tests/repositories/in-memory-question-comments-repository';
import { InMemoryQuestionsRepository } from 'tests/repositories/in-memory-questions-repository';

import { CommentOnQuestionUseCase } from './comment-on-question';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachementsRepository;
let sut: CommentOnQuestionUseCase;

describe('CommentOnQuestionUseCaseUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachementsRepository();
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository,
    );
  });

  it('should be able to create question comment', async () => {
    const { question } = makeQuestion();
    const { authorId, content, questionId } = makeQuestionComment({
      questionId: question.id,
    });

    await inMemoryQuestionsRepository.create(question);

    await sut.execute({ authorId, questionId, content });

    const [questionCommentCreated] = inMemoryQuestionCommentsRepository.items;

    expect(questionCommentCreated.content).toEqual(content);
    expect(questionCommentCreated.authorId?.toString()).toEqual(authorId);
    expect(questionCommentCreated.questionId?.toString()).toEqual(questionId);
  });

  it('should not be able to create question comment on unexistent question', async () => {
    const { question } = makeQuestion();
    const { authorId, content, questionId } = makeQuestionComment({
      questionId: question.id,
    });

    const result = await sut.execute({ authorId, questionId, content });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
