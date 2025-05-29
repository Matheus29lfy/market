FROM php:8.2-fpm

# 1. Instala Nginx e dependências
RUN apt-get update && apt-get install -y \
    nginx \
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

# 3. Copia arquivos
COPY ./backend /app
WORKDIR /app

# 4. Configura Nginx (copia o arquivo padrão de configuração)
RUN cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.original && \
    mv /app/nginx.conf /etc/nginx/nginx.conf

# 5. Permissões
RUN chown -R www-data:www-data /app && \
    mkdir -p /app/storage && \
    chmod -R 755 /app/storage

# 6. Instala dependências PHP
RUN composer install --no-dev --ignore-platform-reqs --optimize-autoloader

EXPOSE 8080
CMD service php8.2-fpm start && nginx -g "daemon off;"