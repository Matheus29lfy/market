FROM php:8.2-apache

# Copia os arquivos do backend para o container
COPY ./backend /var/www/html

# Instala dependências (se usar composer)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer install --no-dev

# Configura o Apache para usar a pasta pública
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Habilita mod_rewrite (para rotas)
RUN a2enmod rewrite

# Porta exposta
EXPOSE 80