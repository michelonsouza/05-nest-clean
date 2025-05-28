import { fakerPT_BR as faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';
import { makeQuestion } from 'tests/factories/make-question';
import { makeQuestionAttachment } from 'tests/factories/make-question-attachment';
import { InMemoryQuestionAttachementsRepository } from 'tests/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from 'tests/repositories/in-memory-questions-repository';

import { EditQuestionUseCase } from './edit-question';
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachementsRepository;
let sut: EditQuestionUseCase;

describe('EditQuestionUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachementsRepository();
    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentsRepository,
    );
  });

  it('should be able to edit a question', async () => {
    const { question, authorId } = makeQuestion();
    const questionAttachmentQuantity = faker.number.int({ min: 1, max: 5 });
    const questionAttachments = Array.from(
      { length: questionAttachmentQuantity },
      () => {
        const { questionAttachment } = makeQuestionAttachment({
          questionId: question.id,
        });
        return questionAttachment;
      },
    );
    const newQuestionAttachmentIds = Array.from({
      length: faker.number.int({
        min: 1,
        max: 5,
      }),
    }).map(() => faker.string.uuid());
    const oldQuestionAttachmentId = questionAttachments[0].id.toValue();

    await Promise.all(
      questionAttachments.map((questionAttachment) =>
        inMemoryQuestionAttachmentsRepository.create(questionAttachment),
      ),
    );

    await inMemoryQuestionsRepository.create(question);

    const { question: editQuestion } = makeQuestion(
      {
        authorId: question.authorId,
        createdAt: question.createdAt,
        attachments: new QuestionAttachmentList(questionAttachments),
      },
      question.id.toString(),
    );

    const attachmentIds = [
      oldQuestionAttachmentId,
      ...newQuestionAttachmentIds,
    ];

    const objExpectContainsArr = attachmentIds.map((attachementId) =>
      expect.objectContaining({
        attachmentId: new UniqueEntityID(attachementId),
      }),
    );

    await sut.execute({
      authorId,
      questionId: question.id.toValue(),
      title: editQuestion.title,
      content: editQuestion.content,
      attachmentIds,
    });

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: editQuestion.title,
      content: editQuestion.content,
    });
    expect(
      inMemoryQuestionsRepository.items[0].attachments.getItems(),
    ).toHaveLength(attachmentIds.length);
    expect(inMemoryQuestionsRepository.items[0].attachments.getItems()).toEqual(
      objExpectContainsArr,
    );
  });

  it('should not be able to edit a question from another user', async () => {
    const { question } = makeQuestion();
    const { question: editQuestion } = makeQuestion();
    const wrongAuthorId = faker.string.uuid();

    await inMemoryQuestionsRepository.create(question);

    const result = await sut.execute({
      questionId: question.id.toValue(),
      authorId: wrongAuthorId,
      title: editQuestion.title,
      content: editQuestion.content,
      attachmentIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to edit a not found question', async () => {
    const result = await sut.execute({
      questionId: faker.string.uuid(),
      authorId: faker.string.uuid(),
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      attachmentIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
