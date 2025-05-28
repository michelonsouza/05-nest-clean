import { DomainEvents } from '@/core/events/domain-events';
import type { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import type { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import type { Question } from '@/domain/forum/enterprise/entities/question';

export class InMemoryQuestionsRepository implements QuestionsRepository {
  #questions: Question[] = [];
  #questionAttachmentsRepository: QuestionAttachmentsRepository;

  constructor(questionAttachmentsRepository: QuestionAttachmentsRepository) {
    this.#questionAttachmentsRepository = questionAttachmentsRepository;
  }

  async create(question: Question) {
    this.#questions.push(question);

    DomainEvents.dispatchEventsForAggregate(question.id);

    return Promise.resolve();
  }

  async save(question: Question) {
    const index = this.#questions.findIndex(
      (q) => q.id.toValue() === question.id.toValue(),
    );

    this.#questions[index] = question;

    DomainEvents.dispatchEventsForAggregate(question.id);

    return Promise.resolve();
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question =
      this.#questions.find((question) => question.slug.value === slug) ?? null;

    return question;
  }

  async findById(id: string): Promise<Question | null> {
    const question =
      this.#questions.find((question) => question.id.toValue() === id) ?? null;

    return Promise.resolve(question);
  }

  async delete(question: Question): Promise<void> {
    const questions = this.#questions.filter(
      (q) => q.id.toValue() !== question.id.toValue(),
    );

    this.#questions = questions;

    await this.#questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toValue(),
    );

    return Promise.resolve();
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = [...this.#questions]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return Promise.resolve(questions);
  }

  get items() {
    return this.#questions;
  }
}
