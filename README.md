Event Sourcing for Nestjs
=====
[![npm version](https://badge.fury.io/js/event-sourcing-nestjs.svg)](https://badge.fury.io/js/event-sourcing-nestjs)

Library that implements event sourcing using NestJS and his CQRS library.



## State of the art
![State of the art](https://raw.githubusercontent.com/ArkerLabs/event-sourcing-nestjs/master/docs/state.jpg)


## Getting started
```bash
npm install event-sourcing-nestjs @nestjs/cqrs --save
```

## Usage

### Importing
```ts
import { Module } from '@nestjs/common';
import { EventSourcingModule } from 'event-sourcing-nestjs';

@Module({
  imports: [
    EventSourcingModule.forRoot({
      mongoURL: 'mongodb://localhost:27017/eventstore',
    }),
  ],
})
export class ApplicationModule {}
```

### Event emitter
Instead of using Nest's EventBus use StoreEventBus, so events will persist before their handlers are executed.

```ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StoreEventBus } from 'event-sourcing-nestjs';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {

    constructor(
        private readonly eventBus: StoreEventBus,
    ) {}

    async execute(command: CreateUserCommand) {
        this.eventBus.publish(new UserCreatedEvent(command.name));
    }

}
```

### View updaters

After emitting an event, use a view updater to update the read database state.
This view updaters will be used to recontruct the db if needed.

```ts
import { IViewUpdater, ViewUpdater } from 'event-sourcing-nestjs';

@ViewUpdater(UserCreatedEvent)
export class UserCreatedUpdater implements IViewUpdater<UserCreatedEvent> {

    async handle(event: UserCreatedEvent) {
        // Save user into our view db
    }
}
```

## Reconstructing the view db
Add this script to your package.json:
```json
"reconstruct-view-db": "ts-node -r tsconfig-paths/register node_modules/event-sourcing-nestjs/src/scripts/reconstruct-view-db.ts"
```

And whenever you want to reconstruct your view db run:
```bash
npm run reconstruct-view-db mongodb://localhost:27017/eventstore
```



## Example
You can find a full example [here](https://github.com/ArkerLabs/event-sourcing-nestjs-example).

## TODOs
* Use snapshot, so we can reconstruct the DB faster.