import { Injectable } from '@nestjs/common';
import { IEvent, IEventBus } from '@nestjs/cqrs/dist/interfaces';
import { EventStore } from './eventstore';
import { StorableEvent } from './interfaces/storable-event';
import { ViewEventBus } from './view/view-event-bus';

@Injectable()
export class StoreEventBus implements IEventBus {
  constructor(
    private readonly eventBus: ViewEventBus,
    private readonly eventStore: EventStore,
  ) {}

  publish<T extends IEvent>(event: T): void {
    const storableEvent = (event as any) as StorableEvent;
    if (
      storableEvent.id === undefined ||
      storableEvent.eventAggregate === undefined ||
      storableEvent.eventVersion === undefined
    ) {
      throw new Error('Events must implement StorableEvent interface');
    }
    this.eventStore
      .storeEvent(storableEvent)
      .then(() => this.eventBus.publish(event))
      .catch(err => {
        throw err;
      });
  }

  publishAll(events: IEvent[]): void {
    (events || []).forEach(event => this.publish(event));
  }
}
