import { INestApplication } from '@nestjs/common';
import { EventStore } from '../eventstore';
import { ViewUpdater } from '../view/view-updater';

export class ReconstructViewDb {

    static async run(app: INestApplication) {
        const sleep = (ms: number) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        const eventStore = app.get(EventStore);
        const viewUpdater = app.get(ViewUpdater);

        while (!eventStore.isInitiated()) { // We wait until the event store is fully launched
            await sleep(100);
        }
        let event;
        let index = 0;

        while (event = await eventStore.getEvent(index)) {
            await viewUpdater.run(event);
            index++;
        }

        console.log('View db has been restored!');
    }
}
