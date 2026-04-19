export interface SynclSettings {
  version: string;
  namespace: string;
  versionKey: string;
  storage: Storage;
  eventName: string;
}

export type SynclCreateParams = Partial<Pick<SynclSettings, 'version' | 'namespace' | 'storage'>>
