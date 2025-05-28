import { type Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';

import type { QuestionsRepository } from '../repositories/questions-repository';

interface DeleteQuestionUseCaseParams {
  questionId: string;
  authorId: string;
}

type DeleteQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  void
>;

export class DeleteQuestionUseCase {
  #questionsRepository: QuestionsRepository;

  constructor(questionsRepository: QuestionsRepository) {
    this.#questionsRepository = questionsRepository;
  }

  async execute({
    questionId,
    authorId,
  }: DeleteQuestionUseCaseParams): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.#questionsRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError('Question'));
    }

    const isQuestionAuthor = question.authorId.toValue() === authorId;

    if (!isQuestionAuthor) {
      return left(new NotAllowedError());
    }

    await this.#questionsRepository.delete(question);

    return right(undefined);
  }
}
