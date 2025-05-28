import { type Either, left, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';

import { QuestionComment } from '../../enterprise/entities/question-comment';
import { QuestionCommentsRepository } from '../repositories/question-comments-repository';
import { QuestionsRepository } from '../repositories/questions-repository';

interface CommentOnQuestionUseCaseParams {
  authorId: string;
  questionId: string;
  content: string;
}

type CommentOnQuestionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    data: QuestionComment;
  }
>;

export class CommentOnQuestionUseCase {
  #questionsRepository: QuestionsRepository;
  #questionCommentsRepository: QuestionCommentsRepository;

  constructor(
    questionsRepository: QuestionsRepository,
    questionCommentsRepository: QuestionCommentsRepository,
  ) {
    this.#questionsRepository = questionsRepository;
    this.#questionCommentsRepository = questionCommentsRepository;
  }

  async execute({
    authorId,
    questionId,
    content,
  }: CommentOnQuestionUseCaseParams): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.#questionsRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError('Question'));
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      createdAt: new Date(),
      content,
    });

    await this.#questionCommentsRepository.create(questionComment);

    return right({
      data: questionComment,
    });
  }
}
