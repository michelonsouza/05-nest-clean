import { Injectable } from "@nestjs/common";

import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  findById(id: string): Promise<Answer | null> {
    throw new Error("Method not implemented.");
  }
  save(data: Answer): Promise<void> {
    throw new Error("Method not implemented.");
  }
  create(data: Answer): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(data: Answer): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findeManyByQuestionId(questionId: string, params: PaginationParams): Promise<Answer[]> {
    throw new Error("Method not implemented.");
  }
}
