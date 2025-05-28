import { type Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';

import type { AnswersRepository } from '../repositories/answers-repository';

interface DeleteAnswerUseCaseParams {
  answerId: string;
  authorId: string;
}

type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  void
>;

export class DeleteAnswerUseCase {
  #answersRepository: AnswersRepository;

  constructor(answersRepository: AnswersRepository) {
    this.#answersRepository = answersRepository;
  }

  async execute({
    answerId,
    authorId,
  }: DeleteAnswerUseCaseParams): Promise<DeleteAnswerUseCaseResponse> {
    const question = await this.#answersRepository.findById(answerId);

    if (!question) {
      return left(new ResourceNotFoundError('Question'));
    }

    const isQuestionAuthor = question.authorId.toValue() === authorId;

    if (!isQuestionAuthor) {
      return left(new NotAllowedError());
    }

    await this.#answersRepository.delete(question);

    return right(undefined);
  }
}
