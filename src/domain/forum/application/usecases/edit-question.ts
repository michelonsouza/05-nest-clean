import { Either, left, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';

import type { Question } from '../../enterprise/entities/question';
import { QuestionAttachment } from '../../enterprise/entities/question-attachment';
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list';
import { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository';
import type { QuestionsRepository } from '../repositories/questions-repository';

interface EditQuestionUseCaseParams {
  questionId: string;
  authorId: string;
  title: string;
  content: string;
  attachmentIds: string[];
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    data: Question;
  }
>;

export class EditQuestionUseCase {
  #questionsRepository: QuestionsRepository;
  #questionAttachmentsRepository: QuestionAttachmentsRepository;

  constructor(
    questionsRepository: QuestionsRepository,
    questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {
    this.#questionsRepository = questionsRepository;
    this.#questionAttachmentsRepository = questionAttachmentsRepository;
  }

  async execute({
    questionId,
    authorId,
    title,
    content,
    attachmentIds,
  }: EditQuestionUseCaseParams): Promise<EditQuestionUseCaseResponse> {
    const question = await this.#questionsRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError('Question'));
    }

    const isQuestionAuthor = question.authorId.toValue() === authorId;

    if (!isQuestionAuthor) {
      return left(new NotAllowedError());
    }

    const currentQuestionAttachments =
      await this.#questionAttachmentsRepository.findManyByQuestionId(
        questionId,
      );

    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachments,
    );

    const questionAttachments = attachmentIds.map((attachmentId) =>
      QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      }),
    );

    questionAttachmentList.update(questionAttachments);

    question.title = title;
    question.content = content;
    question.attachments = questionAttachmentList;

    await this.#questionsRepository.save(question);

    return right({
      data: question,
    });
  }
}
