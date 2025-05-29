FROM php:8.2-apache

# 1. Instala dependências do sistema
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libpq-dev \
    default-mysql-client \
    && docker-php-ext-install zip pdo_mysql pdo \
    && rm -rf /var/lib/apt/lists/*

# 2. Configura o Composer
RUN curl -sS https://getcomposer.org/installer | php -- \
    --install-dir=/usr/local/bin \
    --filename=composer

# 3. Copia os arquivos
COPY ./backend /var/www
WORKDIR /var/www

# 4. Instala dependências PHP
RUN composer install --no-dev --ignore-platform-reqs

# 5. Configura o Apache
ENV APACHE_DOCUMENT_ROOT=/var/www/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/sites-available/*.conf \
    && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/apache2.conf \
    /etc/apache2/conf-available/*.conf \
    && echo "ServerName localhost" >> /etc/apache2/apache2.conf \
    && a2enmod rewrite