import { Either, right } from '@/core/either';

import type { Answer } from '../../enterprise/entities/answer';
import type { AnswersRepository } from '../repositories/answers-repository';

interface ListQuestionAnswersUseCaseParams {
  questionId: string;
  page: number;
}

type ListQuestionAnswersUseCaseResponse = Either<
  null,
  {
    data: Answer[];
  }
>;

export class ListQuestionAnswersUseCase {
  #answersRepository: AnswersRepository;

  constructor(answersRepository: AnswersRepository) {
    this.#answersRepository = answersRepository;
  }

  async execute({
    page,
    questionId,
  }: ListQuestionAnswersUseCaseParams): Promise<ListQuestionAnswersUseCaseResponse> {
    const answers = await this.#answersRepository.findeManyByQuestionId(
      questionId,
      {
        page,
      },
    );

    return right({
      data: answers,
    });
  }
}
