import { type Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';

import { QuestionCommentsRepository } from '../repositories/question-comments-repository';

interface DeleteQuestionCommentUseCaseParams {
  authorId: string;
  questionCommentId: string;
}

type DeleteQuestionCommentUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  void
>;

export class DeleteQuestionCommentUseCase {
  #questionCommentsRepository: QuestionCommentsRepository;

  constructor(questionCommentsRepository: QuestionCommentsRepository) {
    this.#questionCommentsRepository = questionCommentsRepository;
  }

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentUseCaseParams): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment =
      await this.#questionCommentsRepository.findById(questionCommentId);

    if (!questionComment) {
      return left(new ResourceNotFoundError('Question comment'));
    }

    if (questionComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    await this.#questionCommentsRepository.delete(questionComment);

    return right(undefined);
  }
}
