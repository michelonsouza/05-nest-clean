import type { Student } from '@/domain/forum/enterprise/entities/student';

export abstract class StudentsRepository {
  abstract create(data: Student): Promise<void>;
  abstract findByEmail(email: string): Promise<Student | null>;
}
