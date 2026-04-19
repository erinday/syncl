import { SynclCreateParams, SynclSettings } from './types/'
export * from './types/'

export class Syncl<K extends string> {
  #s: SynclSettings = {
    version: '1',
    namespace: '__ls_',
    versionKey: '_version',
    storage: localStorage,
    eventName: '__ls_update'
  }

  constructor (params: SynclCreateParams = {}) {
    if (params.version) this.#s.version = params.version
    if (params.storage) this.#s.storage = params.storage
    if (params.namespace) {
      this.#s.namespace = params.namespace
      this.#s.eventName = `${params.namespace}update`
    }

    const v: string | null = this.#s.storage.getItem(this.#getKey(this.#s.versionKey))
    if (v !== this.#s.version) this.clean()
  }

  #getKey (name: string): string {
    return `${this.#s.namespace}${name}`
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
    let i: number = 0
    let key: string | null = storage.key(i)
    while (key) {
      if (key.startsWith(this.#s.namespace)) storage.removeItem(key)
      else ++i
      key = storage.key(i)
    }
    storage.setItem(this.#getKey(this.#s.versionKey), this.#s.version)
  }

  emit (): void {
    window.dispatchEvent(new CustomEvent(this.#s.eventName))
  }

  on (cb: () => void): () => void {
    const namespace : string = this.#s.namespace

    function handlerNative (event: StorageEvent): void {
      const key: string | null = event.key
      if (key === null || key.startsWith(namespace)) cb()
    }

    function handlerCustom (): void {
      cb()
    }

    window.addEventListener('storage', handlerNative)
    window.addEventListener(this.#s.eventName, handlerCustom)

    return () => {
      window.removeEventListener('storage', handlerNative)
      window.removeEventListener(this.#s.eventName, handlerCustom)
    }
  }
}
