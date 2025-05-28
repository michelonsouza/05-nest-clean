import { Injectable } from '@nestjs/common';

import { Either, right } from '@/core/either';

import type { Question } from '../../enterprise/entities/question';
import { QuestionsRepository } from '../repositories/questions-repository';

interface ListRecentQuestionsUseCaseParams {
  page: number;
}

type ListRecentQuestionsUseCaseResponse = Either<
  null,
  {
    data: Question[];
  }
>;

@Injectable()
export class ListRecentQuestionsUseCase {
  #questionsRepository: QuestionsRepository;

  constructor(questionsRepository: QuestionsRepository) {
    this.#questionsRepository = questionsRepository;
  }

  async execute({
    page,
  }: ListRecentQuestionsUseCaseParams): Promise<ListRecentQuestionsUseCaseResponse> {
    const questions = await this.#questionsRepository.findManyRecent({ page });

    return right({
      data: questions,
    });
  }
}
