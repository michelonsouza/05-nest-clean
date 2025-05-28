import { MockInstance } from 'vitest';

import { makeAnswer } from 'tests/factories/make-answer';
import { makeQuestion } from 'tests/factories/make-question';
import { InMemoryAnswerAttachementsRepository } from 'tests/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswersRepository } from 'tests/repositories/in-memory-answers-repository';
import { InMemoryNotificationsRepository } from 'tests/repositories/in-memory-notifications-repository';
import { InMemoryQuestionAttachementsRepository } from 'tests/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from 'tests/repositories/in-memory-questions-repository';

import { OnQuestionBestAnswerChosen } from './on-question-best-answer-chosen';
import {
  SendNotificationUseCase,
  SendNotificationUseCaseParams,
  SendNotificationUseCaseResponse,
} from '../usecases/send-notification';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachementsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachementsRepository: InMemoryAnswerAttachementsRepository;
let sendNotificationUseCase: SendNotificationUseCase;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;

let sendNotificationExecuteSpy: MockInstance<
  ({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseParams) => Promise<SendNotificationUseCaseResponse>
>;

describe('OnQuestionBestAnswerChosen', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachementsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    inMemoryAnswerAttachementsRepository =
      new InMemoryAnswerAttachementsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachementsRepository,
    );
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');

    new OnQuestionBestAnswerChosen(
      inMemoryAnswersRepository,
      sendNotificationUseCase,
    );
  });

  it('should send a notification when an question has new best answer chosen', async () => {
    const { question } = makeQuestion();
    const { answer } = makeAnswer({ questionId: question.id });

    await inMemoryQuestionsRepository.create(question);
    await inMemoryAnswersRepository.create(answer);

    question.bestAnswerId = answer.id;

    await inMemoryQuestionsRepository.save(question);

    await vi.waitFor(() =>
      expect(sendNotificationExecuteSpy).toHaveBeenCalled(),
    );
  });
});
