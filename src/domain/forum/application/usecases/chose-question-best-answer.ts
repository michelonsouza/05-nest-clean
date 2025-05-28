import { type Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';
import type { Question } from '@/domain/forum/enterprise/entities/question';

import type { AnswersRepository } from '../repositories/answers-repository';
import type { QuestionsRepository } from '../repositories/questions-repository';

export interface ChoseQuestionBestAnswerUseCaseParams {
  answerId: string;
  authorId: string;
}

type ChoseQuestionBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    data: Question;
  }
>;

export class ChoseQuestionBestAnswerUseCase {
  #answersRepository: AnswersRepository;
  #questionsRepository: QuestionsRepository;

  constructor(
    questionsRepository: QuestionsRepository,
    answersRepository: AnswersRepository,
  ) {
    this.#questionsRepository = questionsRepository;
    this.#answersRepository = answersRepository;
  }

  async execute({
    answerId,
    authorId,
  }: ChoseQuestionBestAnswerUseCaseParams): Promise<ChoseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.#answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError('Answer'));
    }

    const question = await this.#questionsRepository.findById(
      answer.questionId.toString(),
    );

    if (!question) {
      return left(new ResourceNotFoundError('Question'));
    }

    if (question.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    question.bestAnswerId = answer.id;

    await this.#questionsRepository.save(question);

    return right({
      data: question,
    });
  }
}
