# Локальное окружение backend: те же версии, что на рабочем сервере (Debian 11, Apache 2.4, mod_php 7.4).
FROM docker.io/library/php:7.4-apache-bullseye

# Поддержка Debian 11 (в том числе LTS) закончилась в августе 2026, пакеты переехали в archive.debian.org.
RUN printf '%s\n' \
      'deb http://archive.debian.org/debian bullseye main' \
      'deb http://archive.debian.org/debian-security bullseye-security main' \
      > /etc/apt/sources.list \
 && apt-get -o Acquire::Check-Valid-Until=false update \
 && apt-get install -y --no-install-recommends \
      libapache2-mod-xsendfile libicu-dev libpng-dev libjpeg62-turbo-dev libwebp-dev libfreetype6-dev unzip git \
 && docker-php-ext-configure gd --with-jpeg --with-webp --with-freetype \
 && docker-php-ext-install -j"$(nproc)" mysqli gd intl \
 && a2enmod rewrite headers xsendfile \
 && rm -rf /var/lib/apt/lists/*

COPY --from=docker.io/library/composer:2 /usr/bin/composer /usr/bin/composer
COPY docker/php/php.ini /usr/local/etc/php/conf.d/zz-kitobplus.ini
COPY docker/apache/000-default.conf /etc/apache2/sites-available/000-default.conf
COPY docker/apache/local-index.html /opt/kitobplus/index.html
COPY docker/php/entrypoint.sh /usr/local/bin/kp-entrypoint
RUN chmod +x /usr/local/bin/kp-entrypoint

ENTRYPOINT ["kp-entrypoint"]
CMD ["apache2-foreground"]
