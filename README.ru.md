## syncl

[![npm version](https://badge.fury.io/js/@erinday%2Fsyncl.svg)](https://www.npmjs.com/package/@erinday/syncl)
[![npm downloads](https://img.shields.io/npm/dm/@erinday/syncl.svg)](https://www.npmjs.com/package/@erinday/syncl)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Читать на других языках: [English](README.md)**

**Реактивная синхронизация localStorage между вкладками и компонентами без абстракций**

Минимальный event-driven слой поверх browser storage

---

## Возможности

* Синхронизация между вкладками через нативный `storage`
* Реактивность внутри вкладки (custom events)
* Поддержка `localStorage` и `sessionStorage`
* Изоляция через namespace
* Инвалидация по версии
* Без зависимостей


## Установка

```bash
npm i @erinday/syncl
```


## Использование

```ts
import { Syncl } from '@erinday/syncl'

type Keys = 'user' | 'theme'

const store = new Syncl<Keys>({
  namespace: '__app', // ⚠️ без нижнего подчёркивания в конце
  version: '1'
})

// записать значение
store.setValue('theme', 'dark')

// получить значение
const theme = store.getValue('theme')

// подписка на изменения
const off = store.on(() => {
  console.log('storage changed')
})

// отписка
off()
```


## API

### Методы

| Метод                  | Описание                                                    |
| ---------------------- | ----------------------------------------------------------- |
| `getValue(key)`        | Получить значение по ключу                                  |
| `setValue(key, value)` | Установить значение (отправляет событие при изменении)      |
| `removeValue(key)`     | Удалить значение (отправляет событие)                       |
| `clean()`              | Очистить все данные в namespace (отправляет событие с `null`) |
| `on(cb)`               | Подписаться на изменения. Возвращает функцию отписки        |
| `emit(event)`          | Вручную вызвать событие обновления с payload                |
| `isSynclKey(key)`      | Проверить, принадлежит ли ключ этому экземпляру Syncl       |
| `toPublicKey(key)`     | Преобразовать внутренний ключ с префиксом в публичный типизированный ключ |

### Свойства

| Свойство          | Описание                                    |
| ----------------- | ------------------------------------------- |
| `eventUpdateName` | Имя события обновления (`namespace:update`) |
| `prefix`          | Префикс ключей хранилища, используемый экземпляром (например, `'__app_'`) |


## Параметры

`SynclCreateParams`

| Параметр    | Тип       | По умолчанию   | Описание                                             |
| ----------- | --------- | -------------- | ---------------------------------------------------- |
| `version`   | `string`  | `'1'`          | При изменении очищает данные в namespace             |
| `namespace` | `string`  | `'__ls'`       | Пространство имён (используется в ключах и событиях) |
| `storage`   | `Storage` | `localStorage` | Хранилище (`localStorage` или `sessionStorage`)      |


## События

Syncl использует **два источника событий**

### storage (между вкладками)

```ts
window.addEventListener('storage', (event) => {
  if (event.key === null) return  // обработать очистку
  if (store.isSynclKey(event.key)) {
    const key = store.toPublicKey(event.key)
    console.log('Ключ изменился в другой вкладке:', key)
  }
})
```

### Кастомное событие (в текущей вкладке)

```ts
window.addEventListener(store.eventUpdateName, () => {
  console.log('Обновление в текущей вкладке')
})
```

### Универсальная подписка

```ts
store.on(({ key }) => {
  if (key === null) {
    console.log('Storage был очищен')
  } else {
    console.log(`Ключ "${key}" изменился`)
  }
})
```


## Вспомогательные методы для нативного storage

```ts
// Проверить, принадлежит ли ключ Syncl
if (store.isSynclKey(fullKey)) {
  console.log('Принадлежит Syncl')
}

// Преобразовать внутренний ключ в публичный типизированный
const publicKey = store.toPublicKey(fullKey)  // возвращает K
```


## Версионирование

```ts
new Syncl({ version: '2' })
```

Если версия отличается от сохранённой, все данные в namespace очищаются при инициализации


## Пример: JSON helper
Простой вспомогательный пример (можно улучшить с помощью generics)

```ts
type Keys = 'user' | 'theme'

function getJSON<T>(store: Syncl<Keys>, key: Keys): T | null {
  const value = store.getValue(key)
  return value ? JSON.parse(value) : null
}
```


## Философия

syncl намеренно **низкоуровневый**:

* Без парсинга JSON
* Без схем
* Без state-менеджмента

Он делает только две вещи:

→ синхронизирует storage
→ отправляет сигналы об изменениях

Всё остальное - на стороне пользователя


## syncl НЕ является

* Не state manager
* Не слой хранения данных
* Не абстракция над данными


## Список изменений

Смотрите CHANGELOG в [английской](CHANGELOG.md) или [русской](CHANGELOG.ru.md) версии


## Лицензия

MIT
