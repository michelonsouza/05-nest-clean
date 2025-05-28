import { Injectable } from "@nestjs/common";

import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";

@Injectable()
export class PrismaQuestionCommentsRepository implements QuestionCommentsRepository {
  findManyByQuestionId(questionId: string, params: PaginationParams): Promise<QuestionComment[]> {
    throw new Error("Method not implemented.");
  }
  findById(id: string): Promise<QuestionComment | null> {
    throw new Error("Method not implemented.");
  }
  save(data: QuestionComment): Promise<void> {
    throw new Error("Method not implemented.");
  }
  create(data: QuestionComment): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(data: QuestionComment): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findBySlug(slug: string): Promise<Question | null> {
    throw new Error("Method not implemented.");
  }
  findManyRecent(params: PaginationParams): Promise<Question[]> {
    throw new Error("Method not implemented.");
  }
}
