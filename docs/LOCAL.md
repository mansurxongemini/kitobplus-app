# Локальный запуск

Нужны Docker (или Podman с `docker compose`) и Node.js 20+ (проверено на 24).

## Backend и база

```
cp .env.example .env        # при необходимости поменять порты
mkdir -p .local/pics .local/restricted .local/books .local/storage
docker compose up -d --build
```

- Backend (Apache 2.4 + PHP 7.4, как на сервере): http://localhost:8080
- MariaDB 10.5: `127.0.0.1:3307`, база и пользователь `kitobplus`.
- При первом запуске база создаётся из `db/init/*.sql`: схема, восстановленная по коду (черновик, см. [DB_DRAFT.md](DB_DRAFT.md)), и тестовые данные. Пересоздать базу: `docker compose down -v && docker compose up -d`.
- Секреты в коде заменены обозначениями `__KP_*__` (см. [SECRETS.md](SECRETS.md)). Локально обозначение служит значением, поэтому код запускается без правок: пароль базы `__KP_DB_PASSWORD__`, токен админки `__KP_ADMIN_TOKEN__`.
- Аудио, обложки и файлы пользователей лежат в `.local/` (в git не попадают).

## Сайт и админка

```
cd web && npm install && npm start          # http://localhost:3000
cd admin && npm install --legacy-peer-deps && npm start   # http://localhost:3001
```

Адрес backend задаётся `REACT_APP_SITE_URL` в `.env.development` (по умолчанию production). Подробности сборки: [FRONTEND_BUILD.md](FRONTEND_BUILD.md).

## Вход

- Сайт: телефон `+998 90 200 43 33`. SMS не отправляется, код возвращается в ответе API (`/api/auth/sms.php`). На production это уязвимость (номера с окончанием `2004333`), см. отчёт аудита.
- Админка: логин `__KP_ADMIN_LOGIN_1__`, пароль `__KP_ADMIN_PASSWORD_1__`.

## Что работает не так, как на сервере

- Вход через Google/Apple, SMS-шлюз, push, Click: нужны настоящие ключи, локально не работают.
- Схема базы восстановлена по коду, а не снята с сервера. Перед изменениями базы сверить с `kitobplus/audit/schema/`.
- Стили сайта взяты из текущей сборки на сервере (`web/src/index.css`, `web/src/live-assets/`), часть мелких иконок остаётся заглушками.
- На сервере корень сайта отдаёт сборку React; локально сайт работает на dev-сервере, а на :8080 стоит заглушка.
