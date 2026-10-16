# Сборка фронтендов (web, admin)

Исходники восстановлены из source map продакшен-сборок, поэтому
`package.json`, `public/` и конфигов сборки не было. Оба приложения —
Create React App, собираются через react-scripts 5. Проверено на
Node v24.19.0, npm 11.17.0.

## Установка и запуск

```bash
# web — публичный сайт, http://localhost:3000
cd web
npm_config_cache=/tmp/npm-cache npm install --no-audit --no-fund
CI=false npm run build
npm start

# admin — админка, http://localhost:3001
cd admin
npm_config_cache=/tmp/npm-cache npm install --no-audit --no-fund --legacy-peer-deps
CI=false npm run build
npm start
```

`npm start` обоих доводится до `Compiled` (с предупреждениями). Порты:
web — 3000 (стандарт CRA), admin — 3001 (задан в `admin/.env.development`).

## REACT_APP_SITE_URL

Оригин бэкенда вынесен в один модуль на приложение:
`web/src/lib/config.js` и `admin/src/lib/config.js`:

```js
export const SITE_URL = process.env.REACT_APP_SITE_URL || 'https://kitobplus.uz';
```

web использует его через `getHost()`, admin — через `getSettings().backend`
и напрямую в местах, где оригин был захардкожен. Без переменной поведение
продакшеновое. `.env.development` задаёт `REACT_APP_SITE_URL=http://localhost:8080`.
Не тронуты: внешние ссылки для пользователей (App Store, Google Play,
`t.me/kitobplus_uz`, `my.click.uz`) и адреса e-mail.

## Версии зависимостей

web (React 18 + MUI v5 + react-router v6 — по факту использования API:
`Routes`/`element`, `useNavigate`, `createRoot`): react 18.3.1,
react-router-dom 6.30.0, @mui/material и @mui/icons-material 5.16.7
(+ @emotion/react 11.13.3, @emotion/styled 11.13.0 — пиры MUI v5),
@mui/x-date-pickers 6.20.0 (нужен v6: код использует `DateField` и путь
`AdapterDayjs`), dayjs 1.11.13, jwt-decode 4.0.0 (код использует именованный
импорт `{ jwtDecode }` — это v4; v3 отдавал только default), @react-oauth/google
0.12.2, react-apple-login 1.1.6, react-phone-input-2 2.15.1,
react-phone-number-input 3.4.12, swr 2.2.5, react-device-detect 2.2.3,
use-debounce 10.0.0, @uidotdev/usehooks 2.4.1, web-vitals 2.1.4 (код
использует API v1/v2: `getCLS`/`getFID`/..., в v3+ его нет), typescript 4.9.5.
`web` ставится без `--legacy-peer-deps`.

admin (React 17 + Material-UI v4 + react-router v5 — по факту: `Switch`,
`component=`, `useHistory`, `ReactDOM.render`): react/react-dom 17.0.2,
react-router-dom 5.3.4, @material-ui/core 4.12.4, @material-ui/icons 4.11.3,
@material-ui/lab 4.0.0-alpha.61, @material-ui/pickers 3.3.10,
@date-io/date-fns 1.3.13 + date-fns 2.30.0, material-table 1.69.3,
react-media-player 0.7.9, @fortawesome/react-fontawesome 0.2.2 +
free-solid-svg-icons и fontawesome-svg-core 6.5.2, match-sorter 6.3.1
(именованный импорт `{ matchSorter }`), react-avatar-editor 13.0.2,
react-image-lightbox 5.1.4, html-react-parser 1.4.14 (см. ниже),
react-device-detect 2.2.3. Нужен `--legacy-peer-deps`: старые пиры
(react-html-parser хотел React 16 и т.п.) иначе блокируют установку.
В `dependencies` лежит `ajv: 8.20.0` — иначе `--legacy-peer-deps`
поднимает наверх ajv v6 и ломает сборку webpack (`ajv-keywords@5`
требует `ajv/dist/compile/codegen`). В `overrides`:
`material-table → @material-ui/pickers: 3.3.10`, т.к. вложенный
pickers 3.2.2 имеет битый esm-билд (реэкспорт типов `DatePickerProps`
из `./DatePicker`, которого нет в JS) и роняет сборку.

