# TFC - Trybe Futebol Clube

## ⚽ O que é o TFC?

O TFC é um site informativo sobre partidas e classificações de futebol. Este projeto inclui o desenvolvimento de uma API utilizando o método TDD e integração com um front-end já existente, utilizando Docker para containerização.

## 🏗️ Estrutura do Projeto

O projeto é composto por quatro entidades principais:

1. **Banco de Dados**:
   - Container Docker MySQL configurado no `docker-compose.yml` como `db`.
   - Acesso via Sequelize na porta 3306 do localhost.

2. **Back-end**:
   - Ambiente de desenvolvimento da API, rodando na porta 3001.
   - Inicialização a partir de `app/backend/src/server.ts`.

3. **Front-end**:
   - Front-end já implementado, que consome a API.
   - Comunicação com o back-end na URL `http://localhost:3001`.

4. **Docker**:
   - `docker-compose.yml` para unificação dos serviços (backend, frontend e db).
   - Inicialização do projeto com `npm run compose:up`.

## 📊 Fluxos Principais

O projeto é composto por quatro fluxos principais:

1. **Teams (Times)**: Gerenciamento de informações sobre os times de futebol.
2. **Users e Login (Pessoas Usuárias e Credenciais de Acesso)**: Controle de autenticação e gerenciamento de usuários.
3. **Matches (Partidas)**: Registro e consulta das partidas de futebol.
4. **Leaderboards (Placares)**: Exibição e atualização das classificações dos times.

## ⚙️ Tecnologias Utilizadas

Este projeto foi desenvolvido utilizando as seguintes tecnologias:

- **Node.js**: Ambiente de execução JavaScript no servidor, que permite construir aplicações escaláveis.
- **Express**: Framework web para Node.js que facilita a criação de APIs e servidores.
- **Sequelize**: ORM (Object-Relational Mapping) para Node.js, utilizado para interagir com bancos de dados relacionais de forma mais intuitiva.
- **JWT (JSON Web Token)**: Tecnologia de autenticação que permite a troca segura de informações entre partes.
- **Mocha**: Framework de teste para JavaScript que permite executar testes de forma simples e flexível.
- **Chai**: Biblioteca de asserções que pode ser utilizada com Mocha para realizar testes mais legíveis e expressivos.
- **MySQL/PostgreSQL**: Banco de dados relacional utilizado para armazenar as informações da aplicação.

Além disso, o projeto pode utilizar ferramentas de gerenciamento de pacotes, como:

- **npm**: Gerenciador de pacotes padrão para Node.js, utilizado para instalar e gerenciar dependências do projeto.

Esta combinação de tecnologias permite desenvolver uma aplicação robusta, escalável e fácil de manter.

## 🤝 Observações

Projeto desenvolvido individualmente durante o curso de desenvolvedor fullstack na Trybe.