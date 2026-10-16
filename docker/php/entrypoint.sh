#!/bin/sh
set -e
cd /var/www/html

# Зависимости входа через Google/Apple не хранятся в репозитории (см. README).
if [ -f api/oauth/composer.lock ] && [ ! -d api/oauth/vendor ]; then
	composer install --no-interaction --no-progress -d api/oauth \
		|| echo "kp-entrypoint: composer install в api/oauth не удался, вход через Google/Apple локально работать не будет" >&2
fi

# Хранилище аудио и пользовательских файлов (на сервере вне репозитория).
mkdir -p /kitobplus/books/storage /kitobplus/books/import/books /kitobplus/books/backup
chown -R www-data:www-data /kitobplus/books /var/www/html/pics /var/www/html/restricted /var/www/html/books 2>/dev/null || true

exec docker-php-entrypoint "$@"
