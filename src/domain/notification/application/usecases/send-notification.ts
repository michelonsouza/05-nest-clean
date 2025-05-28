import { type Either, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Notification } from '@/domain/notification/enterprise/entities/notification';

import { NotificationsRepository } from '../repositories/notifications-repository';

export interface SendNotificationUseCaseParams {
  recipientId: string;
  title: string;
  content: string;
}

export type SendNotificationUseCaseResponse = Either<
  null,
  {
    data: Notification;
  }
>;

export class SendNotificationUseCase {
  #notificationsRepository: NotificationsRepository;

  constructor(notificationsRepository: NotificationsRepository) {
    this.#notificationsRepository = notificationsRepository;
  }

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseParams): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityID(recipientId),
      title,
      content,
    });

    await this.#notificationsRepository.create(notification);

    return right({
      data: notification,
    });
  }
}
