FROM php:8.2-apache

# 1. Instala dependências do sistema
RUN apt-get update && apt-get install -y \
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

# 3. Copia os arquivos do backend
COPY ./backend /var/www
WORKDIR /var/www

# 4. Configura permissões
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage

# 5. Instala dependências PHP
RUN composer install --no-dev --ignore-platform-reqs --optimize-autoloader

# 6. Configura o Apache
ENV APACHE_DOCUMENT_ROOT=/var/www/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/sites-available/*.conf \
    && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/apache2.conf \
    /etc/apache2/conf-available/*.conf \
    && echo "ServerName localhost" >> /etc/apache2/apache2.conf \
    && a2enmod rewrite

# 7. Expõe a porta e inicia o Apache
EXPOSE 80
CMD ["apache2-foreground"]