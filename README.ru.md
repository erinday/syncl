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

---

## Установка

```bash
npm i @erinday/syncl
```

---

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

---

## API

### Методы

| Метод                  | Описание                                                                 |
| ---------------------- |--------------------------------------------------------------------------|
| `getValue(key)`        | Получить значение по ключу                                               |
| `setValue(key, value)` | Установить значение (если изменилось - отправит событие)                 |
| `removeValue(key)`     | Удалить значение (отправит событие)                                      |
| `clean()`              | Очистить все данные в namespace (если были изменения - отправит событие) |
| `on(cb)`               | Подписка на изменения. Возвращает функцию отписки                        |
| `emit()`               | Ручной вызов события обновления                                          |

---

### Свойства

| Свойство          | Описание                                    |
| ----------------- | ------------------------------------------- |
| `eventUpdateName` | Имя события обновления (`namespace:update`) |

---

## Параметры

`SynclCreateParams`

| Параметр    | Тип       | По умолчанию   | Описание                                             |
| ----------- | --------- | -------------- | ---------------------------------------------------- |
| `version`   | `string`  | `'1'`          | При изменении очищает данные в namespace             |
| `namespace` | `string`  | `'__ls'`       | Пространство имён (используется в ключах и событиях) |
| `storage`   | `Storage` | `localStorage` | Хранилище (`localStorage` или `sessionStorage`)      |

---

## Философия

syncl намеренно **низкоуровневый**:

* Без парсинга JSON
* Без схем
* Без state-менеджмента

Он делает только две вещи:

→ синхронизирует storage
→ отправляет сигналы об изменениях

Всё остальное - на стороне пользователя

---

## Версионирование

```ts
new Syncl({ version: '2' })
```

Если версия отличается от сохранённой, все данные в namespace очищаются при инициализации

---

## Пример: JSON helper
Простой вспомогательный пример (можно улучшить с помощью generics)

```ts
type Keys = 'user' | 'theme'

function getJSON<T>(store: Syncl<Keys>, key: Keys): T | null {
  const value = store.getValue(key)
  return value ? JSON.parse(value) : null
}
```

## syncl НЕ является

* Не state manager
* Не слой хранения данных
* Не абстракция над данными

---

## Список изменений

Смотрите CHANGELOG в [английской](CHANGELOG.md) или [русской](CHANGELOG.ru.md) версии

---

## Лицензия

MIT
