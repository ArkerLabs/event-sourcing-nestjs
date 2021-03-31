✨ Event Sourcing for Nestjs
=====

[![](https://badgen.net/npm/v/event-sourcing-nestjs)](https://www.npmjs.com/package/event-sourcing-nestjs) ![](https://badgen.net/npm/dt/event-sourcing-nestjs) 

Library that implements event sourcing using NestJS and his CQRS library.

## ⭐️ Features
* **StoreEventBus**: A class that replaces Nest's EventBus to also persists events in mongodb.
* **StoreEventPublisher**: A class that replaces Nest's EventPublisher.
* **ViewUpdaterHandler**: The EventBus will also delegate the Events to his View Updaters, so you can update your read database.
* **Replay**: You can re-run stored events. This will only trigger the view updater handlers to reconstruct your read db.
* **EventStore**: Get history of events for an aggregate.


## 📖 Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Importing](#importing)
  - [Events](#events)
  - [Event emitter](#event-emitter)
  - [Event Publisher](#event-publisher)
  - [Get event history](#get-event-history)
    - [Full example](#full-example)
  - [View updaters](#view-updaters)
    - [State of the art](#state-of-the-art)
- [Reconstructing the view db](#reconstructing-the-view-db)
- [Examples](#examples)

## 🛠 Installation
```bash
npm install event-sourcing-nestjs @nestjs/cqrs --save
```

## Usage

### Importing

app.module.ts
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

Importing it in your modules
```ts
import { Module } from '@nestjs/common';
import { EventSourcingModule } from 'event-sourcing-nestjs';

@Module({
  imports: [
    EventSourcingModule.forFeature(),
  ],
})
export class UserModule {}
```

### Events
Your events must extend the abstract class StorableEvent.

```ts
export class UserCreatedEvent extends StorableEvent {
    eventAggregate = 'user';
    eventVersion = 1;
    id = '_id_';
}
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

### Event Publisher
Use **StoreEventPublisher** if you want to dispatch events from your AggregateRoot and store it before calling their handlers.

```ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HeroRepository } from '../../repository/hero.repository';
import { KillDragonCommand } from '../impl/kill-dragon.command';
import { StoreEventPublisher } from 'event-sourcing-nestjs';

@CommandHandler(KillDragonCommand)
export class KillDragonHandler implements ICommandHandler<KillDragonCommand> {
  constructor(
    private readonly repository: HeroRepository,
    private readonly publisher: StoreEventPublisher,
  ) {}

  async execute(command: KillDragonCommand) {
    const { heroId, dragonId } = command;
    const hero = this.publisher.mergeObjectContext(
      await this.repository.findOneById(heroId),
    );
    hero.killEnemy(dragonId);
    hero.commit();
  }
}
```

### Get event history 

Reconstruct an aggregate getting his event history.

```ts
const aggregate = 'user';
const id = '_id_';
console.log(await this.eventStore.getEvents(aggregate, id));
```

#### Full example

hero-killed-dragon.event.ts
```ts
import { StorableEvent } from 'event-sourcing-nestjs';

export class HeroKilledDragonEvent extends StorableEvent {

  eventAggregate = 'hero';
  eventVersion = 1;
  
  constructor(
    public readonly id: string,
    public readonly dragonId: string,
  ) {
    super();
  }
}
```

hero.model.ts
```ts
import { AggregateRoot } from '@nestjs/cqrs';

export class Hero extends AggregateRoot {

  public readonly id: string;

  public dragonsKilled: string[] = [];

  constructor(id: string) {
    super();
    this.id = id;
  }

  killEnemy(enemyId: string) {
    this.apply(new HeroKilledDragonEvent(this.id, enemyId));
  }

  onHeroKilledDragonEvent(event: HeroKilledDragonEvent) {
    this.dragonsKilled.push(event.dragonId);
  }

}
```

hero.repository.ts
```ts
import { Injectable } from '@nestjs/common';
import { Hero } from '../models/hero.model';
import { EventStore } from 'event-sourcing-nestjs';

@Injectable()
export class HeroRepository {

  constructor(
    private readonly eventStore: EventStore,
  ) {}

  async findOneById(id: string): Promise<Hero> {
    const hero = new Hero(id);
    hero.loadFromHistory(await this.eventStore.getEvents('hero', id));
    return hero;
  }
}
```


### View updaters


#### State of the art
![State of the art](https://raw.githubusercontent.com/ArkerLabs/event-sourcing-nestjs/master/docs/state.jpg)


After emitting an event, use a view updater to update the read database state.
This view updaters will be used to recontruct the db if needed.

Read more info about the Materialized View pattern [here](https://docs.microsoft.com/en-gb/azure/architecture/patterns/materialized-view)

```ts
import { IViewUpdater, ViewUpdaterHandler } from 'event-sourcing-nestjs';

@ViewUpdaterHandler(UserCreatedEvent)
export class UserCreatedUpdater implements IViewUpdater<UserCreatedEvent> {

    async handle(event: UserCreatedEvent) {
        // Save user into our view db
    }
}
```

## Reconstructing the view db

```ts
await ReconstructViewDb.run(await NestFactory.create(AppModule.forRoot()));
```



## Examples
You can find a working example using the Materialized View pattern [here](https://github.com/ArkerLabs/event-sourcing-nestjs-example).

Also a working example with Nest aggregates working [here](https://github.com/Nytyr/nest-cqrs-eventsourcing-example).

## TODOs
* Use snapshots, so we can reconstruct the aggregates faster.


## 📝 Stay in touch

- Author - [Nytyr](https://keybase.io/nytyr)
- Website - [https://arkerlabs.com/](https://arkerlabs.com/)
