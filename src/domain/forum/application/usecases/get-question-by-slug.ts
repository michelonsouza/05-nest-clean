import { Injectable } from '@nestjs/common';

import { type Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';
import type { Question } from '@/domain/forum/enterprise/entities/question';

import { QuestionsRepository } from '../repositories/questions-repository';

interface GetQuestionBySlugUseCaseParams {
  slug: string;
}

type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    data: Question;
  }
>;

@Injectable()
export class GetQuestionBySlugUseCase {
  #questionsRepository: QuestionsRepository;

  constructor(questionsRepository: QuestionsRepository) {
    this.#questionsRepository = questionsRepository;
  }

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseParams): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.#questionsRepository.findBySlug(slug);

    if (!question) {
      return left(new ResourceNotFoundError('Question'));
    }

    return right({
      data: question,
    });
  }
}
