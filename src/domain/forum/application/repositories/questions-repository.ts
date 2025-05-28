import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { Repository } from '@/core/repositories/repository';
import type { Question } from '@/domain/forum/enterprise/entities/question';

export abstract class QuestionsRepository implements Repository<Question> {
  abstract findById(id: string): Promise<Question | null>;
  abstract save(data: Question): Promise<void>;
  abstract create(data: Question): Promise<void>;
  abstract delete(data: Question): Promise<void>;
  abstract findBySlug(slug: string): Promise<Question | null>;
  abstract findManyRecent(params: PaginationParams): Promise<Question[]>;
}
