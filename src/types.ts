export enum ENV {
  prod = 'prod',
  dev = 'dev',
  local = 'local',
  test = 'test',
}

export type PartialRecord<K extends string, V> = Partial<Record<K, V>>;

export type RequestMethod = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'UNKNOWN';
