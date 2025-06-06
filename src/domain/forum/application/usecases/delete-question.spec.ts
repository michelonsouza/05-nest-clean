import { fakerPT_BR as faker } from '@faker-js/faker';

import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';
import { makeQuestion } from 'tests/factories/make-question';
import { makeQuestionAttachment } from 'tests/factories/make-question-attachment';
import { InMemoryQuestionAttachementsRepository } from 'tests/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from 'tests/repositories/in-memory-questions-repository';

import { DeleteQuestionUseCase } from './delete-question';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachementsRepository;
let sut: DeleteQuestionUseCase;

describe('DeleteQuestionUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachementsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository);
  });

  it('should be able to delete a question by id', async () => {
    const { question, authorId } = makeQuestion();
    const questionAttachmentQuantity = faker.number.int({ min: 1, max: 5 });
    const questionAttachments = Array.from(
      { length: questionAttachmentQuantity },
      () => {
        const { questionAttachment } = makeQuestionAttachment({
          questionId: question.id,
          attachmentId: question.id,
        });
        return questionAttachment;
      },
    );

    await Promise.all(
      questionAttachments.map(questionAttachment =>
        inMemoryQuestionAttachmentsRepository.create(questionAttachment),
      ),
    );

    await inMemoryQuestionsRepository.create(question);

    await sut.execute({ questionId: question.id.toValue(), authorId });

    expect(inMemoryQuestionsRepository.items).not.toEqual(
      expect.arrayContaining([question]),
    );
    expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a question from another user', async () => {
    const { question } = makeQuestion();
    const wrongAuthorId = faker.string.uuid();

    await inMemoryQuestionsRepository.create(question);

    const result = await sut.execute({
      questionId: question.id.toValue(),
      authorId: wrongAuthorId,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(inMemoryQuestionsRepository.items).toEqual(
      expect.arrayContaining([question]),
    );
  });

  it('should not be able to delete a not found question', async () => {
    const result = await sut.execute({
      questionId: faker.string.uuid(),
      authorId: faker.string.uuid(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
