# Секреты: перечень обозначений и где лежат значения

Значения ни в одном файле этого репозитория не хранятся. Источник значений: рабочий сервер (файлы в столбце «Где на сервере») и зашифрованная резервная копия кода на втором сервере (снимки `code/<дата>/`). Доступ к ним есть у координатора.

| Обозначение | Назначение | Где на сервере |
|---|---|---|
| `__KP_DB_PASSWORD__` | пароль пользователя MariaDB `kitobplus` | `api/connect2db.php`, все `srv/*.php` с подключением, `scripts/` |
| `__KP_ADMIN_TOKEN__` | статический токен авторизации админки, один на всех сотрудников | `srv/login.php` выдаёт, ещё 14 файлов `srv/` проверяют |
| `__KP_ADMIN_LOGIN_1__`, `__KP_ADMIN_PASSWORD_1__`, `__KP_ADMIN_LOGIN_2__`, `__KP_ADMIN_PASSWORD_2__` | две пары логин и пароль, зашитые в код входа в админку в обход таблицы пользователей | `srv/login.php` |
| `__KP_MYBOOK_HOST__`, `__KP_MYBOOK_PASSWORD__` | адрес и пароль удалённой базы `mybook` (интеграция заморожена, хост недоступен) | `srv/link_genre.php`, `srv/link2inbox.php`, `srv/genres_links.php`, `srv/change_state.php`, `srv/change_person_state.php`, `srv/book.php`, `srv/api/index.php` |
| `__KP_AV3715_HOST__`, `__KP_AV3715_ROOT_PASSWORD__` | адрес и пароль root удалённой базы `av3715` (та же заморозка) | `srv/index.php`, `srv/inbox_books.php`, `srv/inbox_genres.php` |
| `__KP_TELEGRAM_BOT_TOKEN__`, `__KP_TELEGRAM_CHAT_ID__` | бот и группа, куда уходят заявки на регистрацию | `api/bot.php` |
| `__KP_CLICK_SECRET_KEY__` | секретный ключ мерчанта Click | `api/access/settings.php`, `click/settings.php` |
| `__KP_SMS_LOGIN__`, `__KP_SMS_PASSWORD__` | учётная запись SMS-шлюза | `api/auth/sendSMS.php`, `scripts/catalog/sms.php` |
| `__KP_OPERSMS_LOGIN__`, `__KP_OPERSMS_PASSWORD__` | учётная запись старого шлюза opersms.uz (закомментировано) | `scripts/catalog/sms.php` |
| `__KP_FIXED_CODE_PHONE__`, `__KP_FIXED_CODE__` | номер телефона, для которого код подтверждения задан константой | `api/auth/sms.php` |
| `__KP_TEST_PHONE_1__` … `__KP_TEST_PHONE_6__` | номера, для которых SMS не отправляется, и номер получателя в тестовых скриптах | `api/auth/sms.php`, `api/auth/test.php`, `scripts/catalog/sms.php` |
| `__KP_FCM_DEVICE_TOKEN__` | токены устройств в тестовых скриптах рассылки | `srv/push/test.php`, `srv/push/notifications.php` |
| `__KP_GEMINI_API_KEY__` | ключ Gemini API экспериментального прокси | `srv/embeddings_proxy.py` |

Файлы с секретами, которые лежат вне кода и в репозиторий не входят:

| Файл | Назначение |
|---|---|
| `/var/www/AuthKey_*.p8` | два ключа Sign in with Apple; пути и идентификаторы в `api/oauth/apple.php` |
| `/var/www/kitobplus-sign-in-firebase-adminsdk-*.json` | сервисный аккаунт Firebase для push; путь в `srv/push/send_functions.php` |

## Порядок при выкладке

До появления конфигурации вне кода значения подставляются в файлы на сервере вручную или скриптом, который заменяет каждое обозначение соответствующим значением из защищённого файла. Следующий шаг этапа 2: вынести все значения в один файл конфигурации вне веб-корня и читать их из кода, чтобы подстановка стала ненужной.

## Что сделать при утечке

Пароль базы и токен админки меняются на сервере; ключ Click в кабинете мерчанта; учётная запись SMS у оператора; токен бота через BotFather; ключ Gemini в консоли Google. После смены значения обновляются на сервере и в резервной копии ничего делать не нужно: копия хранит старое состояние.
