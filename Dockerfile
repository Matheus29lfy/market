FROM php:8.2-fpm

# 1. Instala dependências
RUN apt-get update && apt-get install -y \
    nginx \
    git \
    unzip \
    libzip-dev \
    libpq-dev \
    && docker-php-ext-install zip pdo_mysql pdo pdo_pgsql \
    && rm -rf /var/lib/apt/lists/*

# 2. Configura o Composer
RUN curl -sS https://getcomposer.org/installer | php -- \
    --install-dir=/usr/local/bin \
    --filename=composer

# 3. Copia os arquivos
COPY ./backend /app
WORKDIR /app

# 4. Permissões
RUN chown -R www-data:www-data /app \
    && chmod -R 755 /app/storage

# 5. Instala dependências
RUN composer install --no-dev --ignore-platform-reqs --optimize-autoloader

# 6. Configura Nginx
COPY ./backend/nginx.conf /etc/nginx/conf.d/default.conf

# 7. Configura PHP-FPM
COPY ./backend/php-fpm.conf /usr/local/etc/php-fpm.d/www.conf

# 8. Script de inicialização
COPY ./backend/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8080
CMD ["/start.sh"]