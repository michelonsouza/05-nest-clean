import { Injectable } from "@nestjs/common";

import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswerCommentsRepository {
  findManyByAnswerId(answerId: string, params: PaginationParams): Promise<AnswerComment[]> {
    throw new Error("Method not implemented.");
  }
  findById(id: string): Promise<AnswerComment | null> {
    throw new Error("Method not implemented.");
  }
  save(data: AnswerComment): Promise<void> {
    throw new Error("Method not implemented.");
  }
  create(data: AnswerComment): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(data: AnswerComment): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
