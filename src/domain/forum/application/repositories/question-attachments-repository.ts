import type { QuestionAttachment } from './../../enterprise/entities/question-attachment';

export interface QuestionAttachmentsRepository {
  findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>;
  create?(questionAttachment: QuestionAttachment): Promise<void>;
  deleteManyByQuestionId(questionId: string): Promise<void>;
}
