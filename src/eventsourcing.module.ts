import { Module, DynamicModule } from '@nestjs/common';
import { EventSourcingOptions } from './interfaces';
import { CqrsModule } from '@nestjs/cqrs';
import { ViewEventBus } from './view/view-event-bus';
import { StoreEventBus } from './store-event-bus';
import { EventStore } from './eventstore';
import { ViewUpdater } from './view/view-updater';

@Module({})
export class EventSourcingModule {
    static forRoot(options: EventSourcingOptions): DynamicModule {
        return {
            module: EventSourcingModule,
            imports: [
                CqrsModule,
            ],
            providers: [
                ViewUpdater,
                ViewEventBus,
                StoreEventBus,
                {
                    provide: EventStore,
                    useValue: new EventStore(options.mongoURL),
                },
            ],
            exports: [
                StoreEventBus,
            ],
        };
    }
}
