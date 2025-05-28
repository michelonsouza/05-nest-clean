import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { Repository } from '@/core/repositories/repository';
import type { Answer } from '@/domain/forum/enterprise/entities/answer';

export type AnswersRepository = Repository<Answer> & {
  findeManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]>;
};
