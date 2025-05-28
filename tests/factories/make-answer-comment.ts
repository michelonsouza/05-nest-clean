import { fakerPT_BR as faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  AnswerComment,
  type AnswerCommentConstructorParams,
} from '@/domain/forum/enterprise/entities/answer-comment';

export function makeAnswerComment(
  override: Partial<AnswerCommentConstructorParams> = {},
  id?: string,
) {
  const authorId = override?.authorId?.toValue() ?? faker.string.uuid();
  const answerId = override?.answerId?.toValue() ?? faker.string.uuid();
  const content = override.content ?? faker.lorem.sentence();

  const answerComment = AnswerComment.create(
    {
      authorId: new UniqueEntityID(authorId),
      answerId: new UniqueEntityID(answerId),
      content,
      createdAt: new Date(),
      ...override,
    },
    id ? new UniqueEntityID(id) : undefined,
  );

  return {
    authorId,
    answerId,
    content,
    answerComment,
  };
}
