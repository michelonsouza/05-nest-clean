import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { Comment as PrismaQuestionComment } from '@prisma-client/generated/prisma'


export class PrismaQuestionCommentMapper {
  static toDomain(raw: PrismaQuestionComment): QuestionComment {
    if (!raw?.questionId) {
      throw new Error('Invalid comment data: questionId is required');
    }

    return QuestionComment.create({
      authorId: new UniqueEntityID(raw.authorId),
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw?.updatedAt,
      questionId: new UniqueEntityID(raw.questionId),
    }, new UniqueEntityID(raw.id));
  }

  static toPrisma(questionComment: QuestionComment): Optional<PrismaQuestionComment, 'answerId'> {
    return {
      id: questionComment.id.toString(),
      questionId: questionComment.questionId.toString(),
      content: questionComment.content,
      authorId: questionComment.authorId.toString(),
      createdAt: questionComment.createdAt,
      updatedAt: questionComment.updatedAt || null,
    };
  }

  static toPrismaList(questioncomments: QuestionComment[]): PrismaQuestionComment[] {
    return questioncomments.map(this.toPrisma.bind(this));
  }

  static toDomainList(rawList: PrismaQuestionComment[]): QuestionComment[] {
    return rawList.map(this.toDomain.bind(this));
  }
}
