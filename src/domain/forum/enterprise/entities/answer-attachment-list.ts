import { WatchedList } from '@/core/entities/watched-list';

import { AnswerAttachment } from './answer-attachment';

export class AnswerAttachmentList extends WatchedList<AnswerAttachment> {
  compareItems(itemA: AnswerAttachment, itemB: AnswerAttachment): boolean {
    return itemA.attachmentId.equals(itemB.attachmentId);
  }
}
