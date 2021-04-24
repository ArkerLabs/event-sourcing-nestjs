export interface EventStoreConfig {
  host?: string;
  port?: number;
  timeout?: number;
  emitStoreEvents?: boolean;
  maxSnapshotsCount?: number;
}

export interface EventStoreConfigMongoDb extends EventStoreConfig {
  type: 'mongodb';
  url?: string;
  dbName?: string;
  username?: string;
  password?: string;
  authSource?: string;
  eventsCollectionName?: string;
  snapshotsCollectionName?: string;
  transactionsCollectionName?: string;
  positionsCollectionName?: string;
}

export interface EventStoreConfigRedis extends EventStoreConfig {
  type: 'redis';
  db?: number;
  prefix?: string;
  password?: string;
  eventsCollectionName?: string;
  snapshotsCollectionName?: string;
}

export interface EventStoreConfigTingoDb extends EventStoreConfig {
  type: 'tingodb';
  dbPath?: string;
  eventsCollectionName?: 'events'; // optional
  snapshotsCollectionName?: 'snapshots'; // optional
  transactionsCollectionName?: 'transactions'; // optional
}

export interface EventStoreConfigElasticSearch extends EventStoreConfig {
  type: 'elasticsearch';
  indexName?: string;
  eventsTypeName?: string;
  snapshotsTypeName?: string;
  log?: string;
}

export interface EventStoreConfigAzureTable extends EventStoreConfig {
  type: 'azuretable';
  storageAccount?: string;
  storageAccessKey?: string;
  storageTableHost?: string;
  eventsTableName?: string;
  snapshotsTableName?: string;
}

export interface EventStoreConfigDynamoDb extends EventStoreConfig {
  type: 'dynamodb';
  eventsTableName?: string;
  snapshotsTableName?: string;
  undispatchedEventsTableName?: string;
  EventsReadCapacityUnits?: number;
  EventsWriteCapacityUnits?: number;
  SnapshotReadCapacityUnits?: number;
  SnapshotWriteCapacityUnits?: number;
  UndispatchedEventsReadCapacityUnits?: number;
  useUndispatchedEventsTable?: boolean;
  eventsTableStreamEnabled?: boolean;
  eventsTableStreamViewType?: string;
  emitStoreEvents?: boolean;
}
