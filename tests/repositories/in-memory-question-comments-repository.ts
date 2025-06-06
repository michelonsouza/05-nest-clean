import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  #questionComments: QuestionComment[] = [];

  async create(questionComment: QuestionComment) {
    this.#questionComments.push(questionComment);

    return Promise.resolve();
  }

  async save(questionComment: QuestionComment) {
    const index = this.#questionComments.findIndex(
      c => c.id.toValue() === questionComment.id.toValue(),
    );

    this.#questionComments[index] = questionComment;

    return Promise.resolve();
  }

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment =
      this.#questionComments.find(comment => comment.id.toValue() === id) ??
      null;

    return Promise.resolve(questionComment);
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const questions = this.#questionComments.filter(
      c => c.id.toValue() !== questionComment.id.toValue(),
    );

    this.#questionComments = questions;

    return Promise.resolve();
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const questionComments = this.#questionComments
      .filter(comment => comment.questionId.toValue() === questionId)
      .slice((page - 1) * 20, page * 20);

    return Promise.resolve(questionComments);
  }

  get items() {
    return this.#questionComments;
  }
}
