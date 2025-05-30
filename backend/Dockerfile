FROM php:8.2-apache

# Instala dependências
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpq-dev \
    && docker-php-ext-install zip pdo_mysql pdo pdo_pgsql \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

 # Define ServerName para evitar aviso
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
# Instala Composer
RUN curl -sS https://getcomposer.org/installer | php -- \
    --install-dir=/usr/local/bin --filename=composer

# Copia o backend
COPY . /var/www

# Define a pasta correta como DocumentRoot
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/public|' /etc/apache2/sites-available/000-default.conf

# Permite .htaccess funcionar
RUN echo '<Directory /var/www/public>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' > /etc/apache2/conf-available/custom.conf && \
    a2enconf custom

# Define o diretório de trabalho
WORKDIR /var/www

# Permissões
RUN chown -R www-data:www-data /var/www

# Instala dependências PHP
RUN composer install --no-dev --optimize-autoloader --working-dir=/var/www

EXPOSE 80
CMD ["apache2-foreground"]
