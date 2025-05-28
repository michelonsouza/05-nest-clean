import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { Comment, CommentConstructorParams } from './comment';

export interface QuestionCommentConstructorParams
  extends CommentConstructorParams {
  questionId: UniqueEntityID;
}

export class QuestionComment extends Comment<QuestionCommentConstructorParams> {
  static create(
    { createdAt, ...params }: QuestionCommentConstructorParams,
    id?: UniqueEntityID,
  ) {
    const questionComment = new QuestionComment(
      {
        ...params,
        createdAt: createdAt ?? new Date(),
      },
      id,
    );

    return questionComment;
  }

  get questionId(): UniqueEntityID {
    return this.params.questionId;
  }
}
