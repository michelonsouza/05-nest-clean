import { Injectable } from '@nestjs/common';

import { type Either, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { Question } from '../../enterprise/entities/question';
import { QuestionAttachment } from '../../enterprise/entities/question-attachment';
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list';
import { QuestionsRepository } from '../repositories/questions-repository';

interface CreateQuestionUseCaseParams {
  authorId: string;
  title: string;
  content: string;
  attachmentIds: string[];
}

type CreateQuestionUseCaseResponse = Either<
  null,
  {
    data: Question;
  }
>;

@Injectable()
export class CreateQuestionUseCase {
  #questionsRepository: QuestionsRepository;

  constructor(questionsRepository: QuestionsRepository) {
    this.#questionsRepository = questionsRepository;
  }

  async execute({
    authorId,
    content,
    title,
    attachmentIds,
  }: CreateQuestionUseCaseParams): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityID(authorId),
      content,
      title,
    });

    const questionAttachments = attachmentIds.map((attachmentId) =>
      QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      }),
    );

    question.attachments = new QuestionAttachmentList(questionAttachments);

    await this.#questionsRepository.create(question);

    return right({
      data: question,
    });
  }
}
