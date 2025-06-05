import { Injectable } from "@nestjs/common";

import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

import { PrismaAnswerCommentMapper } from "../mappers/prisma-answer-comment-mapper";
import { PrismaService } from "../prisma.service";

const PER_PAGE = 20; // Define the number of items per page

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswerCommentsRepository {
  constructor(private readonly prismaService: PrismaService) { }

  async findManyByAnswerId(answerId: string, params: PaginationParams): Promise<AnswerComment[]> {
    const { page } = params;

    const questionComments = await this.prismaService.comment.findMany({
      where: { answerId },
      skip: (page - 1) * PER_PAGE,
      orderBy: {
        createdAt: "desc",
      },
    });

    return PrismaAnswerCommentMapper.toDomainList(questionComments);
  }

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = await this.prismaService.comment.findUnique({
      where: { id },
    });

    if (!answerComment) {
      return null;
    }

    return PrismaAnswerCommentMapper.toDomain(answerComment);
  }

  async save(data: AnswerComment): Promise<void> {
    const answerComment = PrismaAnswerCommentMapper.toPrisma(data);

    await this.prismaService.comment.update({
      where: { id: answerComment.id },
      data: answerComment,
    });
  }

  async create(data: AnswerComment): Promise<void> {
    const answerComment = PrismaAnswerCommentMapper.toPrisma(data);

    await this.prismaService.comment.create({
      data: answerComment,
    });
  }

  async delete(data: AnswerComment): Promise<void> {
    await this.prismaService.comment.delete({
      where: { id: data.id.toString() },
    });
  }
}
