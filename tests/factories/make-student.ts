import { fakerPT_BR as faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Student,
  StudentConstructorParams,
} from '@/domain/forum/enterprise/entities/student';

export function makeStudent(
  override: Partial<StudentConstructorParams> = {},
  id?: string,
) {
  const name = override?.name ?? faker.person.fullName();
  const email = override?.email ?? faker.internet.email();
  const password = override?.password ?? faker.internet.password();

  const student = Student.create(
    {
      name,
      email,
      password,
      ...override,
    },
    id ? new UniqueEntityID(id) : undefined,
  );

  return { name, email, password, student, id: student.id.toValue() };
}
