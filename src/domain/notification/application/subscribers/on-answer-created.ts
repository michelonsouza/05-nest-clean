import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created-event';

import { SendNotificationUseCase } from '../usecases/send-notification';

export class OnAnswerCreated implements EventHandler {
  #questionsRepository: QuestionsRepository;
  #sendNotificationUseCase: SendNotificationUseCase;

  constructor(
    questionsRepository: QuestionsRepository,
    sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.#questionsRepository = questionsRepository;
    this.#sendNotificationUseCase = sendNotificationUseCase;
    this.setupSubscriptions();
  }

  async #sendNewAnswerNotification({
    answer,
  }: AnswerCreatedEvent): Promise<void> {
    const question = await this.#questionsRepository.findById(
      answer.questionId.toString(),
    );

    if (question) {
      await this.#sendNotificationUseCase.execute({
        recipientId: question.authorId.toString(),
        title: `Nova resposta em "${question.title.substring(0, 40).concat('...')}"`,
        content: answer.excerpt,
      });
    }
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.#sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    );
  }
}
