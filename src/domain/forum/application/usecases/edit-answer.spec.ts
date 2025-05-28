import { fakerPT_BR as faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';
import { makeAnswer } from 'tests/factories/make-answer';
import { makeAnswerAttachment } from 'tests/factories/make-answer-attachment';
import { InMemoryAnswerAttachementsRepository } from 'tests/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswersRepository } from 'tests/repositories/in-memory-answers-repository';

import { EditAnswerUseCase } from './edit-answer';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachementsRepository: InMemoryAnswerAttachementsRepository;
let sut: EditAnswerUseCase;

describe('EditAnswerUseCase', () => {
  beforeEach(() => {
    inMemoryAnswerAttachementsRepository =
      new InMemoryAnswerAttachementsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachementsRepository,
    );
    sut = new EditAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerAttachementsRepository,
    );
  });

  it('should be able to edit a answer', async () => {
    const { answer, authorId } = makeAnswer();
    const answerAttachmentQuantity = faker.number.int({ min: 1, max: 5 });
    const answerAttachments = Array.from(
      { length: answerAttachmentQuantity },
      () => {
        const { answerAttachment } = makeAnswerAttachment({
          answerId: answer.id,
        });
        return answerAttachment;
      },
    );
    const newAnswerAttachmentIds = Array.from({
      length: faker.number.int({
        min: 1,
        max: 5,
      }),
    }).map(() => faker.string.uuid());
    const oldAnswerAttachmentId = answerAttachments[0].id.toValue();

    await Promise.all(
      answerAttachments.map((answerAttachment) =>
        inMemoryAnswerAttachementsRepository.create(answerAttachment),
      ),
    );

    await inMemoryAnswersRepository.create(answer);

    const { answer: editAnswer } = makeAnswer(
      {
        authorId: answer.authorId,
        createdAt: answer.createdAt,
        attachments: new AnswerAttachmentList(answerAttachments),
      },
      answer.id.toString(),
    );

    const attachmentIds = [oldAnswerAttachmentId, ...newAnswerAttachmentIds];

    const objExpectContainsArr = attachmentIds.map((attachementId) =>
      expect.objectContaining({
        attachmentId: new UniqueEntityID(attachementId),
      }),
    );

    await sut.execute({
      authorId,
      answerId: answer.id.toValue(),
      content: editAnswer.content,
      attachmentIds,
    });

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: editAnswer.content,
    });
    expect(
      inMemoryAnswersRepository.items[0].attachments.getItems(),
    ).toHaveLength(attachmentIds.length);
    expect(inMemoryAnswersRepository.items[0].attachments.getItems()).toEqual(
      objExpectContainsArr,
    );
  });

  it('should not be able to edit a answer from another user', async () => {
    const { answer } = makeAnswer();
    const { answer: editAnswer } = makeAnswer();
    const wrongAuthorId = faker.string.uuid();

    await inMemoryAnswersRepository.create(answer);

    const result = await sut.execute({
      answerId: answer.id.toValue(),
      authorId: wrongAuthorId,
      content: editAnswer.content,
      attachmentIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to edit a not found answer', async () => {
    const result = await sut.execute({
      answerId: faker.string.uuid(),
      authorId: faker.string.uuid(),
      content: faker.lorem.paragraph(),
      attachmentIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
