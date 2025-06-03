import { Injectable } from "@nestjs/common";

import { StudentsRepository } from "@/domain/forum/application/repositories/students-repository";
import { Student } from "@/domain/forum/enterprise/entities/student";

import { PrismaStudentMapper } from "../mappers/prisma-student-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private readonly prismaService: PrismaService) { }

  async findByEmail(email: string): Promise<Student | null> {
    const student = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!student) {
      return null;
    }

    return PrismaStudentMapper.toDomain(student);
  }

  async create(data: Student): Promise<void> {
    const student = PrismaStudentMapper.toPrisma(data);

    await this.prismaService.user.create({
      data: student,
    });
  }
}
