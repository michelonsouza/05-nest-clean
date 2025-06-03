import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Student } from '@/domain/forum/enterprise/entities/student';
import { User as PrismaStudent } from '@prisma-client/generated/prisma'

export class PrismaStudentMapper {
  static toDomain(raw: PrismaStudent): Student {
    return Student.create({
      name: raw.name,
      email: raw.email,
      password: raw.password,
    }, new UniqueEntityID(raw.id));
  }

  static toPrisma(student: Student): PrismaStudent {
    return {
      id: student.id.toString(),
      name: student.name,
      email: student.email,
      password: student.password,
      role: 'STUDENT',
    };
  }

  static toPrismaList(students: Student[]): PrismaStudent[] {
    return students.map(this.toPrisma.bind(this));
  }

  static toDomainList(rawList: PrismaStudent[]): Student[] {
    return rawList.map(this.toDomain.bind(this));
  }
}
