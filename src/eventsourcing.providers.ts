import { ViewUpdater } from './view/view-updater';
import { ViewEventBus } from './view/view-event-bus';
import { StoreEventBus } from './store-event-bus';
import { EventStore } from './eventstore';

export function createEventSourcingProviders() {
    return [
        ViewUpdater,
        ViewEventBus,
        StoreEventBus,
        EventStore,
    ];
}