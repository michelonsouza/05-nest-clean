import { type Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';
import { Notification } from '@/domain/notification/enterprise/entities/notification';

import { NotificationsRepository } from '../repositories/notifications-repository';

interface ReadNotificationUseCaseParams {
  recipientId: string;
  notificationId: string;
}

type ReadNotificationUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    data: Notification;
  }
>;

export class ReadNotificationUseCase {
  #notificationsRepository: NotificationsRepository;

  constructor(notificationsRepository: NotificationsRepository) {
    this.#notificationsRepository = notificationsRepository;
  }

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseParams): Promise<ReadNotificationUseCaseResponse> {
    const notification =
      await this.#notificationsRepository.findById(notificationId);

    if (!notification) {
      return left(new ResourceNotFoundError('Notification'));
    }

    const isRecipientNotification =
      notification.recipientId.toValue() === recipientId;

    if (!isRecipientNotification) {
      return left(new NotAllowedError());
    }

    notification.read();

    await this.#notificationsRepository.save(notification);

    return right({
      data: notification,
    });
  }
}
