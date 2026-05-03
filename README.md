# syncl

[![npm version](https://badge.fury.io/js/@erinday%2Fsyncl.svg)](https://www.npmjs.com/package/@erinday/syncl)
[![npm downloads](https://img.shields.io/npm/dm/@erinday/syncl.svg)](https://www.npmjs.com/package/@erinday/syncl)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Read this in other languages: [Русский](README.ru.md)**

**Reactive sync for localStorage across tabs and components - with zero abstractions**

A tiny event-driven layer on top of browser storage

---

## Features

* Cross-tab sync via native `storage`
* Same-tab reactivity via custom events
* Works with `localStorage` and `sessionStorage`
* Namespace isolation (no key collisions)
* Version-based invalidation
* Zero dependencies


## Installation

```bash
npm i @erinday/syncl
```


## Usage

```ts
import { Syncl } from '@erinday/syncl'

type Keys = 'user' | 'theme'

const store = new Syncl<Keys>({
  namespace: '__app', // ⚠️ no trailing underscore
  version: '1'
})

// set value
store.setValue('theme', 'dark')

// get value
const theme = store.getValue('theme')

// subscribe to changes
const off = store.on(() => {
  console.log('storage changed')
})

// unsubscribe
off()
```


## API

### Methods

| Method                 | Description                                         |
| ---------------------- | --------------------------------------------------- |
| `getValue(key)`        | Get value by key                                    |
| `setValue(key, value)` | Set value (emits update if changed)                 |
| `removeValue(key)`     | Remove value (emits update)                         |
| `clean()`              | Clear all namespaced data (emits update with `null`) |
| `on(cb)`               | Subscribe to changes. Returns unsubscribe function  |
| `emit(event)`          | Manually trigger update event with payload         |
| `isSynclKey(key)`      | Check if a key belongs to this Syncl instance      |
| `toPublicKey(key)`     | Convert internal prefixed key to public typed key  |

### Properties

| Property          | Description                                   |
| ----------------- | --------------------------------------------- |
| `eventUpdateName` | Name of the update event (`namespace:update`) |
| `prefix`          | Storage key prefix used by the instance (e.g., `'__app_'`) |


## Options

`SynclCreateParams`

| Option      | Type      | Default        | Description                                           |
| ----------- | --------- | -------------- | ----------------------------------------------------- |
| `version`   | `string`  | `'1'`          | Changing version clears all namespaced data           |
| `namespace` | `string`  | `'__ls'`       | Logical namespace (used for keys and events)          |
| `storage`   | `Storage` | `localStorage` | Storage instance (`localStorage` or `sessionStorage`) |


## Events

Syncl uses **two event sources**

### Native storage (cross-tab)

```ts
window.addEventListener('storage', (event) => {
  if (event.key === null) return  // handle cleanup
  if (store.isSynclKey(event.key)) {
    const key = store.toPublicKey(event.key)
    console.log('Key changed in another tab:', key)
  }
})
```

### Custom event (same-tab)

```ts
window.addEventListener(store.eventUpdateName, () => {
  console.log('Updated in current tab')
})
```

### Unified subscription

```ts
store.on(({ key }) => {
  if (key === null) {
    console.log('Storage was cleared')
  } else {
    console.log(`Key "${key}" changed`)
  }
})
```


## Helper methods for native storage

```ts
// Check if a key belongs to Syncl
if (store.isSynclKey(fullKey)) {
  console.log('Is Syncl key')
}

// Convert internal key to public typed key
const publicKey = store.toPublicKey(fullKey)  // returns K
```


## Versioning

```ts
new Syncl({ version: '2' })
```

If the version differs from the one stored, all namespaced data is cleared during initialization


## Example: JSON helper
Simple helper example (can be generalized with generics)

```ts
type Keys = 'user' | 'theme'

function getJSON<T>(store: Syncl<Keys>, key: Keys): T | null {
  const value = store.getValue(key)
  return value ? JSON.parse(value) : null
}
```

## Philosophy

syncl is intentionally **low-level**:

* No JSON parsing
* No schema
* No state management

It only does two things:

→ sync storage
→ emit change signals

Everything else is up to you


## What syncl is NOT

* Not a state manager
* Not a persistence layer
* Not a data abstraction


## Changelog

See CHANGELOG for [English](CHANGELOG.md) or [Russian](CHANGELOG.ru.md) version


## License

MIT
