import { SynclCreateParams, SynclEventUpdate, SynclSettings } from './types/'
export * from './types/'

const mockStorage: Storage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  key: () => null,
  length: 0
}

export class Syncl<K extends string> {
  #isBrowser: boolean = typeof window !== 'undefined'
  #s: SynclSettings = {
    version: '1',
    namespace: '__ls',
    prefix: '__ls_',
    versionKey: '_version',
    storage: this.#isBrowser ? localStorage : mockStorage
  }

  constructor (params: SynclCreateParams = {}) {
    if (params.version) this.#s.version = params.version
    if (params.storage) this.#s.storage = params.storage
    if (params.namespace) {
      this.#s.namespace = params.namespace
      this.#s.prefix = `${this.#s.namespace}_`
    }
    if (!this.#isBrowser) return
    const v: string | null = this.#s.storage.getItem(this.#getKey(this.#s.versionKey))
    if (v !== this.#s.version) this.clean()
  }

  #getKey (name: string): string {
    return `${this.#s.prefix}${name}`
  }

  get prefix (): string {
    return this.#s.prefix
  }

  get eventUpdateName (): string {
    return `${this.#s.namespace}:update`
  }

  getValue (name: K): string | null {
    const key: string = this.#getKey(name)
    return this.#s.storage.getItem(key)
  }

  setValue (name: K, value: string): void {
    const key: string = this.#getKey(name)
    const prevValue: string | null = this.#s.storage.getItem(key)
    if (prevValue === value) return
    this.#s.storage.setItem(key, value)
    this.emit({ key: name })
  }

  removeValue (name: K): void {
    const key: string = this.#getKey(name)
    const isExisted: boolean = this.#s.storage.getItem(key) !== null
    if (!isExisted) return
    this.#s.storage.removeItem(key)
    this.emit({ key: name })
  }

  clean (): void {
    const storage: Storage = this.#s.storage
    const versionKey: string = this.#getKey(this.#s.versionKey)
    let changed: boolean = false
    let i: number = 0
    let key: string | null = storage.key(i)
    while (key) {
      if (this.isSynclKey(key) && key !== versionKey) {
        storage.removeItem(key)
        changed = true
      }
      else ++i
      key = storage.key(i)
    }
    const v = storage.getItem(versionKey)
    if (v !== this.#s.version) {
      storage.setItem(versionKey, this.#s.version)
      changed = true
    }
    if (changed) this.emit({ key: null })
  }

  isSynclKey (key: string): boolean {
    return key.startsWith(this.#s.prefix)
  }

  toPublicKey (key: string): K {
    return key.slice(this.#s.prefix.length) as K
  }

  emit (event: SynclEventUpdate<K>): void {
    if (!this.#isBrowser) return
    window.dispatchEvent(new CustomEvent<SynclEventUpdate<K>>(this.eventUpdateName, { detail: event }))
  }

  on (cb: (event: SynclEventUpdate<K>) => void): () => void {
    if (!this.#isBrowser) return () => {}

    const handlerNative = (event: StorageEvent): void => {
      const key: string | null = event.key
      if (key === null) cb({ key: null })
      else if (this.isSynclKey(key)) cb({ key: this.toPublicKey(key) })
    }

    const handlerCustom = (event: Event): void => {
      if (!(event instanceof CustomEvent)) return
      const detail = event.detail as SynclEventUpdate<K> | undefined
      if (detail) cb({ key: detail.key })
    }

    window.addEventListener('storage', handlerNative)
    window.addEventListener(this.eventUpdateName, handlerCustom)

    return () => {
      window.removeEventListener('storage', handlerNative)
      window.removeEventListener(this.eventUpdateName, handlerCustom)
    }
  }
}
