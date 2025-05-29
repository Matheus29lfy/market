FROM php:8.2-apache

# 1. Instala dependências
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libpq-dev \
    && docker-php-ext-install zip pdo_mysql pdo pdo_pgsql \
    && rm -rf /var/lib/apt/lists/*

# 2. Configura Composer
RUN curl -sS https://getcomposer.org/installer | php -- \
    --install-dir=/usr/local/bin \
    --filename=composer

# 3. Copia APENAS o backend (sem frontend)
COPY ./backend /var/www/html
WORKDIR /var/www/html

# 4. Configura Apache
RUN a2enmod rewrite && \
    chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html/storage

# 5. Instala dependências
RUN composer install --no-dev --ignore-platform-reqs --optimize-autoloader

EXPOSE 80
CMD ["apache2-foreground"]