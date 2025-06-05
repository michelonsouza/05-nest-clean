import { Injectable } from "@nestjs/common";

import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";

import { PrismaQuestionCommentMapper } from "../mappers/prisma-question-comment-mapper";
import { PrismaService } from "../prisma.service";

const PER_PAGE = 20; // Define the number of items per page

@Injectable()
export class PrismaQuestionCommentsRepository implements QuestionCommentsRepository {
  constructor(private readonly prismaService: PrismaService) { }

  async findManyByQuestionId(questionId: string, params: PaginationParams): Promise<QuestionComment[]> {
    const { page } = params;

    const questionComments = await this.prismaService.comment.findMany({
      where: { questionId },
      skip: (page - 1) * PER_PAGE,
      orderBy: {
        createdAt: "desc",
      },
    });

    return PrismaQuestionCommentMapper.toDomainList(questionComments);
  }

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = await this.prismaService.comment.findUnique({
      where: { id },
    });

    if (!questionComment) {
      return null;
    }

    return PrismaQuestionCommentMapper.toDomain(questionComment);
  }

  async save(data: QuestionComment): Promise<void> {
    const questionComment = PrismaQuestionCommentMapper.toPrisma(data);

    await this.prismaService.comment.update({
      where: { id: questionComment.id },
      data: questionComment,
    });
  }

  async create(data: QuestionComment): Promise<void> {
    const questionComment = PrismaQuestionCommentMapper.toPrisma(data);

    await this.prismaService.comment.create({
      data: questionComment,
    });
  }

  async delete(data: QuestionComment): Promise<void> {
    await this.prismaService.comment.delete({
      where: { id: data.id.toString() },
    });
  }
}
