import type { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';

export interface QuestionAttachmentsRepository {
  findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>;
  create?(questionAttachment: QuestionAttachment): Promise<void>;
  deleteManyByQuestionId(questionId: string): Promise<void>;
}
