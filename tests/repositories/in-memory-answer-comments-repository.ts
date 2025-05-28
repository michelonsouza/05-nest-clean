import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import type { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  #answerComments: AnswerComment[] = [];

  async create(answerComment: AnswerComment) {
    this.#answerComments.push(answerComment);

    return Promise.resolve();
  }

  async save(answerComment: AnswerComment) {
    const index = this.#answerComments.findIndex(
      (c) => c.id.toValue() === answerComment.id.toValue(),
    );

    this.#answerComments[index] = answerComment;

    return Promise.resolve();
  }

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment =
      this.#answerComments.find((comment) => comment.id.toValue() === id) ??
      null;

    return Promise.resolve(answerComment);
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const answers = this.#answerComments.filter(
      (c) => c.id.toValue() !== answerComment.id.toValue(),
    );

    this.#answerComments = answers;

    return Promise.resolve();
  }

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const answerComments = this.#answerComments
      .filter((comment) => comment.answerId.toValue() === answerId)
      .slice((page - 1) * 20, page * 20);

    return Promise.resolve(answerComments);
  }

  get items() {
    return this.#answerComments;
  }
}
