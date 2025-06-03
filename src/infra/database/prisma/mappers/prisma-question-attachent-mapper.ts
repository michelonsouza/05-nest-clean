import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { Attachment as PrismaQuestionAttachment } from '@prisma-client/generated/prisma'


export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: PrismaQuestionAttachment): QuestionAttachment {
    if (!raw?.questionId) {
      throw new Error('Invalid attachment data: questionId is required');
    }

    return QuestionAttachment.create({
      attachmentId: new UniqueEntityID(raw.id),
      questionId: new UniqueEntityID(raw.questionId),
    }, new UniqueEntityID(raw.id));
  }

  static toDomainList(rawList: PrismaQuestionAttachment[]): QuestionAttachment[] {
    return rawList.map(this.toDomain.bind(this));
  }
}
