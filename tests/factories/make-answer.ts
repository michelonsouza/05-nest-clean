import { fakerPT_BR as faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Answer,
  AnswerConstructorParams,
} from '@/domain/forum/enterprise/entities/answer';

export function makeAnswer(
  override: Partial<AnswerConstructorParams> = {},
  id?: string,
) {
  const authorId = override?.authorId?.toValue() ?? faker.string.uuid();
  const questionId = override?.questionId?.toValue() ?? faker.string.uuid();
  const content = override.content ?? faker.lorem.sentence();

  const answer = Answer.create(
    {
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content,
    },
    id ? new UniqueEntityID(id) : undefined,
  );

  return {
    authorId,
    questionId,
    content,
    answer,
  };
}
