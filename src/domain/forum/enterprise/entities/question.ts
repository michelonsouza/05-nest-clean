import { differenceInDays } from 'date-fns';

import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

import { QuestionAttachmentList } from './question-attachment-list';
import { Slug } from './value-objects/slug';
import { QuestionBestAnswerChosenEvent } from '../events/question-best-answer-chosen-event';

export interface QuestionConstructorParams {
  authorId: UniqueEntityID;
  bestAnswerId?: UniqueEntityID | null;
  slug: Slug;
  title: string;
  content: string;
  attachments: QuestionAttachmentList;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Question extends AggregateRoot<QuestionConstructorParams> {
  static create(
    {
      createdAt,
      attachments,
      ...params
    }: Optional<
      QuestionConstructorParams,
      'createdAt' | 'slug' | 'attachments'
    >,
    id?: UniqueEntityID,
  ) {
    const question = new Question(
      {
        ...params,
        attachments: attachments ?? new QuestionAttachmentList(),
        slug: params?.slug ?? Slug.createFromText(params.title),
        createdAt: createdAt ?? new Date(),
      },
      id,
    );

    return question;
  }

  #touch() {
    this.params.updatedAt = new Date();
  }

  get excerpt(): string {
    return this.content.substring(0, 120).trimEnd().concat('...');
  }

  get isNew(): boolean {
    return differenceInDays(new Date(), this.createdAt) <= 3; // 3 days
  }

  get authorId(): UniqueEntityID {
    return this.params.authorId;
  }

  get bestAnswerId(): UniqueEntityID | undefined | null {
    return this.params.bestAnswerId;
  }

  set bestAnswerId(bestAnswerId: UniqueEntityID | undefined) {
    if (
      bestAnswerId &&
      bestAnswerId.toString() !== this.params.bestAnswerId?.toString()
    ) {
      this.addDomainEvent(
        new QuestionBestAnswerChosenEvent(this, bestAnswerId),
      );
    }

    this.params.bestAnswerId = bestAnswerId;
    this.#touch();
  }

  get slug(): Slug {
    return this.params.slug;
  }

  get title(): string {
    return this.params.title;
  }

  set title(title: string) {
    this.params.title = title;
    this.params.slug = Slug.createFromText(title);
    this.#touch();
  }

  get content(): string {
    return this.params.content;
  }

  set content(content: string) {
    this.params.content = content;
    this.#touch();
  }

  get attachments(): QuestionAttachmentList {
    return this.params.attachments;
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.params.attachments = attachments;
    this.#touch();
  }

  get createdAt(): Date {
    return this.params.createdAt;
  }

  get updatedAt(): Date | null | undefined {
    return this.params.updatedAt;
  }
}
