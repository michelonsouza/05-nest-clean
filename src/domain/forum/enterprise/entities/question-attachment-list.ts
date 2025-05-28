import { WatchedList } from '@/core/entities/watched-list';

import { QuestionAttachment } from './question-attachment';

export class QuestionAttachmentList extends WatchedList<QuestionAttachment> {
  compareItems(itemA: QuestionAttachment, itemB: QuestionAttachment): boolean {
    return itemA.attachmentId.equals(itemB.attachmentId);
  }
}
