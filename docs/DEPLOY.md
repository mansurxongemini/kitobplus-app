# Выкладка сайта в продакшен

Порядок для сервера `kitobplus.uz` (Apache 2.4, Debian; корень сайта — `/var/www/html`).
Секретов в этом документе нет: значения подставляются при выкладке (см. `docs/SECRETS.md`).

## 1. Проверки перед сборкой

```bash
cd web
npm ci --no-audit --no-fund
npx eslint --ext .js,.jsx,.ts src           # 0 ошибок
CI=true npx react-scripts test --watchAll=false
CI=false npm run build
```

Пройти ручной чек-лист `docs/QA_CHECKLIST.md` на собранной версии (экранные читалки, клавиатура, темы, телефон).

## 2. Сборка

`web/.env.production` и `admin/.env.production` в репозитории:

- `GENERATE_SOURCEMAP=false` — `.map` не попадают в сборку. Исходники сайта когда-то были восстановлены именно из них.
- `INLINE_RUNTIME_CHUNK=false` — в `index.html` нет inline-скриптов, это нужно для будущего CSP.
- `REACT_APP_SITE_URL` не задаётся: без него используется `https://kitobplus.uz`.

Перед копированием проверить, что в `web/build` нет `.map`:

```bash
find web/build -name '*.map' | wc -l          # должно быть 0
```

## 3. Apache

Модули: `rewrite`, `ssl`, `headers`, `xsendfile` (`a2enmod headers` — если ещё не включён).

`deploy/000-default-le-ssl.conf` задаёт:

- заголовки безопасности: HSTS (180 дней, без `includeSubDomains`/`preload`), `X-Content-Type-Options`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`, `Permissions-Policy`;
- кэш: `/static/` и `/admin/static/` — год, `immutable`; `index.html`, `manifest.json` — `no-cache`;
- запрет отдачи `.map`, `.sql`, `.log`, `.md`, `.yml`, `.env*`, `composer.*`, `package*.json` и служебных каталогов (`.git`, `docker`, `db`, `docs`, `deploy`, `scripts`).

Дополнительно, в глобальном конфиге `/etc/apache2/conf-available/security.conf`:

```apache
ServerTokens Prod
ServerSignature Off
```

После правки: `apache2ctl -t && systemctl reload apache2`.

**Уточнить:** в `deploy/000-default.conf` (порт 80) редирект на HTTPS закомментирован.
Перед включением выяснить, не ходит ли мобильное приложение на API по `http://`.

## 4. Проверка после выкладки

```bash
curl -sI https://kitobplus.uz/ | grep -iE 'strict-transport|x-content-type|x-frame|referrer-policy|permissions-policy'
curl -s -o /dev/null -w '%{http_code}\n' https://kitobplus.uz/README.md      # 403
curl -sI https://kitobplus.uz/static/js/ | head -1                             # не листинг
curl -sI https://kitobplus.uz/index.html | grep -i cache-control              # no-cache
```

Открыть сайт в браузере и проверить: главная, каталог, книга (фрагмент играет), вход по SMS, профиль, переключение языка и темы.

## 5. CSP (следующий шаг, пока не включён)

Сначала включить на стенде в режиме `Content-Security-Policy-Report-Only` и собрать нарушения из консоли браузера.
Черновик для публичного сайта (админка и API — отдельно):

```
default-src 'self';
script-src 'self' https://accounts.google.com https://appleid.cdn-apple.com;
style-src 'self' 'unsafe-inline' https://accounts.google.com;
img-src 'self' data: blob: https:;
media-src 'self' blob:;
connect-src 'self' https://accounts.google.com;
frame-src https://accounts.google.com https://appleid.apple.com;
font-src 'self' data:;
object-src 'none'; base-uri 'self'; frame-ancestors 'self'
```

`style-src 'unsafe-inline'` нужен MUI/emotion (стили вставляются в `<style>`). DRM-скрипты (`/js/drm/*`) и
плеер (MSE, `blob:`) проверить отдельно. **Уточнить** домены оплаты Click (сейчас это переход на `my.click.uz`, для CSP не нужен).

## 6. Открытые задачи по серверу

Из аудита (`AUDIT_NOTES.md`, вне репозитория): удалить тестовые скрипты с сервера, закрыть прямой доступ к mp3
(после перевода плеера на DRM), решить вопрос с общими логинами админки.
