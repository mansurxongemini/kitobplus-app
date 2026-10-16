# БД KitobPlus — ЧЕРНОВИК схемы (реконструкция по коду)

> **Это ЧЕРНОВИК.** Схема восстановлена чтением всех `.php`/`.py` в `api/`, `srv/`,
> `scripts/`, `click/`, `drm/` (без `api/oauth/vendor/`). Настоящая схема лежит в
> `kitobplus/audit/schema/` — сверить обязательно. Удалённые БД `mybook` и `av3715`
> (замороженные интеграции) — вне скоупа, их таблицы сюда не входят.

Файлы: `db/init/010-schema.sql` (36 таблиц + 8 вью, MariaDB 10.5, `mysql < file`
загружается без ошибок), `db/init/020-dev-seed.sql` (фейковые данные для dev).

## Таблицы

| Таблица | Назначение | Ключевые колонки | Используют файлы | Увер. |
|---|---|---|---|---|
| users | пользователи + читатели (disability) | phone, email, state, levels_id, plans_id/plan_end, disability, notification, readers_club, decode_key, deleted | api/connect2db.php, api/auth/*, srv/users.php, srv/update_user.php | high |
| tokens2 | сессии (token = 19 цифр, BIGINT UNSIGNED PK) | token, users_id, platform, model, dt, fcm | api/connect2db.php, api/auth/* | high |
| signins | привязки OAuth (google/apple) | provider, provider_id, users_id | api/connect2db.php:416 | high |
| sms | коды подтверждения, ip = INET_ATON | phone, code, sended, ip | api/auth/sms.php, verify.php | high |
| authors/dictors/genres/publishers | каталог: авторы/дикторы/жанры/издатели | name (+annotation; genres.url) | srv/update_book.php, srv/update_person.php, api/books/get.php | high* |
| books | аудиокниги | publishers_id, annotation, adult, dictors_id, is_readable_from, seconds, bytes, folder, imported | srv/update_book.php, scripts/import/*, srv/books.php | high |
| books2authors/dictors/genres | связи M2M с порядком | books_id, *_id, pos | srv/update_book.php, api/books/get.php | high |
| pics | картинки (PK target,id — под ON DUP KEY UPDATE) | target, id, ext, crop | api/news/add.php, srv/file_upload.php, srv/crop.php | high |
| users_files | документы читателей | name, ext, size | api/upload_file.php, srv/get_user.php | high |
| files | mp3-треки книги | books_id, pos, bytes, seconds, sha256 | scripts/import/import.php | high |
| imports | лок-таблица импорта | books_id PK | scripts/import/import.php | high |
| deleted_books | источник флага books_view.deleted | books_id PK, deleted | srv/delete_book.php | high |
| books_cache_dirty | триггер перестройки кэша | id, dt | srv/publish_book.php, scripts/catalog/* | high |
| books_cache | **таблица**-копия books_view (+PK id), читает публичный листинг | = колонки books_view | scripts/catalog/books_cache.php, srv/books.php | high |
| bookshelfs | полка пользователя (PK users_id,books_id) | users_id, books_id, dt | api/bookshelf/*, api/bookmark/* | high |
| bookshelfs_history | история add/remove (is_add) | users_id, books_id, dt, is_add | api/bookshelf/*, api/stat/list.php | high |
| playback_positions | последняя позиция (PK users_id,books_id) | rate, track, position, dt | api/playback_position.php | high |
| bookmarks | сохранённые позиции (PK users_id,books_id,track,position) | track, position, dt | api/bookmarks/* | high |
| likes / likes_history | лайки книг + лог | books_id, users_id, liked, dt | api/like.php | high |
| favorites / favorites_history | подписки на авторов/дикторов/жанры | users_id, target, id, favorite, dt | api/favorite.php, srv/push/sendit.php | high |
| comments | комментарии (id=0 → новая запись) | users_id, books_id, comment, dt | api/comments/* | high |
| news / news_views | новости + счётчик (ip = INET_ATON); видимость: deleted NULL и dt ≤ NOW() | subject, body, deleted / news_id, ip, users_id | api/news/* | high |
| invoices | счета Click (amount '100.00', months = срок) | users_id, amount, months, payed/cancelled/error/click_id | api/connect2db.php, api/access/pay.php | high |
| plans | уровни доступа (1 trial, 2 full, 3 paid) | name | api/connect2db.php | medium |
| premium_plans | тарифы; **amount = месяцы** (pay.php) | amount, price, enabled | api/access/pay.php, api/plans/* | high |
| notifications / notifications_detail | очередь пушей (process_start NULL = ждёт) + лог доставки | books_id, process_start/end / users_id, fcm, success… | srv/publish_book.php, srv/push/* | high |
| translation | строки UI (UNIQUE ru) | ru, uz, us | api/translation/* | high |

\* `genres.url` — одно использование (srv/index.php:228); `publishers.annotation` — по аналогии.

## Вью (8)

- **books_view** — книга + `publishers_name`, `authors_name`, `dictors_name` (M2M
  с фолбэком на `books.dictors_id`), `genres_name`, `duration`, `added`,
  `deleted` (из `deleted_books`), `downloads_count`, `bookshelfs_count`. Без GROUP BY
  (коррелированные подзапросы). Confidence: medium.
- **authors_view / dictors_view / genres_view / publishers_view** — база +
  `books_count` + `updated` (MAX is_readable_from связанных книг; `persons.php`
  требует `updated IS NOT NULL`). Confidence: medium.
- **users_view** — `users.*` + `listened_books_count`. Confidence: high.
- **bookshelfs_view / bookshelfs_history_view** — shelf + `users_name`, `books_name`.
  Confidence: high.

## Видимость книг (зашито в сид)

`date(books_cache.is_readable_from) <= date(now())` (srv/books.php:148),
`deleted IS NULL` + `is_readable_from <= NOW()` (srv/index.php states=2),
новости — `deleted IS NULL AND dt <= NOW()`. Сид ставит прошедшие даты,
`books_cache` залит через `INSERT ... SELECT FROM books_view`.
Логин: `sms → verify` сам создаёт юзера; для `998902004333` код возвращается
в ответе (суффикс 2004333), предзаполненный sms не нужен; тестовый юзер (state=2)
зашит для удобства.

## Неопределённости (сверить с `kitobplus/audit/schema/`)

1. `books.preview_id`, `books.url` — только из закомментированного определения вью (low).
2. `downloads_count` — в коде нет таблицы-источника; здесь = COUNT(playbacks) (low).
3. `updated`/`books_count` во вью персон — вывод, записей в коде нет (medium).
4. `states*`, `books2inbox`, `states_log`, `genres_link` — только на коннектах
   mybook/av3715 и в комментариях; в kitobplus-скоп не включены (medium).
5. `journal` — разрешён в srv/index.php:32, но ни одного запроса нет; вью не создано (low).
6. `dictors_name` вью: M2M-конкатенация vs `books.dictors_id` из старого определения (medium).
7. `plans` (имена/смыслы 1/2/3), `notification=100`, `users.notification` default (medium).
8. Типы `price/amount` (INT vs DECIMAL), длина `translation.ru` (UNIQUE 512), PK
   `favorites_history.history_id` (код его не читает) (low).
9. Реальный `mysql`-прогон упирается в песочницу (запрещены AF_UNIX-сокеты);
   автор проверил только питон-верификатором — жду ошибок вашего прогона.
