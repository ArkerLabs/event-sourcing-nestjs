import { EventBus } from '@nestjs/cqrs/dist/event-bus';
import { Injectable } from '@nestjs/common';
import { IEvent, IEventBus } from '@nestjs/cqrs/dist/interfaces';
import { ViewUpdater } from './view-updater';

@Injectable()
export class ViewEventBus implements IEventBus {

    constructor(
        private readonly eventBus: EventBus,
        private viewUpdater: ViewUpdater,
    ) {
    }

    publish<T extends IEvent>(event: T): void {
        this.viewUpdater.run(event)
        .then(() => this.eventBus.publish(event))
        .catch(err => { throw err; });
    }

    publishAll(events: IEvent[]): void {
        (events || []).forEach(event => this.publish(event));
    }
}
