import { UseCaseError } from '@/core/errors/use-case';

export class WrongCredentialsError extends Error implements UseCaseError {
  constructor() {
    super('Credentials are not valid.');
    this.name = 'WrongCredentialsError';
  }
}
