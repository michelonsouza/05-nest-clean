import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface AttachementConstructorParams {
  title: string;
  url: string;
}

export class Attachement extends Entity<AttachementConstructorParams> {
  static create(params: AttachementConstructorParams, id?: UniqueEntityID) {
    const attachment = new Attachement(params, id);

    return attachment;
  }

  get title(): string {
    return this.params.title;
  }

  get url(): string {
    return this.params.url;
  }
}
