import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { z } from 'zod';

import { ZodValidationPipe } from '@infra/http/pipes/zod-validation-pipe';

import { QuestionPresenter } from '../presenters/question-presenter';
import { ListRecentQuestionsUseCase } from './../../../domain/forum/application/usecases/list-recent-questions';

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/questions')
export class ListRecentQuestionsController {
  constructor(
    private readonly listRecentQuestionsUseCase: ListRecentQuestionsUseCase,
  ) {}

  @Get()
  async handle(
    @Query('page', new ZodValidationPipe(pageQueryParamSchema))
    page: PageQueryParamSchema,
  ) {
    const result = await this.listRecentQuestionsUseCase.execute({
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return {
      data: QuestionPresenter.toHTTPMany(result.value.data),
    };
  }
}
