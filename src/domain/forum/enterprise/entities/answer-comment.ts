import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { Comment, type CommentConstructorParams } from './comment';

export interface AnswerCommentConstructorParams
  extends CommentConstructorParams {
  answerId: UniqueEntityID;
}

export class AnswerComment extends Comment<AnswerCommentConstructorParams> {
  static create(
    { createdAt, ...params }: AnswerCommentConstructorParams,
    id?: UniqueEntityID,
  ) {
    const answerComment = new AnswerComment(
      {
        ...params,
        createdAt: createdAt ?? new Date(),
      },
      id,
    );

    return answerComment;
  }

  get answerId(): UniqueEntityID {
    return this.params.answerId;
  }
}
