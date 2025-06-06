import type { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';

export interface AnswerAttachmentsRepository {
  findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>;
  create?(answerAttachment: AnswerAttachment): Promise<void>;
  deleteManyByAnswerId(answerId: string): Promise<void>;
}
