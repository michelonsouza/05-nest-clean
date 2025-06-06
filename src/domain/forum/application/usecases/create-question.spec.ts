import { fakerPT_BR as faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryQuestionAttachementsRepository } from 'tests/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from 'tests/repositories/in-memory-questions-repository';

import { CreateQuestionUseCase } from './create-question';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachementsRepository;
let sut: CreateQuestionUseCase;

describe('CreateQuestionUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachementsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository);
  });

  it('should create a question with the provided content', async () => {
    const authorId = faker.string.uuid();
    const title = faker.lorem.sentence();
    const content = faker.lorem.sentence();
    const attachmentIds = Array.from(
      { length: faker.number.int({ min: 1, max: 5 }) },
      () => faker.string.uuid(),
    );

    const result = await sut.execute({
      authorId,
      content,
      title,
      attachmentIds,
    });

    const question = result.value?.data;
    const objExpectContainsArr = attachmentIds.map(attachementId =>
      expect.objectContaining({
        attachmentId: new UniqueEntityID(attachementId),
      }),
    );

    expect(result.isRight()).toBe(true);
    expect(question?.content).toEqual(content);
    expect(inMemoryQuestionsRepository.items[0].id).toEqual(question?.id);
    expect(
      inMemoryQuestionsRepository.items[0].attachments.getItems(),
    ).toHaveLength(attachmentIds.length);
    expect(inMemoryQuestionsRepository.items[0].attachments.getItems()).toEqual(
      objExpectContainsArr,
    );
  });
});
