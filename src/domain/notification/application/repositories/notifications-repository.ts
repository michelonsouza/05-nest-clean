import type { Repository } from '@/core/repositories/repository';

import type { Notification } from '../../enterprise/entities/notification';

export interface NotificationsRepository extends Repository<Notification> {
  create(notification: Notification): Promise<void>;
}
