import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { Question as PrismaQuestion } from '@prisma-client/generated/prisma'

export class PrismaQuestionMapper {
  static toDomain(raw: PrismaQuestion): Question {
    return Question.create({
      authorId: new UniqueEntityID(raw.authorId),
      content: raw.content,
      createdAt: raw.createdAt,
      title: raw.title,
      updatedAt: raw?.updatedAt,
      bestAnswerId: raw?.bestAnswerId ? new UniqueEntityID(raw.bestAnswerId) : null,
      slug: Slug.create(raw.slug),
    }, new UniqueEntityID(raw.id));
  }

  static toPrisma(question: Question): PrismaQuestion {
    return {
      id: question.id.toString(),
      title: question.title,
      content: question.content,
      authorId: question.authorId.toString(),
      createdAt: question.createdAt,
      updatedAt: question.updatedAt || null,
      bestAnswerId: question.bestAnswerId ? question.bestAnswerId.toString() : null,
      slug: question.slug.value,
    };
  }

  static toPrismaList(questions: Question[]): PrismaQuestion[] {
    return questions.map(this.toPrisma.bind(this));
  }

  static toDomainList(rawList: PrismaQuestion[]): Question[] {
    return rawList.map(this.toDomain.bind(this));
  }
}
