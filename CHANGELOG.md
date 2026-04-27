# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.1.0] - 2026-04-27

### Added

- `isSynclKey(key: string | null): boolean`
  - Checks whether a storage key belongs to the current Syncl instance
  - Returns `true` if the key starts with the instance prefix
  - Useful for filtering native `storage` events

### Improved

- Exposed `prefix` as a public getter
  - Allows manual key filtering and debugging
  - Makes integration with native `storage` events easier

---

### Example

```ts
const store = new Syncl({ namespace: '__app' })

window.addEventListener('storage', (event) => {
  if (store.isSynclKey(event.key)) {
    console.log('Syncl key changed:', event.key)
  }
})

// raw access if needed
window.addEventListener('storage', (event) => {
  console.log(event.key, event.newValue)
})

// same-tab updates
window.addEventListener(store.eventUpdateName, () => {
  console.log('Updated in current tab')
})
```

---

## [2.0.0] - 2026-04-22

### ⚠️ Breaking Changes

- **Event name format changed**: from `{namespace}_update` to `{namespace}:update`
  - Old: `__ls_update` (with default namespace `__ls_`)
  - New: `__ls:update` (with default namespace `__ls`)

### Added

- New `eventUpdateName` getter property to get the name of the event that fires on storage changes (in the current tab)
- SSR (Server-Side Rendering) support - library now safely checks for `window` existence
- `prefix` field for internal key management (separated from logical `namespace`)

### Changed

- **Default namespace changed**: from `'__ls_'` to `'__ls'` (without trailing underscore)
- Improved `clean()` method:
  - Now preserves the version key during cleanup
  - Only emits update event if something actually changed
- Better isolation between logical namespace (for events) and storage prefix (for keys)

### Migration Guide

#### Before (v1.x)
```ts
const store = new Syncl({
  namespace: '__app_'  // with trailing underscore
})

// Event name: '__app_update'
// Key names: '__app_KEY'
```

#### After (v2.x)
```ts
const store = new Syncl({
  namespace: '__app'  // without trailing underscore
})

// Event name: '__app:update'
// Key names: '__app_KEY'  // unchanged
console.log(store.eventUpdateName) // '__app:update'
```

---

## [1.0.1] - 2026-04-19

### Added

- Initial public release
- Cross-tab synchronization via native `storage` event
- Same-tab reactivity via custom events
- Support for both `localStorage` and `sessionStorage`
- Namespace isolation to prevent key collisions
- Version-based storage invalidation
- Zero external dependencies
- TypeScript support with generic key types

### Methods

- `getValue(key)` - retrieve value by key
- `setValue(key, value)` - set value with automatic change detection
- `removeValue(key)` - remove value and trigger update event
- `clean()` - clear all namespaced data
- `on(cb)` - subscribe to storage changes
- `emit()` - manually trigger update event

### Options

- `version` - storage version string (default: '1')
- `namespace` - prefix for all keys (default: '__ls_')
- `storage` - storage instance (default: localStorage)
- `eventName` - custom event name for same-tab updates (default: '__ls_update')

---
