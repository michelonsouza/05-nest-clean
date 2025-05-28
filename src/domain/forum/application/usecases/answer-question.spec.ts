import { fakerPT_BR as faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryAnswerAttachementsRepository } from 'tests/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswersRepository } from 'tests/repositories/in-memory-answers-repository';

import { AnswerQuestionUseCase } from './answer-question';

let inmemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachementsRepository: InMemoryAnswerAttachementsRepository;
let sut: AnswerQuestionUseCase;

describe('AnswerQuestionUseCase', () => {
  beforeEach(() => {
    inMemoryAnswerAttachementsRepository =
      new InMemoryAnswerAttachementsRepository();
    inmemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachementsRepository,
    );
    sut = new AnswerQuestionUseCase(inmemoryAnswersRepository);
  });

  it('should create an answer with the provided content', async () => {
    const instructorId = faker.string.uuid();
    const questionId = faker.string.uuid();
    const content = faker.lorem.sentence();
    const attachmentIds = Array.from(
      { length: faker.number.int({ min: 1, max: 5 }) },
      () => faker.string.uuid(),
    );

    const result = await sut.execute({
      instructorId,
      questionId,
      content,
      attachmentIds,
    });

    const answer = result.value?.data;
    const objExpectContainsArr = attachmentIds.map((attachementId) =>
      expect.objectContaining({
        attachmentId: new UniqueEntityID(attachementId),
      }),
    );

    expect(answer?.content).toEqual(content);
    expect(inmemoryAnswersRepository.items[0].id).toEqual(answer?.id);
    expect(
      inmemoryAnswersRepository.items[0].attachments.getItems(),
    ).toHaveLength(attachmentIds.length);
    expect(inmemoryAnswersRepository.items[0].attachments.getItems()).toEqual(
      objExpectContainsArr,
    );
  });
});
