FROM php:8.2-apache

# Instala dependências do sistema
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpq-dev \
    && docker-php-ext-install zip pdo_mysql pdo pdo_pgsql \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

# Define ServerName para evitar warning
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Instala Composer
RUN curl -sS https://getcomposer.org/installer | php -- \
    --install-dir=/usr/local/bin --filename=composer

# Troca a porta padrão do Apache para 8080 (requisito do Railway)
RUN sed -i 's/80/8080/g' /etc/apache2/ports.conf /etc/apache2/sites-available/000-default.conf

# Copia o código para dentro da imagem
COPY . /var/www

# Define a pasta correta como DocumentRoot
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/public|' /etc/apache2/sites-available/000-default.conf

# Permite .htaccess funcionar
RUN echo '<Directory /var/www/public>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' > /etc/apache2/conf-available/custom.conf \
    && a2enconf custom

# Define o diretório de trabalho
WORKDIR /var/www

COPY .env /var/www/.env

RUN chown www-data:www-data /var/www/.env
# Permissões
RUN chown -R www-data:www-data /var/www

# Instala dependências PHP do projeto
RUN composer install --no-dev --optimize-autoloader --working-dir=/var/www

# Expõe a porta 8080 (correspondente ao Apache alterado)
EXPOSE 8080

# Inicia o Apache no foreground
CMD ["apache2-foreground"]