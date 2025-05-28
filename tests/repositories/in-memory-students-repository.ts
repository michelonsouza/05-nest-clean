import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository';
import { Student } from '@/domain/forum/enterprise/entities/student';

export class InMemoryStudentsRepository extends StudentsRepository {
  #students: Student[] = [];

  create(data: Student): Promise<void> {
    this.#students.push(data);

    return Promise.resolve();
  }

  findByEmail(email: string): Promise<Student | null> {
    const student = this.#students.find((student) => student.email === email);

    return Promise.resolve(student ?? null);
  }

  get items(): Student[] {
    return this.#students;
  }
}
