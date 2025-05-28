import { Injectable } from "@nestjs/common";

import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";

import { PrismaQuestionMapper } from "../mappers/prisma-question-mapper";
import { PrismaService } from "../prisma.service";

const PER_PAGE = 20; // Define the number of items per page

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(private readonly prismaService: PrismaService) { }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prismaService.question.findUnique({
      where: { slug },
    });

    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  async findManyRecent(params: PaginationParams): Promise<Question[]> {
    const { page } = params;

    const questions = await this.prismaService.question.findMany({
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
      orderBy: {
        createdAt: "desc",
      },
    });

    return PrismaQuestionMapper.toDomainList(questions);
  }

  async findById(id: string): Promise<Question | null> {
    const question = await this.prismaService.question.findUnique({
      where: { id },
    });

    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  async create(data: Question): Promise<void> {
    const question = PrismaQuestionMapper.toPrisma(data);

    await this.prismaService.question.create({
      data: question,
    });
  }

  async save(data: Question): Promise<void> {
    const question = PrismaQuestionMapper.toPrisma(data);

    await this.prismaService.question.update({
      where: { id: question.id },
      data: question,
    });
  }

  async delete(data: Question): Promise<void> {
    await this.prismaService.question.delete({
      where: { id: data.id.toString() },
    });
  }
}
