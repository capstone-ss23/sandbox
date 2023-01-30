FROM php:8.0-apache

COPY . /var/www/html
WORKDIR /var/www/html

RUN a2enmod rewrite

RUN apt-get update && apt-get install -y git unzip zip default-mysql-client

COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions gd pdo_mysql

# make composer available
COPY --from=composer:2.5.1 /usr/bin/composer /usr/bin/composer