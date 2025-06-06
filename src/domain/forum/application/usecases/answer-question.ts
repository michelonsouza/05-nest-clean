import { type Either, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Answer } from '@/domain/forum/enterprise/entities/answer';

import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list';
import { AnswersRepository } from '../repositories/answers-repository';

interface AnswerQuestionUseCaseParams {
  instructorId: string;
  questionId: string;
  content: string;
  attachmentIds: string[];
}

type AnswerQuestionUseCaseResponse = Either<
  null,
  {
    data: Answer;
  }
>;

export class AnswerQuestionUseCase {
  #answersRepository: AnswersRepository;

  constructor(answersRepository: AnswersRepository) {
    this.#answersRepository = answersRepository;
  }

  async execute({
    instructorId,
    questionId,
    content,
    attachmentIds,
  }: AnswerQuestionUseCaseParams): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId),
    });

    const answerAttachments = attachmentIds.map(attachmentId =>
      AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id,
      }),
    );

    answer.attachments = new AnswerAttachmentList(answerAttachments);

    await this.#answersRepository.create(answer);

    return right({
      data: answer,
    });
  }
}
