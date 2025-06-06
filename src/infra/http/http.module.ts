import { Module } from '@nestjs/common';

import { AuthenticateStudentUseCase } from '@/domain/forum/application/usecases/authenticate-student';
import { CreateQuestionUseCase } from '@/domain/forum/application/usecases/create-question';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/usecases/get-question-by-slug';
import { ListRecentQuestionsUseCase } from '@/domain/forum/application/usecases/list-recent-questions';
import { RegisterStudentUseCase } from '@/domain/forum/application/usecases/register-student';

import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller';
import { ListRecentQuestionsController } from './controllers/list-recent-questions.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    ListRecentQuestionsController,
    GetQuestionBySlugController,
  ],
  providers: [
    CreateQuestionUseCase,
    ListRecentQuestionsUseCase,
    RegisterStudentUseCase,
    AuthenticateStudentUseCase,
    GetQuestionBySlugUseCase,
  ],
})
export class HttpModule {}
