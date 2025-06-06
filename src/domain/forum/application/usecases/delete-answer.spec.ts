import { fakerPT_BR as faker } from '@faker-js/faker';

import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';
import { makeAnswer } from 'tests/factories/make-answer';
import { makeAnswerAttachment } from 'tests/factories/make-answer-attachment';
import { InMemoryAnswerAttachementsRepository } from 'tests/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswersRepository } from 'tests/repositories/in-memory-answers-repository';

import { DeleteAnswerUseCase } from './delete-answer';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachementsRepository: InMemoryAnswerAttachementsRepository;
let sut: DeleteAnswerUseCase;

describe('DeleteAnswerUseCase', () => {
  beforeEach(() => {
    inMemoryAnswerAttachementsRepository =
      new InMemoryAnswerAttachementsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachementsRepository,
    );
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository);
  });

  it('should be able to delete a answer by id', async () => {
    const { answer, authorId } = makeAnswer();
    const answerAttachmentQuantity = faker.number.int({ min: 1, max: 5 });
    const answerAttachments = Array.from(
      { length: answerAttachmentQuantity },
      () => {
        const { answerAttachment } = makeAnswerAttachment({
          answerId: answer.id,
          attachmentId: answer.id,
        });
        return answerAttachment;
      },
    );

    await Promise.all(
      answerAttachments.map(questionAttachment =>
        inMemoryAnswerAttachementsRepository.create(questionAttachment),
      ),
    );

    await inMemoryAnswersRepository.create(answer);

    await sut.execute({ answerId: answer.id.toValue(), authorId });

    expect(inMemoryAnswersRepository.items).not.toEqual(
      expect.arrayContaining([answer]),
    );
    expect(inMemoryAnswerAttachementsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a answer from another user', async () => {
    const { answer } = makeAnswer();
    const wrongAuthorId = faker.string.uuid();

    await inMemoryAnswersRepository.create(answer);

    const result = await sut.execute({
      answerId: answer.id.toValue(),
      authorId: wrongAuthorId,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(inMemoryAnswersRepository.items).toEqual(
      expect.arrayContaining([answer]),
    );
  });

  it('should not be able to delete a not found answer', async () => {
    const result = await sut.execute({
      answerId: faker.string.uuid(),
      authorId: faker.string.uuid(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
