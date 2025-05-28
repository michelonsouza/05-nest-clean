import type { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import type { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';

export class InMemoryQuestionAttachementsRepository
  implements QuestionAttachmentsRepository
{
  #questionAttachments: QuestionAttachment[] = [];

  async create(questionAttachment: QuestionAttachment): Promise<void> {
    this.#questionAttachments.push(questionAttachment);

    return Promise.resolve();
  }

  async findManyByQuestionId(questionId: string) {
    return this.#questionAttachments.filter(
      (item) => item.questionId.toString() === questionId,
    );
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    this.#questionAttachments = this.#questionAttachments.filter(
      (item) => item.questionId.toString() !== questionId,
    );

    return Promise.resolve();
  }

  get items() {
    return this.#questionAttachments;
  }
}
