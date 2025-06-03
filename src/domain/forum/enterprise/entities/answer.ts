import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

import { AnswerAttachmentList } from './answer-attachment-list';
import { AnswerCreatedEvent } from '../events/answer-created-event';

export interface AnswerConstructorParams {
  authorId: UniqueEntityID;
  questionId: UniqueEntityID;
  content: string;
  attachments: AnswerAttachmentList;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Answer extends AggregateRoot<AnswerConstructorParams> {
  static create(
    {
      createdAt,
      attachments,
      ...params
    }: Optional<AnswerConstructorParams, 'createdAt' | 'attachments'>,
    id?: UniqueEntityID,
  ) {
    const answer = new Answer(
      {
        ...params,
        attachments: attachments ?? new AnswerAttachmentList(),
        createdAt: createdAt ?? new Date(),
      },
      id,
    );

    const isNewAnswer = !id;

    if (isNewAnswer) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer));
    }

    return answer;
  }

  #touch() {
    this.params.updatedAt = new Date();
  }

  get excerpt(): string {
    return this.content.substring(0, 120).trimEnd().concat('...');
  }

  get content(): string {
    return this.params.content;
  }

  set content(content: string) {
    this.params.content = content;
    this.#touch();
  }

  set attachments(attachments: AnswerAttachmentList) {
    this.params.attachments = attachments;
    this.#touch();
  }

  get authorId(): UniqueEntityID {
    return this.params.authorId;
  }

  get questionId(): UniqueEntityID {
    return this.params.questionId;
  }

  get attachments(): AnswerAttachmentList {
    return this.params.attachments;
  }

  get createdAt(): Date {
    return this.params.createdAt;
  }

  get updatedAt(): Date | undefined | null {
    return this.params.updatedAt;
  }
}
