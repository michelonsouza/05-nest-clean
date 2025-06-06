import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { Repository } from '@/core/repositories/repository';
import type { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';

export interface AnswerCommentsRepository extends Repository<AnswerComment> {
  findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]>;
}
