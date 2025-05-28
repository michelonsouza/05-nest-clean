import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import type { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import type { Answer } from '@/domain/forum/enterprise/entities/answer';

export class InMemoryAnswersRepository implements AnswersRepository {
  #answers: Answer[] = [];
  #answerAttachmentsRepository: AnswerAttachmentsRepository;

  constructor(answerAttachmentsRepository: AnswerAttachmentsRepository) {
    this.#answerAttachmentsRepository = answerAttachmentsRepository;
  }

  async save(answer: Answer) {
    const index = this.#answers.findIndex(
      (q) => q.id.toValue() === answer.id.toValue(),
    );

    this.#answers[index] = answer;

    DomainEvents.dispatchEventsForAggregate(answer.id);

    return Promise.resolve();
  }

  async create(answer: Answer) {
    this.#answers.push(answer);

    DomainEvents.dispatchEventsForAggregate(answer.id);

    return Promise.resolve();
  }

  async findById(id: string): Promise<Answer | null> {
    const question =
      this.#answers.find((question) => question.id.toValue() === id) ?? null;

    return Promise.resolve(question);
  }

  async findeManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const questions = this.#answers
      .filter((answer) => answer.questionId.toString() === questionId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return Promise.resolve(questions);
  }

  async delete(answer: Answer): Promise<void> {
    const answers = this.#answers.filter(
      (currentAnswer) => currentAnswer.id.toValue() !== answer.id.toValue(),
    );

    this.#answers = answers;

    await this.#answerAttachmentsRepository.deleteManyByAnswerId(
      answer.id.toValue(),
    );

    return Promise.resolve();
  }

  get items() {
    return this.#answers;
  }
}
