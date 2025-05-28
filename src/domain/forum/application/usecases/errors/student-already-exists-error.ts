import { UseCaseError } from '@/core/errors/use-case';

export class StudentAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Student "${identifier}" already exists.`);
    this.name = 'StudentAlreadyExistsError';
  }
}
