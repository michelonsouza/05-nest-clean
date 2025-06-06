import { type Either, left, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';

import type { Answer } from '../../enterprise/entities/answer';
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list';
import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository';
import type { AnswersRepository } from '../repositories/answers-repository';

interface EditAnswerUseCaseParams {
  answerId: string;
  authorId: string;
  content: string;
  attachmentIds: string[];
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    data: Answer;
  }
>;

export class EditAnswerUseCase {
  #answersRepository: AnswersRepository;
  #answerAttachmentsRepository: AnswerAttachmentsRepository;

  constructor(
    answersRepository: AnswersRepository,
    answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {
    this.#answersRepository = answersRepository;
    this.#answerAttachmentsRepository = answerAttachmentsRepository;
  }

  async execute({
    answerId,
    authorId,
    content,
    attachmentIds,
  }: EditAnswerUseCaseParams): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.#answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError('Answer'));
    }

    const isAnswerAuthor = answer.authorId.toValue() === authorId;

    if (!isAnswerAuthor) {
      return left(new NotAllowedError());
    }

    const currentAnswerAttachments =
      await this.#answerAttachmentsRepository.findManyByAnswerId(answerId);

    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments,
    );

    const answerAttachments = attachmentIds.map(attachmentId =>
      AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id,
      }),
    );

    answerAttachmentList.update(answerAttachments);

    answer.content = content;
    answer.attachments = answerAttachmentList;

    await this.#answersRepository.save(answer);

    return right({
      data: answer,
    });
  }
}
