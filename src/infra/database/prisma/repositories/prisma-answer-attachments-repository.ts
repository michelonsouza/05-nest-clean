import { Injectable } from "@nestjs/common";

import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";

import { PrismaAnswerAttachmentMapper } from "../mappers/prisma-answer-attachment-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const questionAttachments = await this.prismaService.attachment.findMany({
      where: { answerId },
    });

    return PrismaAnswerAttachmentMapper.toDomainList(questionAttachments);
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prismaService.attachment.deleteMany({
      where: { answerId },
    });
  }
}
