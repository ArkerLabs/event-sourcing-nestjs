import { StorableEvent } from './interfaces/storable-event';

export class EventStore {

    private readonly eventstore;
    private eventStoreLaunched = false;

    constructor(mongoURL: string) {
        this.eventstore = require('eventstore')({
            type: 'mongodb',
            url: mongoURL,
        });
        this.eventstore.init((err) => {
            if (err) {
                throw err;
            }
            this.eventStoreLaunched = true;
        });
    }

    public isInitiated(): boolean {
        return this.eventStoreLaunched;
    }

    public async getEvent(index: number): Promise<StorableEvent> {
        return new Promise<StorableEvent>((resolve, reject) => {
            this.eventstore.getEvents(index, 1, (err, events) => {
                if (events.length > 0) {
                    resolve(events[0].payload);
                } else {
                    resolve(null);
                }
            });
        });
    }

    public async storeEvent<T extends StorableEvent>(event: T): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!this.eventStoreLaunched) {
                reject('Event Store not launched!');
                return;
            }
            this.eventstore.getEventStream({
                aggregateId: event.eventAggregate + '-' + event.id,
                aggregate: event.eventAggregate,
              }, (err, stream) => {
                if (err) {
                    reject(err);
                    return;
                }
                stream.addEvent(event);
                stream.commit((commitErr) => {
                    if (commitErr) {
                        reject(err);
                    }
                    resolve();
                });
            });
        });
    }
}
