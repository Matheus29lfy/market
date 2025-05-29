FROM php:8.2-apache

# Instala dependências
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpq-dev \
    && docker-php-ext-install zip pdo_mysql pdo pdo_pgsql \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

# Configura Composer
RUN curl -sS https://getcomposer.org/installer | php -- \
    --install-dir=/usr/local/bin --filename=composer

# Copia o backend
COPY ./backend /var/www/html
WORKDIR /var/www/html

# Permissões
RUN chown -R www-data:www-data /var/www/html

# Instala dependências
RUN composer install --no-dev --optimize-autoloader

EXPOSE 80
CMD ["apache2-foreground"]