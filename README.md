# syncl

**Reactive storage sync. No magic**

A minimal event-driven synchronization layer for browser storage

---

## Features

* Cross-tab sync (native `storage` event)
* Same-tab sync (custom events)
* Works with `localStorage` and `sessionStorage`
* Namespace isolation
* Version-based invalidation
* Zero dependencies

---

## Installation

```bash
npm i @erinday/syncl
```

---

## Usage

```ts
import { Syncl } from 'syncl'

type Keys = 'user' | 'theme'

const store = new Syncl<Keys>({
  namespace: '__app_',
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

---

## Options

`SynclCreateParams`

| Option      | Type      | Default        | Description                                                      |
| ----------- | --------- | -------------- |------------------------------------------------------------------|
| `version`   | `string`  | `'1'`          | Storage version. If changed, all namespaced data will be cleared |
| `namespace` | `string`  | `'__ls_'`      | Prefix for all keys to isolate your data in storage              |
| `storage`   | `Storage` | `localStorage` | Storage instance (`localStorage` or `sessionStorage`)            |

---

## Philosophy

syncl is intentionally **low-level**:

* No JSON parsing
* No schema
* No state management

It only:

synchronizes storage → emits change signals

Everything else is up to you

---

## Versioning

Changing version clears all namespaced storage:

```ts
new Syncl({ version: '2' })
```

---

## Example: JSON helper

```ts
function getJSON<T>(store: Syncl<any>, key: string): T | null {
  const value = store.getValue(key)
  return value ? JSON.parse(value) : null
}
```

---

## What syncl is NOT

* Not a state manager
* Not a persistence layer
* Not a data abstraction

---

## License

MIT

---

# 🇷🇺 Русская версия

## syncl

**Реактивная синхронизация storage. Без магии**

Минимальный event-driven слой для синхронизации browser storage

---

## Возможности

* Синхронизация между вкладками (`storage` event)
* Синхронизация внутри вкладки (custom events)
* Поддержка `localStorage` и `sessionStorage`
* Изоляция через namespace
* Инвалидация по версии
* Без зависимостей

---

## Установка

```bash
npm i @erinday/syncl
```

---

## Использование

```ts
import { Syncl } from 'syncl'

type Keys = 'user' | 'theme'

const store = new Syncl<Keys>({
  namespace: '__app_',
  version: '1'
})

// записать значение
store.setValue('theme', 'dark')

// получить значение
const theme = store.getValue('theme')

// подписка на изменения
const off = store.on(() => {
  console.log('storage изменился')
})

// отписка
off()
```

---

## Параметры

`SynclCreateParams`

| Параметр    | Тип       | По умолчанию   | Описание                                                         |
| ----------- | --------- | -------------- |------------------------------------------------------------------|
| `version`   | `string`  | `'1'`          | Версия хранилища. При изменении очищаются все данные в namespace |
| `namespace` | `string`  | `'__ls_'`      | Префикс для ключей, изолирует данные внутри storage              |
| `storage`   | `Storage` | `localStorage` | Используемое хранилище (`localStorage` или `sessionStorage`)     |

---

## Философия

syncl намеренно **низкоуровневый**:

* Без JSON
* Без схем
* Без state-менеджмента

Он только:

синхронизирует storage → отправляет сигнал об изменениях

Всё остальное на стороне пользователя

---

## Версионирование

При изменении версии storage очищается:

```ts
new Syncl({ version: '2' })
```

---

## syncl НЕ является

* Не state manager
* Не слой хранения данных
* Не абстракция над данными

---

## Лицензия

MIT
