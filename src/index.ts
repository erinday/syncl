import { SynclCreateParams, SynclSettings } from './types/'
export * from './types/'

export class Syncl<K extends string> {
  #s: SynclSettings = {
    version: '1',
    namespace: '__ls',
    prefix: '__ls_',
    versionKey: '_version',
    storage: localStorage,
  }

  constructor (params: SynclCreateParams = {}) {
    if (params.version) this.#s.version = params.version
    if (params.storage) this.#s.storage = params.storage
    if (params.namespace) {
      this.#s.namespace = params.namespace
      this.#s.prefix = `${this.#s.namespace}_`
    }

    const v: string | null = this.#s.storage.getItem(this.#getKey(this.#s.versionKey))
    if (v !== this.#s.version) this.clean()
  }

  #getKey (name: string): string {
    return `${this.#s.prefix}${name}`
  }

  get eventUpdateName (): string {
    return `${this.#s.namespace}:update`
  }

  getValue (name: K): string | null {
    return this.#s.storage.getItem(this.#getKey(name))
  }

  setValue (name: K, value: string): void {
    const prevValue: string | null = this.getValue(name)
    if (prevValue === value) return
    this.#s.storage.setItem(this.#getKey(name), value)
    this.emit()
  }

  removeValue (name: K): void {
    const key: string = this.#getKey(name)
    const isExisted: boolean = this.#s.storage.getItem(key) !== null
    if (!isExisted) return
    this.#s.storage.removeItem(key)
    this.emit()
  }

  clean (): void {
    const storage: Storage = this.#s.storage
    const versionKey: string = this.#getKey(this.#s.versionKey)
    let changed: boolean = false
    let i: number = 0
    let key: string | null = storage.key(i)
    while (key) {
      if (key.startsWith(this.#s.prefix) && key !== versionKey) {
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
    if (changed) this.emit()
  }

  emit (): void {
    if (typeof window === 'undefined') return
    window.dispatchEvent(new CustomEvent(this.eventUpdateName))
  }

  on (cb: () => void): () => void {
    if (typeof window === 'undefined') return () => {}
    const prefix: string = this.#s.prefix

    function handlerNative (event: StorageEvent): void {
      const key: string | null = event.key
      if (key === null || key.startsWith(prefix)) cb()
    }

    function handlerCustom (): void {
      cb()
    }

    window.addEventListener('storage', handlerNative)
    window.addEventListener(this.eventUpdateName, handlerCustom)

    return () => {
      window.removeEventListener('storage', handlerNative)
      window.removeEventListener(this.eventUpdateName, handlerCustom)
    }
  }
}
