import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { EventSourcingModule } from '../eventsourcing.module';

export class Script {
    static async run(script: (app: INestApplication) => void) {
        const app = await NestFactory.create(EventSourcingModule.forRoot({ mongoURL: process.argv[2] }));
        await script(app);
        process.exit();
    }
}
