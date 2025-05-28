import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface QuestionAttachmentConstructorParams {
  questionId: UniqueEntityID;
  attachmentId: UniqueEntityID;
}

export class QuestionAttachment extends Entity<QuestionAttachmentConstructorParams> {
  static create(
    params: QuestionAttachmentConstructorParams,
    id?: UniqueEntityID,
  ) {
    const questionAttachment = new QuestionAttachment(params, id);

    return questionAttachment;
  }

  get questionId(): UniqueEntityID {
    return this.params.questionId;
  }

  get attachmentId(): UniqueEntityID {
    return this.params.attachmentId;
  }
}
