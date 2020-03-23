import { Injectable } from '@nestjs/common';
import { StoreEventBus } from './store-event-bus';
import { IEvent, AggregateRoot } from '@nestjs/cqrs';

export interface Constructor<T> {
  new (...args: any[]): T;
}

@Injectable()
export class StoreEventPublisher {
  constructor(private readonly eventBus: StoreEventBus) {}

  mergeClassContext<T extends Constructor<AggregateRoot>>(metatype: T): T {
    const eventBus = this.eventBus;
    return class extends metatype {
      publish(event: IEvent) {
        eventBus.publish(event);
      }
    };
  }

  mergeObjectContext<T extends AggregateRoot>(object: T): T {
    const eventBus = this.eventBus;
    object.publish = (event: IEvent) => {
      eventBus.publish(event);
    };
    return object;
  }
}
