import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import type { Optional } from '@/core/types/optional';

export interface NotificationConstructorParams {
  recipientId: UniqueEntityID;
  title: string;
  content: string;
  readAt?: Date;
  createdAt: Date;
}

export class Notification extends Entity<NotificationConstructorParams> {
  static create(
    {
      createdAt,
      ...params
    }: Optional<NotificationConstructorParams, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const notification = new Notification(
      {
        ...params,
        createdAt: createdAt ?? new Date(),
      },
      id,
    );

    return notification;
  }

  get recipientId(): UniqueEntityID {
    return this.params.recipientId;
  }

  get title(): string {
    return this.params.title;
  }

  get content(): string {
    return this.params.content;
  }

  get readAt(): Date | undefined {
    return this.params?.readAt;
  }

  get createdAt(): Date {
    return this.params.createdAt;
  }

  public read() {
    this.params.readAt = new Date();
  }
}
