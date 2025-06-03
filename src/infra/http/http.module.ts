import { Module } from '@nestjs/common';

import { AuthenticateStudentUseCase } from '@/domain/forum/application/usecases/authenticate-student';
import { CreateQuestionUseCase } from '@/domain/forum/application/usecases/create-question';
import { ListRecentQuestionsUseCase } from '@/domain/forum/application/usecases/list-recent-questions';
import { RegisterStudentUseCase } from '@/domain/forum/application/usecases/register-student';

import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { ListRecentQuestionsController } from './controllers/list-recent-questions.controller';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    ListRecentQuestionsController,
  ],
  providers: [
    CreateQuestionUseCase,
    ListRecentQuestionsUseCase,
    RegisterStudentUseCase,
    AuthenticateStudentUseCase,
  ],
})
export class HttpModule {}
