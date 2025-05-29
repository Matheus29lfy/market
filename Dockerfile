FROM php:8.2-apache

# Instala dependências do sistema e extensões do PHP
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpq-dev \
    && docker-php-ext-install zip pdo pdo_mysql pdo_pgsql \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

# Instala Composer
RUN curl -sS https://getcomposer.org/installer | php -- \
    --install-dir=/usr/local/bin --filename=composer

# Define o DocumentRoot como /var/www/public
ENV APACHE_DOCUMENT_ROOT /var/www/public

# Atualiza o VirtualHost para apontar para /var/www/public
RUN sed -ri -e 's!/var/www/html!/var/www/public!g' /etc/apache2/sites-available/000-default.conf && \
    echo '<Directory /var/www/public>' >> /etc/apache2/apache2.conf && \
    echo '    AllowOverride All' >> /etc/apache2/apache2.conf && \
    echo '</Directory>' >> /etc/apache2/apache2.conf

# Copia o código-fonte da aplicação
COPY ./backend /var/www

# Define o diretório de trabalho
WORKDIR /var/www

# Corrige permissões
RUN chown -R www-data:www-data /var/www

# Instala dependências PHP com o Composer
RUN composer install --no-dev --optimize-autoloader

# Expõe a porta padrão do Apache
EXPOSE 80

# Comando padrão do container
CMD ["apache2-foreground"]