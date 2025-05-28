import { fakerPT_BR as faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Notification,
  NotificationConstructorParams,
} from '@/domain/notification/enterprise/entities/notification';

export function makeNotification(
  override: Partial<NotificationConstructorParams> = {},
  id?: string,
) {
  const recipientId = override?.recipientId?.toValue() ?? faker.string.uuid();
  const title = override.title ?? faker.lorem.sentence();
  const content = override.content ?? faker.lorem.sentence();

  const notification = Notification.create(
    {
      recipientId: new UniqueEntityID(recipientId),
      content,
      title,
      ...override,
    },
    id ? new UniqueEntityID(id) : undefined,
  );

  return {
    recipientId,
    content,
    title,
    notification,
  };
}
