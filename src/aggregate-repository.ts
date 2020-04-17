import { Injectable } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { Type } from './metadata';
import { EventStore } from './eventstore';

@Injectable()
export class AggregateRepository {
  constructor(private readonly eventStore: EventStore) {}

  async getById<T extends AggregateRoot>(
    type: Type<T>,
    aggregateName: string,
    aggregateId: string,
  ): Promise<T | null> {
    const aggregateEvents = await this.eventStore.getEvents(
      aggregateName,
      aggregateId,
    );

    if (!aggregateEvents || aggregateEvents.length === 0) {
      return null;
    }

    const aggregate = new type(aggregateId);

    aggregate.loadFromHistory(aggregateEvents);

    return aggregate;
  }
}
