import { Script } from './script';
import { INestApplication } from '@nestjs/common';
import { EventStore } from '../eventstore';
import { ViewUpdater } from '../view/view-updater';

Script.run(async (app: INestApplication) => {

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // TODO If we're reconstructing don't let the api/graphql send new commands

    const eventStore = app.get(EventStore);
    const viewUpdater = app.get(ViewUpdater);

    while (!eventStore.isInitiated()) { // We wait until the event store is fully launched
        await sleep(100);
    }
    let event;
    let index = 0;

    // tslint:disable-next-line: no-conditional-assignment
    while (event = await eventStore.getEvent(index)) {
        event.constructor = {
            name: event.eventName,
        };
        await viewUpdater.run(event);
        index++;
    }

    // tslint:disable-next-line: no-console
    console.log('View db has been restored!');
});
