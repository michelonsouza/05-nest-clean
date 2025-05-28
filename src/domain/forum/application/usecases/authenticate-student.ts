import { Injectable } from '@nestjs/common';

import { left, right, type Either } from '@/core/either';

import { Encrypter } from '../cryptography/encrypter';
import { HashComparer } from '../cryptography/hash-comparer';
import { StudentsRepository } from '../repositories/students-repository';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

export interface AuthenticateStudentUseCaseParams {
  email: string;
  password: string;
}

export type AuthenticateStudentUseCaseResponse = Either<
  WrongCredentialsError,
  {
    data: {
      accessToken: string;
    };
  }
>;

@Injectable()
export class AuthenticateStudentUseCase {
  #studentsRepository: StudentsRepository;
  #hashComparer: HashComparer;
  #encryper: Encrypter;

  constructor(
    studentsRepository: StudentsRepository,
    hashComparer: HashComparer,
    encrypter: Encrypter,
  ) {
    this.#studentsRepository = studentsRepository;
    this.#hashComparer = hashComparer;
    this.#encryper = encrypter;
  }

  public async execute({
    email,
    password,
  }: AuthenticateStudentUseCaseParams): Promise<AuthenticateStudentUseCaseResponse> {
    const student = await this.#studentsRepository.findByEmail(email);

    if (!student) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.#hashComparer.compare(
      password,
      student.password,
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.#encryper.encrypt({
      sub: student.id.toString(),
    });

    return right({
      data: { accessToken },
    });
  }
}
