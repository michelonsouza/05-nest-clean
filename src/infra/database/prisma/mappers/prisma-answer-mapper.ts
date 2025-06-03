import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { Answer as PrismaAnswer } from '@prisma-client/generated/prisma'

export class PrismaAnswerMapper {
  static toDomain(raw: PrismaAnswer): Answer {
    return Answer.create({
      authorId: new UniqueEntityID(raw.authorId),
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw?.updatedAt,
      questionId: new UniqueEntityID(raw.questionId),
    }, new UniqueEntityID(raw.id));
  }

  static toPrisma(answer: Answer): PrismaAnswer {
    return {
      id: answer.id.toString(),
      questionId: answer.questionId.toString(),
      content: answer.content,
      authorId: answer.authorId.toString(),
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt || null,
    };
  }

  static toPrismaList(answers: Answer[]): PrismaAnswer[] {
    return answers.map(this.toPrisma.bind(this));
  }

  static toDomainList(rawList: PrismaAnswer[]): Answer[] {
    return rawList.map(this.toDomain.bind(this));
  }
}
