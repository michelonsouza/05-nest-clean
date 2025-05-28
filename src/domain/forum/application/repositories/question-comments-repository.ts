import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { Repository } from '@/core/repositories/repository';

import type { QuestionComment } from '../../enterprise/entities/question-comment';

export interface QuestionCommentsRepository
  extends Repository<QuestionComment> {
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]>;
}