Закомментированные импорты (`mui-file-input`, `react-material-file-upload`,
`uploader`/`react-uploader` в `UserDialog.js`, `@mui/material` в
`StatSettings.js`) — не зависимости, пакеты не ставились.

## Правки исходников (минимум для компиляции)

Структура: все исходники переехали в `web/src/` и `admin/src/`
(так требует react-scripts), добавлен `public/index.html` в обоих.
web/public/index.html повторяет живой index.html (те же `<script>`:
два `/js/drm/mse-xstream*.js` и Apple ID; пути через `%PUBLIC_URL%`).

- `web/src/lib/api.js`, `web/src/lib/translator.js`: убраны TypeScript-аннотации
  (`: string`, `: object` и т.п.) — файлы `.js`, Babel их не парсит.
  Поведение не меняется. Плюс `getHost()` теперь возвращает `SITE_URL`.
- `web/src/lib/auth.ts`: `image1: object, image2: object` → `any`
  (иначе `FormData.append` не типизируется). `web/src/lib/playback_position.ts`:
  деструктуризация `: Object` → `: any`. Только типы, рантайм тот же.
- Удалены импорты несуществующих модулей (нигде не используются, часть уже
  была закомментирована): `web/.../Book.jsx` — `BookDetailsSection`,
  `ReviewSection`; `NewsSection.jsx` — `NewsModalDS`; `Navigation.jsx` —
  `UserMenu.jsx`; `admin/.../renderDetailPanel.js` — `changeState`,
  `InboxBookSelectDialog`, `linkToInbox`, `InboxBookUnlinkDialog`;
  `rowClick.js` — `changeState`; `import.js`, `person.js` — `personRowClick`,
  `renderPersonDetailPanel`; `login.js` — `redirect` (есть только в
  react-router v6); `StatSettings.js` — `SelectChangeEvent` (тип из MUI v5).
- Замена `react-html-parser@2.0.2` → `html-react-parser@1.4.14`
  (одна строка импорта в `renderDetailPanel.js`, вызов не менялся):
  старый тянет htmlparser2 v3, который требует Node-модули `buffer`/`stream`
  и несовместим с webpack 5 без eject; новый — поддерживаемый преемник
  с тем же поведением для этого места.
- `admin/.../BookDialog.js`: захардкоженный сэмпл
  `http://kitobplus.uz/books/00001/0001.mp3` (внутри JSX-комментария) → `SITE_URL`.
  В проде схема станет https вместо http — разница только в комментарии.

## Созданные заглушки (файлов не было в source map)

- Пустые CSS с пометкой: `web/src/index.css`, `web/src/css/*.css`,
  `web/src/fonts/*.css`, `admin/src/index.css`, `admin/src/App.css`,
  `admin/src/css/*.css`.
- Плейсхолдеры PNG 1×1 (26 шт. в `web/src/**/img/`), `favicon.ico`/`logo192.png`
  и `manifest.json` в обоих `public/`.
- `web/src/lib/translation.json` (`{}` — переводы грузятся с бэкенда,
  `T()` без словаря возвращает исходную строку).
- `web/src/books/TagsSelector.jsx` — возвращает `null`; рендерится только
  за `{false && ...}`.
- `web/tsconfig.json` (lenient: `strict: false`, `allowJs`) — иначе проверка
  типов CRA не пропускает `.ts`-модули, импортящие нетипизированный JS.

## Отличия от живой сборки и предупреждения

- Стили и картинки-заглушки отличаются от продакшена (их не было в source map).
- Бандлы: web `main.301ff75f.js` ~1,1 МБ; admin `main.3592c778.js` ~1,7 МБ.
- Сборки проходят как `Compiled with warnings`: в основном `eqeqeq`,
  `no-unused-vars`, `jsx-a11y/anchor-is-valid` в старом коде; в admin при
  старте — предупреждение о missing source map `react-double-scrollbar`
  (на билд не влияет).
- Остаточный риск: содержимое source map может не полностью совпадать с
  текущей прод-сборкой сайта (от 03.11.2025 выложена без карты).
