import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen-event';

import { SendNotificationUseCase } from '../usecases/send-notification';

export class OnQuestionBestAnswerChosen implements EventHandler {
  #answersRepository: AnswersRepository;
  #sendNotificationUseCase: SendNotificationUseCase;

  constructor(
    answersRepository: AnswersRepository,
    sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.#answersRepository = answersRepository;
    this.#sendNotificationUseCase = sendNotificationUseCase;
    this.setupSubscriptions();
  }

  async #sendQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent): Promise<void> {
    const answer = await this.#answersRepository.findById(
      bestAnswerId.toString(),
    );

    if (answer) {
      await this.#sendNotificationUseCase.execute({
        recipientId: answer.authorId.toString(),
        title: 'Sua resposta foi escolhida!',
        content: `A resposta que vc enviou em "${question.title
          .substring(0, 20)
          .concat('...')}" foi escolhida pelo autor!`,
      });
    }
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.#sendQuestionBestAnswerNotification.bind(this),
      QuestionBestAnswerChosenEvent.name,
    );
  }
}
