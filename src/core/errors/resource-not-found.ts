import { UseCaseError } from '@/core/errors/use-case';

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor(resource?: string) {
    super(`${resource ?? 'Resource'} not found`);
    this.name = 'ResourceNotFoundError';
  }
}
