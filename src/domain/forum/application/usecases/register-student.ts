import { Injectable } from '@nestjs/common';

import { left, right, type Either } from '@/core/either';

import { Student } from '../../enterprise/entities/student';
import { HashGenerator } from '../cryptography/hash-generator';
import { StudentsRepository } from '../repositories/students-repository';
import { StudentAlreadyExistsError } from './errors/student-already-exists-error';

export interface RegisterStudentUseCaseParams {
  name: string;
  email: string;
  password: string;
}

export type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    data: Student;
  }
>;

@Injectable()
export class RegisterStudentUseCase {
  #studentsRepository: StudentsRepository;
  #hashGenerator: HashGenerator;

  constructor(
    studentsRepository: StudentsRepository,
    hashGenerator: HashGenerator,
  ) {
    this.#studentsRepository = studentsRepository;
    this.#hashGenerator = hashGenerator;
  }

  public async execute({
    email,
    name,
    password,
  }: RegisterStudentUseCaseParams): Promise<RegisterStudentUseCaseResponse> {
    const studentWithSameEmail =
      await this.#studentsRepository.findByEmail(email);

    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistsError(email));
    }

    const hashedPassword = await this.#hashGenerator.hash(password);
    const student = Student.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.#studentsRepository.create(student);

    return right({
      data: student,
    });
  }
}
