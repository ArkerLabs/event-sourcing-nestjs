import { ViewUpdater } from './view/view-updater';
import { ViewEventBus } from './view/view-event-bus';
import { StoreEventBus } from './store-event-bus';
import { EventStore } from './eventstore';
import { StoreEventPublisher } from './store-event-publisher';

export function createEventSourcingProviders() {
    return [
        ViewUpdater,
        ViewEventBus,
        StoreEventBus,
        StoreEventPublisher,
        EventStore,
    ];
}