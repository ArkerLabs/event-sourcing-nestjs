import { ViewUpdater } from './view/view-updater';
import { ViewEventBus } from './view/view-event-bus';
import { StoreEventBus } from './store-event-bus';

export function createEventSourcingProviders() {
    return [
        ViewUpdater,
        ViewEventBus,
        StoreEventBus,
    ];
}