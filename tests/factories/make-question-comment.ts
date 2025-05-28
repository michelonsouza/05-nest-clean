import { fakerPT_BR as faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  QuestionComment,
  type QuestionCommentConstructorParams,
} from '@/domain/forum/enterprise/entities/question-comment';

export function makeQuestionComment(
  override: Partial<QuestionCommentConstructorParams> = {},
  id?: string,
) {
  const authorId = override?.authorId?.toValue() ?? faker.string.uuid();
  const questionId = override?.questionId?.toValue() ?? faker.string.uuid();
  const content = override.content ?? faker.lorem.sentence();

  const questionComment = QuestionComment.create(
    {
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content,
      createdAt: new Date(),
      ...override,
    },
    id ? new UniqueEntityID(id) : undefined,
  );

  return {
    authorId,
    questionId,
    content,
    questionComment,
  };
}
