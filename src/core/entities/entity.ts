import { UniqueEntityID } from './unique-entity-id';

export abstract class Entity<ParamsType = any> {
  #id: UniqueEntityID;

  protected params: ParamsType;

  protected constructor(params: ParamsType, id?: UniqueEntityID) {
    this.params = params;
    this.#id = id ?? new UniqueEntityID();
  }

  get id(): UniqueEntityID {
    return this.#id;
  }

  public equals(entity: Entity): boolean {
    return this.#id.equals(entity.id);
  }
}
