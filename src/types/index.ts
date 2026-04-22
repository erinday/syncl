export interface SynclSettings {
  version: string;
  namespace: string;
  prefix: string;
  versionKey: string;
  storage: Storage;
}

export type SynclCreateParams = Partial<Pick<SynclSettings, 'version' | 'namespace' | 'storage'>>
