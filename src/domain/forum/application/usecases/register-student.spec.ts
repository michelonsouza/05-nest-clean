import { fakerPT_BR as faker } from '@faker-js/faker';

import { FakeHasher } from 'tests/cryptography/fake-hasher';
import { InMemoryStudentsRepository } from 'tests/repositories/in-memory-students-repository';

import { RegisterStudentUseCase } from './register-student';

let inMemoryStudentsRepositoryRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let sut: RegisterStudentUseCase;

describe('RegisterStudentUseCase', () => {
  beforeEach(() => {
    inMemoryStudentsRepositoryRepository = new InMemoryStudentsRepository();
    fakeHasher = new FakeHasher();

    sut = new RegisterStudentUseCase(
      inMemoryStudentsRepositoryRepository,
      fakeHasher,
    );
  });

  it('should be to register a new student', async () => {
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    const result = await sut.execute({
      name,
      email,
      password,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      data: inMemoryStudentsRepositoryRepository.items[0],
    });
  });

  it('should hash student password upon registration', async () => {
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    const result = await sut.execute({
      name,
      email,
      password,
    });

    const hashedPassword = await fakeHasher.hash(password);

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryStudentsRepositoryRepository.items[0]?.password).toEqual(
      hashedPassword,
    );
  });

  it('should not be able to register a new student with same email', async () => {
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    await sut.execute({
      name,
      email,
      password,
    });

    const result = await sut.execute({
      name,
      email,
      password,
    });

    expect(result.isLeft()).toBeTruthy();
  });
});
