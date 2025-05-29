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

# 2. Configura Composer
RUN curl -sS https://getcomposer.org/installer | php -- \
    --install-dir=/usr/local/bin \
    --filename=composer

# 3. Cria diretório storage antes de configurar permissões
RUN mkdir -p /app/storage

# 4. Copia arquivos
COPY ./backend /app
WORKDIR /app

# 5. Configura Nginx
COPY ./backend/nginx.conf /etc/nginx/nginx.conf

# 6. Instala dependências PHP
RUN composer install --no-dev --ignore-platform-reqs --optimize-autoloader

# 7. Porta e comando
EXPOSE 8080
CMD service php8.2-fpm start && nginx -g "daemon off;"