import { type Either, left, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';

import { AnswerComment } from '../../enterprise/entities/answer-comment';
import type { AnswerCommentsRepository } from '../repositories/answer-comments-repository';
import type { AnswersRepository } from '../repositories/answers-repository';

interface CommentOnAnswerUseCaseParams {
  authorId: string;
  answerId: string;
  content: string;
}

type CommentOnAnswerUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    data: AnswerComment;
  }
>;

export class CommentOnAnswerUseCase {
  #answersRepository: AnswersRepository;
  #answerCommentsRepository: AnswerCommentsRepository;

  constructor(
    answersRepository: AnswersRepository,
    answerCommentsRepository: AnswerCommentsRepository,
  ) {
    this.#answersRepository = answersRepository;
    this.#answerCommentsRepository = answerCommentsRepository;
  }

  async execute({
    authorId,
    answerId,
    content,
  }: CommentOnAnswerUseCaseParams): Promise<CommentOnAnswerUseCaseResponse> {
    const answer = await this.#answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError('Answer'));
    }

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityID(authorId),
      answerId: new UniqueEntityID(answerId),
      createdAt: new Date(),
      content,
    });

    await this.#answerCommentsRepository.create(answerComment);

    return right({
      data: answerComment,
    });
  }
}
