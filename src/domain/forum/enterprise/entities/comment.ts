import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface CommentConstructorParams {
  authorId: UniqueEntityID;
  content: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export abstract class Comment<
  DataTypeParams extends CommentConstructorParams,
> extends Entity<DataTypeParams> {
  #touch() {
    this.params.updatedAt = new Date();
  }

  get authorId(): UniqueEntityID {
    return this.params.authorId;
  }

  get createdAt(): Date {
    return this.params.createdAt;
  }

  get updatedAt(): Date | null | undefined {
    return this.params.updatedAt;
  }

  get content(): string {
    return this.params.content;
  }

  set content(content: string) {
    this.params.content = content;
    this.#touch();
  }
}
