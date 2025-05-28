import { Entity } from './entity';
import type { DomainEvent } from '../events/domain-event';
import { DomainEvents } from '../events/domain-events';

export abstract class AggregateRoot<ParamsType> extends Entity<ParamsType> {
  #domainEvents: DomainEvent[] = [];

  get domainEvents(): DomainEvent[] {
    return this.#domainEvents;
  }

  protected addDomainEvent(event: DomainEvent): void {
    this.#domainEvents.push(event);
    DomainEvents.markAggregateForDispatch(this);
  }

  public clearEvents(): void {
    this.#domainEvents = [];
  }
}
