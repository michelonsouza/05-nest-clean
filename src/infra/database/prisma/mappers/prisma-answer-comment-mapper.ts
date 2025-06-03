import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { Comment as PrismaAnswerComment } from '@prisma-client/generated/prisma'


export class PrismaAnswerCommentMapper {
  static toDomain(raw: PrismaAnswerComment): AnswerComment {
    if (!raw?.answerId) {
      throw new Error('Invalid comment data: answerId is required');
    }

    return AnswerComment.create({
      authorId: new UniqueEntityID(raw.authorId),
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw?.updatedAt,
      answerId: new UniqueEntityID(raw.answerId),
    }, new UniqueEntityID(raw.id));
  }

  static toPrisma(answerComment: AnswerComment): Optional<PrismaAnswerComment, 'questionId'> {
    return {
      id: answerComment.id.toString(),
      answerId: answerComment.answerId.toString(),
      content: answerComment.content,
      authorId: answerComment.authorId.toString(),
      createdAt: answerComment.createdAt,
      updatedAt: answerComment.updatedAt || null,
    };
  }

  static toPrismaList(answercomments: AnswerComment[]): PrismaAnswerComment[] {
    return answercomments.map(this.toPrisma.bind(this));
  }

  static toDomainList(rawList: PrismaAnswerComment[]): AnswerComment[] {
    return rawList.map(this.toDomain.bind(this));
  }
}
