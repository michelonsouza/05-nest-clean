import { UseCaseError } from '@/core/errors/use-case';

export class NotAllowedError extends Error implements UseCaseError {
  constructor(message?: string) {
    super(message ?? 'Not allowed');
    this.name = 'NotAllowedError';
  }
}
