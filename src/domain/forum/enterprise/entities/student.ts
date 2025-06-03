import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface StudentConstructorParams {
  name: string;
  email: string;
  password: string;
}

export class Student extends Entity<StudentConstructorParams> {
  static create(params: StudentConstructorParams, id?: UniqueEntityID) {
    const student = new Student(params, id);

    return student;
  }

  get name(): string {
    return this.params.name;
  }

  get email(): string {
    return this.params.email;
  }

  get password(): string {
    return this.params.password;
  }
}
