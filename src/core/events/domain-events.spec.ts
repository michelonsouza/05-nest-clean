import { DomainEvent } from './domain-event';
import { DomainEvents } from './domain-events';
import { AggregateRoot } from '../entities/aggregate-root';
import { UniqueEntityID } from '../entities/unique-entity-id';

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date;
  #aggregate: CustomAggregate;

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date();
    this.#aggregate = aggregate;
  }

  getAggregateId(): UniqueEntityID {
    return this.#aggregate.id;
  }
}

class CustomAggregate extends AggregateRoot<any> {
  static create(): CustomAggregate {
    const aggregate = new CustomAggregate(null);
    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));
    return aggregate;
  }
}

describe('DomainEvents', () => {
  beforeEach(() => {
    DomainEvents.clearHandlers();
    DomainEvents.clearMarkedAggregates();
  });
  it('should be able to dispatch and listen events', () => {
    const callbackSpy = vi.fn();
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name);

    const aggregate = CustomAggregate.create();

    expect(aggregate.domainEvents).toHaveLength(1);

    DomainEvents.dispatchEventsForAggregate(aggregate.id);

    expect(callbackSpy).toHaveBeenCalled();
    expect(aggregate.domainEvents).toHaveLength(0);
  });

  it('should be able to verify if aggregate is marked as dispatchable', () => {
    const callbackSpy = vi.fn();
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name);

    const aggregate = CustomAggregate.create();

    expect(aggregate.domainEvents).toHaveLength(1);
    expect(DomainEvents.findMarkedAggregateByID(aggregate.id)).toBeTruthy();
  });
});
