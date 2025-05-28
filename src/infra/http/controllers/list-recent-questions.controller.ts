import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { z } from 'zod';

import { JWTAuthGuard } from '@infra/auth/jwt-auth.guard';
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
@UseGuards(JWTAuthGuard)
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
      throw new Error('Failed to list recent questions');
    }

    return {
      data: QuestionPresenter.toHTTPMany(result.value.data),
    };
  }
}
