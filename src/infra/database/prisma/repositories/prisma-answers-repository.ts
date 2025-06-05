import { Injectable } from "@nestjs/common";

import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

import { PrismaAnswerMapper } from "../mappers/prisma-answer-mapper";
import { PrismaService } from "../prisma.service";

const PER_PAGE = 20; // Define the number of items per page

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(private readonly prismaService: PrismaService) { }

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prismaService.answer.findUnique({
      where: { id },
    });

    if (!answer) {
      return null;
    }

    return PrismaAnswerMapper.toDomain(answer);
  }

  async save(data: Answer): Promise<void> {
    const answer = PrismaAnswerMapper.toPrisma(data);

    await this.prismaService.answer.update({
      where: { id: answer.id },
      data: answer,
    });
  }

  async create(data: Answer): Promise<void> {
    const answer = PrismaAnswerMapper.toPrisma(data);

    await this.prismaService.answer.create({
      data: answer,
    });
  }
  async delete(data: Answer): Promise<void> {
    await this.prismaService.answer.delete({
      where: { id: data.id.toString() },
    });
  }

  async findeManyByQuestionId(questionId: string, params: PaginationParams): Promise<Answer[]> {
    const { page } = params;

    const answers = await this.prismaService.answer.findMany({
      where: { questionId },
      skip: (page - 1) * PER_PAGE,
      orderBy: {
        createdAt: "desc",
      },
    });

    return PrismaAnswerMapper.toDomainList(answers);
  }
}
