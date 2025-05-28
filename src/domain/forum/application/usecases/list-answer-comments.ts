import { right, type Either } from '@/core/either';

import type { AnswerComment } from '../../enterprise/entities/answer-comment';
import type { AnswerCommentsRepository } from '../repositories/answer-comments-repository';

interface ListAnswerCommentsUseCaseParams {
  answerId: string;
  page: number;
}

type ListAnswerCommentsUseCaseResponse = Either<
  null,
  {
    data: AnswerComment[];
  }
>;

export class ListAnswerCommentsUseCase {
  #answerCommentsRepository: AnswerCommentsRepository;

  constructor(AnswerCommentsRepository: AnswerCommentsRepository) {
    this.#answerCommentsRepository = AnswerCommentsRepository;
  }

  async execute({
    page,
    answerId,
  }: ListAnswerCommentsUseCaseParams): Promise<ListAnswerCommentsUseCaseResponse> {
    const answerComments =
      await this.#answerCommentsRepository.findManyByAnswerId(answerId, {
        page,
      });

    return right({
      data: answerComments,
    });
  }
}
