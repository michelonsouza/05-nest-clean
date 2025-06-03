import { Body, Controller, Post } from '@nestjs/common';
import { z } from 'zod';

import { CreateQuestionUseCase } from '@/domain/forum/application/usecases/create-question';
import { CurrentUser } from '@infra/auth/current-user.decorator';
import type { UserPayload } from '@infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@infra/http/pipes/zod-validation-pipe';

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller('/questions')
export class CreateQuestionController {
  constructor(private readonly createQuestionUseCase: CreateQuestionUseCase) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { content, title } = body;
    const { sub: authorId } = user;

    await this.createQuestionUseCase.execute({
      authorId,
      content,
      title,
      attachmentIds: [],
    });
  }
}
