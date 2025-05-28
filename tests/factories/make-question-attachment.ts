import { fakerPT_BR as faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  QuestionAttachment,
  QuestionAttachmentConstructorParams,
} from '@/domain/forum/enterprise/entities/question-attachment';

export function makeQuestionAttachment(
  override: Partial<QuestionAttachmentConstructorParams> = {},
  id?: string,
) {
  const attachmentId = override?.attachmentId?.toValue() ?? faker.string.uuid();
  const questionId = override?.questionId?.toValue() ?? faker.string.uuid();

  const questionAttachment = QuestionAttachment.create(
    {
      questionId: new UniqueEntityID(questionId),
      attachmentId: new UniqueEntityID(attachmentId),
      ...override,
    },
    id ? new UniqueEntityID(id) : undefined,
  );

  return {
    questionId,
    attachmentId,
    questionAttachment,
  };
}
