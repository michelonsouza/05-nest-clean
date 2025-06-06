import type { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository';
import type { Notification } from '@/domain/notification/enterprise/entities/notification';

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  #notifications: Notification[] = [];

  async create(notification: Notification): Promise<void> {
    this.#notifications.push(notification);

    return Promise.resolve();
  }

  async save(notification: Notification): Promise<void> {
    const index = this.#notifications.findIndex(
      n => n.id.toValue() === notification.id.toValue(),
    );

    this.#notifications[index] = notification;

    return Promise.resolve();
  }

  async findById(id: string): Promise<Notification | null> {
    const notification =
      this.#notifications.find(
        notification => notification.id.toValue() === id,
      ) ?? null;

    return Promise.resolve(notification);
  }

  async delete(notification: Notification): Promise<void> {
    const notifications = this.#notifications.filter(
      n => n.id.toValue() !== notification.id.toValue(),
    );

    this.#notifications = notifications;

    return Promise.resolve();
  }

  get items() {
    return this.#notifications;
  }
}
