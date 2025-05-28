import type { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import type { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';

export class InMemoryAnswerAttachementsRepository
  implements AnswerAttachmentsRepository
{
  #answerAttachments: AnswerAttachment[] = [];

  async create(answerAttachment: AnswerAttachment): Promise<void> {
    this.#answerAttachments.push(answerAttachment);

    return Promise.resolve();
  }

  async findManyByAnswerId(answerId: string) {
    return Promise.resolve(
      this.#answerAttachments.filter(
        (item) => item.answerId.toString() === answerId,
      ),
    );
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    this.#answerAttachments = this.#answerAttachments.filter(
      (item) => item.answerId.toString() !== answerId,
    );

    return Promise.resolve();
  }

  get items() {
    return this.#answerAttachments;
  }
}
