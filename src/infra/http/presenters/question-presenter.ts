import { Question } from '@/domain/forum/enterprise/entities/question';

export class QuestionPresenter {
  static toHTTP(question: Question) {
    return {
      id: question.id.toString(),
      title: question.title,
      slug: question.slug.value,
      authorId: question.authorId.toString(),
      createdAt: question.createdAt,
      bestAnswerId: question?.bestAnswerId?.toString() || null,
      updatedAt: question?.updatedAt || null,
    };
  }

  static toHTTPMany(questions: Question[]) {
    return questions.map(this.toHTTP.bind(this));
  }
}
