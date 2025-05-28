import { fakerPT_BR as faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  AnswerAttachment,
  AnswerAttachmentConstructorParams,
} from '@/domain/forum/enterprise/entities/answer-attachment';

export function makeAnswerAttachment(
  override: Partial<AnswerAttachmentConstructorParams> = {},
  id?: string,
) {
  const attachmentId = override?.attachmentId?.toValue() ?? faker.string.uuid();
  const answerId = override?.answerId?.toValue() ?? faker.string.uuid();

  const answerAttachment = AnswerAttachment.create(
    {
      answerId: new UniqueEntityID(answerId),
      attachmentId: new UniqueEntityID(attachmentId),
      ...override,
    },
    id ? new UniqueEntityID(id) : undefined,
  );

  return {
    answerId,
    attachmentId,
    answerAttachment,
  };
}
