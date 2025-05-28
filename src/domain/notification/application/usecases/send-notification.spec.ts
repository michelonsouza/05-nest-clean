import { makeNotification } from 'tests/factories/make-notification';
import { InMemoryNotificationsRepository } from 'tests/repositories/in-memory-notifications-repository';

import { SendNotificationUseCase } from './send-notification';

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: SendNotificationUseCase;

describe('SendNotificationUseCase', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository);
  });

  it('should be able to send a notification', async () => {
    const { content, title, recipientId } = makeNotification();

    const result = await sut.execute({
      recipientId,
      content,
      title,
    });

    const notification = result.value?.data;

    expect(result.isRight()).toBe(true);
    expect(notification?.content).toEqual(content);
    expect(inMemoryNotificationsRepository.items[0].id).toEqual(
      notification?.id,
    );
  });
});
