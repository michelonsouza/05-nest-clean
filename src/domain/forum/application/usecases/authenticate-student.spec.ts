import { fakerPT_BR as faker } from '@faker-js/faker';

import { FakeEncrypter } from 'tests/cryptography/fake-encrypter';
import { FakeHasher } from 'tests/cryptography/fake-hasher';
import { makeStudent } from 'tests/factories/make-student';
import { InMemoryStudentsRepository } from 'tests/repositories/in-memory-students-repository';

import { AuthenticateStudentUseCase } from './authenticate-student';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

let inMemoryStudentsRepositoryRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateStudentUseCase;

describe('AuthenticateStudentUseCase', () => {
  beforeEach(() => {
    inMemoryStudentsRepositoryRepository = new InMemoryStudentsRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();

    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepositoryRepository,
      fakeHasher,
      fakeEncrypter,
    );
  });

  it('should be able to authenticate a student', async () => {
    const password = faker.internet.password();
    const hashedPassword = await fakeHasher.hash(password);
    const { student, email } = makeStudent({
      password: hashedPassword,
    });

    await inMemoryStudentsRepositoryRepository.create(student);

    const result = await sut.execute({
      email,
      password,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      data: {
        accessToken: expect.any(String),
      },
    });
  });

  it('should not be able to authenticate a student with wrong password', async () => {
    const wrongPassword = faker.internet.password();
    const password = faker.internet.password();
    const hashedPassword = await fakeHasher.hash(password);
    const { student, email } = makeStudent({
      password: hashedPassword,
    });

    await inMemoryStudentsRepositoryRepository.create(student);

    const result = await sut.execute({
      email,
      password: wrongPassword,
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });

  it('should not be able to authenticate a student with wrong email', async () => {
    const wrongEmail = faker.internet.email();
    const password = faker.internet.password();
    const hashedPassword = await fakeHasher.hash(password);
    const { student } = makeStudent({
      password: hashedPassword,
    });

    await inMemoryStudentsRepositoryRepository.create(student);

    const result = await sut.execute({
      email: wrongEmail,
      password,
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });
});
