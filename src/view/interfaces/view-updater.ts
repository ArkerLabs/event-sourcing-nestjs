import { IEventHandler, IEvent } from '@nestjs/cqrs';

export interface IViewUpdater<T extends IEvent> extends IEventHandler<IEvent> {
    handle(event: T): Promise<void>;
}
