import { Injectable } from "@nestjs/common";

import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

import { PrismaService } from "../prisma.service";
import { PrismaQuestionAttachmentMapper } from './../mappers/prisma-question-attachent-mapper';

@Injectable()
export class PrismaQuestionAttachmentsRepository implements QuestionAttachmentsRepository {
  constructor(private readonly prismaService: PrismaService) { }

  async findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
    const questionAttachments = await this.prismaService.attachment.findMany({
      where: { questionId },
    });

    return PrismaQuestionAttachmentMapper.toDomainList(questionAttachments);
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prismaService.attachment.deleteMany({
      where: { questionId },
    });
  }
}
