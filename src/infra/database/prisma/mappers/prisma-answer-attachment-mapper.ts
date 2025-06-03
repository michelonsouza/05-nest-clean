import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';
import { Attachment as PrismaAnswerAttachment } from '@prisma-client/generated/prisma'


export class PrismaAnswerAttachmentMapper {
  static toDomain(raw: PrismaAnswerAttachment): AnswerAttachment {
    if (!raw?.answerId) {
      throw new Error('Invalid attachment data: answerId is required');
    }

    return AnswerAttachment.create({
      attachmentId: new UniqueEntityID(raw.id),
      answerId: new UniqueEntityID(raw.answerId),
    }, new UniqueEntityID(raw.id));
  }

  static toDomainList(rawList: PrismaAnswerAttachment[]): AnswerAttachment[] {
    return rawList.map(this.toDomain.bind(this));
  }
}
