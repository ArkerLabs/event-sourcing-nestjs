import {
  EventStoreConfigAzureTable,
  EventStoreConfigDynamoDb,
  EventStoreConfigElasticSearch,
  EventStoreConfigMongoDb,
  EventStoreConfigRedis,
  EventStoreConfigTingoDb,
} from './eventstore.options';

export interface EventSourcingOptions {
  eventstore?:
    | EventStoreConfigMongoDb
    | EventStoreConfigRedis
    | EventStoreConfigTingoDb
    | EventStoreConfigElasticSearch
    | EventStoreConfigAzureTable
    | EventStoreConfigDynamoDb;
}

