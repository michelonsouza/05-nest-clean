import { fakerPT_BR as faker } from '@faker-js/faker';

import { ResourceNotFoundError } from '@/core/errors/resource-not-found';
import { makeQuestion } from 'tests/factories/make-question';
import { InMemoryQuestionAttachementsRepository } from 'tests/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from 'tests/repositories/in-memory-questions-repository';

import { GetQuestionBySlugUseCase } from './get-question-by-slug';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachementsRepository;
let sut: GetQuestionBySlugUseCase;

describe('GetQuestionBySlugUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachementsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
  });

  it('should be able to get question by slug', async () => {
    const { question: newQuestion, content, slug } = makeQuestion();

    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({ slug });

    const question =
      result.value instanceof ResourceNotFoundError
        ? undefined
        : result.value?.data;

    expect(result.isRight()).toBe(true);
    expect(question?.content).toEqual(content);
    expect(question?.slug.value).toEqual(slug);
  });

  it('should not be able to get a not found question', async () => {
    const result = await sut.execute({
      slug: faker.helpers.slugify(faker.lorem.sentence({ min: 3, max: 5 })),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
