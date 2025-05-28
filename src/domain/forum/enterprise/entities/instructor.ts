import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface InstructorConstructorParams {
  name: string;
}

export class Instructor extends Entity<InstructorConstructorParams> {
  static create(params: InstructorConstructorParams, id?: UniqueEntityID) {
    const instructor = new Instructor(params, id);

    return instructor;
  }

  get name(): string {
    return this.params.name;
  }
}
