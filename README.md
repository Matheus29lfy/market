#Pré requisitos
- Download and Instale Docker

#Backend
- Clone esse template para seu projeto
- git clone https://github.com/Matheus29lfy/loja-api.git
- Acesse a pasta cd backend
- Rode App Manualmente
- Crie um arquivo .env para o ambiente PHP a partir do .env.example na raiz
- e rode "composer install"
- Na raiz para rodar os comandos docker executando
- Execute o comando "docker-compose build" no seu terminal.
- Execute o comando "docker-compose -f docker-compose.yml -d"
- Depois do composer finalizar a instalação Rodar  php -S localhost:8080 -t public/ para iniciar o servidor
- http://localhost:8080

- Há uma documentação da API no swagger através dessa página
- http://localhost:8080/index.html

# Testes
- Para rodar os testes executar comando vendor/bin/phpunit
- Para acessar o swagger
- Nota: Se você encontrar um erro de permissão ao executar o Docker, tente executá-lo como administrador ou use sudo no Linux.

*Há um DUMP com as tabelas que serão necessárias

#Frontend
- Acesse a pasta cd frontend
- Rode npm i
- Rode o servidor npm run
