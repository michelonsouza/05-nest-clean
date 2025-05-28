import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface AnswerAttachmentConstructorParams {
  answerId: UniqueEntityID;
  attachmentId: UniqueEntityID;
}

export class AnswerAttachment extends Entity<AnswerAttachmentConstructorParams> {
  static create(
    params: AnswerAttachmentConstructorParams,
    id?: UniqueEntityID,
  ) {
    const answerAttachment = new AnswerAttachment(params, id);

    return answerAttachment;
  }

  get answerId(): UniqueEntityID {
    return this.params.answerId;
  }

  get attachmentId(): UniqueEntityID {
    return this.params.attachmentId;
  }
}
