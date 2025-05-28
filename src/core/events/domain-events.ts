import { DomainEvent } from './domain-event';
import { AggregateRoot } from '../entities/aggregate-root';
import { UniqueEntityID } from '../entities/unique-entity-id';

export type DomainEventCallback<EventType = any> = (event: EventType) => void;

export class DomainEvents {
  static #handlersMap: Record<string, DomainEventCallback[]> = {};
  static #markedAggregates: AggregateRoot<any>[] = [];

  public static findMarkedAggregateByID(id: UniqueEntityID) {
    return this.#markedAggregates.find((aggregate) => {
      return aggregate.id.equals(id);
    });
  }

  public static markAggregateForDispatch(aggregate: AggregateRoot<any>): void {
    const aggregateFound = !!this.findMarkedAggregateByID(aggregate.id);

    if (!aggregateFound) {
      this.#markedAggregates.push(aggregate);
    }
  }

  static #dispatch(event: DomainEvent): void {
    const eventClassName: string = event.constructor.name;

    const isEventRegistered: boolean = eventClassName in this.#handlersMap;

    if (isEventRegistered) {
      const handlers: DomainEventCallback[] = this.#handlersMap[eventClassName];

      for (const handler of handlers) {
        handler(event);
      }
    }
  }

  static #dispatchAggregateEvents(aggregate: AggregateRoot<any>): void {
    aggregate.domainEvents.forEach((event: DomainEvent) =>
      this.#dispatch(event),
    );
  }

  static #removeAggregateFromMarkedDispatchList(
    aggregate: AggregateRoot<any>,
  ): void {
    const index = this.#markedAggregates.findIndex((aggregateMarked) => {
      return aggregateMarked.equals(aggregate);
    });

    this.#markedAggregates.splice(index, 1);
  }

  static #findMarkedAggregateByID(
    id: UniqueEntityID,
  ): AggregateRoot<any> | undefined {
    return this.#markedAggregates.find((aggregate) => {
      return aggregate.id.equals(id);
    });
  }

  public static dispatchEventsForAggregate(id: UniqueEntityID): void {
    const aggregate = this.#findMarkedAggregateByID(id);

    if (aggregate) {
      this.#dispatchAggregateEvents(aggregate);
      aggregate.clearEvents();
      this.#removeAggregateFromMarkedDispatchList(aggregate);
    }
  }

  public static register(
    callback: DomainEventCallback,
    eventClassName: string,
  ): void {
    const wasEventRegisteredBefore = eventClassName in this.#handlersMap;

    if (!wasEventRegisteredBefore) {
      this.#handlersMap[eventClassName] = [];
    }

    this.#handlersMap[eventClassName].push(callback);
  }

  public static clearHandlers(): void {
    this.#handlersMap = {};
  }

  public static clearMarkedAggregates(): void {
    this.#markedAggregates = [];
  }
}
