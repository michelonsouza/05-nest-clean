import { fakerPT_BR as faker } from '@faker-js/faker';

import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';
import { makeNotification } from 'tests/factories/make-notification';
import { InMemoryNotificationsRepository } from 'tests/repositories/in-memory-notifications-repository';

import { ReadNotificationUseCase } from './read-notification';

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: ReadNotificationUseCase;

describe('ReadNotificationUseCase', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository);
  });

  it('should be able to send a notification', async () => {
    const { recipientId, notification } = makeNotification();

    await inMemoryNotificationsRepository.create(notification);

    const result = await sut.execute({
      recipientId,
      notificationId: notification.id.toValue(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryNotificationsRepository.items[0].readAt).toBeInstanceOf(
      Date,
    );
    expect(inMemoryNotificationsRepository.items[0].createdAt).toBeInstanceOf(
      Date,
    );
    expect(inMemoryNotificationsRepository.items[0].title).toEqual(
      notification.title,
    );
    expect(inMemoryNotificationsRepository.items[0].content).toEqual(
      notification.content,
    );
  });

  it('should not be able to read a notification from another recipiennt', async () => {
    const { notification } = makeNotification();
    const wrongRecipientId = faker.string.uuid();

    await inMemoryNotificationsRepository.create(notification);

    const result = await sut.execute({
      recipientId: wrongRecipientId,
      notificationId: notification.id.toValue(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to read a not found notification', async () => {
    const result = await sut.execute({
      recipientId: faker.string.uuid(),
      notificationId: faker.string.uuid(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
