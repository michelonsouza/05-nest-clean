import { randomUUID } from 'node:crypto';

export class UniqueEntityID {
  #value: string;

  constructor(value?: string) {
    this.#value = value ?? randomUUID();
  }

  public equals(id: UniqueEntityID): boolean {
    return this.#value === id.toValue();
  }

  public toString(): string {
    return this.#value;
  }

  public toValue(): string {
    return this.#value;
  }
}
