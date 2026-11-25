#  README do Projeto
#  Alunos - Lorenzo Bruno Bueno
#  Curso - Análise e Desenvolvimento de Sistemas
#  Link do Projeto no Github: https://github.com/LorenzoBrunoBueno/AtividadeAPI----Despesas.git

# Descrição do Projeto

## OBJETIVO DA API
 - Desenvolver Endpoints funcionais para visualização, cadastro, alteração, remoção e outras operações para um sistema de registro para despesas, categorias e usuários, além de endpoints para dashboard, armazenando esses dados em um banco de dados MYSQL local.

## FERRAMENTAS UTILIZADAS
 - NPM
 - Node.js
 - Postman
 - Express.js
 - bcrypt
 - jwt
 - sequelize
 - Visual Studio Code

## EXECUTANDO:
 - clone o repositório do github utilizando: git clone https://github.com/LorenzoBrunoBueno/AtividadeAPI----Despesas.git
 - dentro da pasta AtividadeAPI----Despesas, rode o comando: npm install.
 - depois entre na pasta "database" dentro da pasta "src" do projeto e rode o comando para executar as migrations: npx sequelize-cli db:migrate
 - na mesma pasta, rode o comando para executar os seeders: npx sequelize-cli db:seed:all
 - volte para a raiz do projeto e rode o comando: npm start
 - pronto, o servidor já está rodando.

## EXECUTANDO COM DOCKER (Parte A - Containers)
 - Arquivos: `Dockerfile` (imagem da API), `docker-entrypoint.sh` (roda migrations + seeders ao subir) e `docker-compose.yml`.
 - Serviços do compose:
   - `db`: MySQL 8.4 (porta 3307 no host, para não conflitar com um MySQL local), dados persistidos no volume `db_data`.
   - `api`: esta API Node, porta 3000. Só sobe depois que o healthcheck do `db` passa.
 - Os dois containers ficam na rede `despesas-net`; a API acessa o banco pelo hostname `db` (DNS interno do Docker), e não por `localhost`.

```bash
docker compose up -d --build        # sobe banco + API
docker compose ps                   # ambos "healthy"/"running"
docker compose logs -f api          # migrations, seeders e "Servidor Rodando na porta 3000"
```

### Demonstrando a comunicação entre os containers
```bash
curl http://localhost:3000/api/v2/health
# {"api":"ok","database":"ok","dbHost":"db","mysqlVersion":"8.4.x",...}

docker compose exec api getent hosts db                          # nome "db" resolve para o IP do container MySQL
docker compose exec db mysql -uapp -papp123 expenses -e "select name from category;"
```

### Testando a aplicação em execução
```bash
# login com usuário do seeder (senha 123456)
curl -X POST http://localhost:3000/api/v2/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"lorenzo@email.com","password":"123456"}'
```
 - Depois rode o front-end (`FrontendDespesas`: `npm run dev`) e faça login com `lorenzo@email.com` / `123456`.
 - Para parar: `docker compose down` (adicione `-v` para apagar também os dados do banco).

 ## TESTANDO
 - Depois efetuar a etapa acima, o servidor estará rodando na porta 3000, em http://localhost:3000.
 - O body das requisições já está pré-montado nas rotas dentro da collection do Postman, presente na pasta Postman.
 - Para utilizar as rotas, apenas importe o arquivo para o seu Postman.
 - Não escrevi nenhum script para colocar automaticamente o token de autenticação nas rotas.
 - Caso precise, insira a sua chave token como tipo "Bearer token" dentro da aba "Authorization" da requisição Postman


 ## ROTAS DA API - !!!DEPRECATED!!!

 - Verifique as rotas importando a collection do Postman!!!

    + -------------------------------------------------------------------------------------------------- +
    |  Método  |            Rota            |                         Descrição                          |
    | ________ | __________________________ | __________________________________________________________ |
    | - GET    | /expenses                  | Pegar todas as despesas.                                   |
    | - GET    | /expenses/:id              | Pegar uma despesa em específico, pelo ID.                  |
    | - GET    | /expenses/summary/total    | Pegar o valor somado total das despesas.                   |
    | - GET    | /expenses/summary/category | Pegar o valor somado total das despesas de cada categoria. |
    | - POST   | /expenses                  | Cadastrar uma despesa.                                     |
    | - PUT    | /expenses/:id              | Alterar as Informações de uma despesa pelo ID.             |
    | - DELETE | /expenses/:id              | Deletar uma despesa em específico pelo ID.                 |
    + -------------------------------------------------------------------------------------------------- +

## MODELO DE DADOS - !!!DEPRECATED!!!

- A nova modalem de dados está dentro da pasta "database" no arquivo "DATABASE_TABELAS.sql"

### Entidade Expense/Despesa - !!!DEPRECATED!!!

    + ----------------------------------------------------------------- +
    |                             Expense                               |
    | _________________________________________________________________ |
    |    Nome     |                        Atributos                    |
    | ___________ | ___________________________________________________ |
    | id          | Primary Key, Auto_Increment, NOT NULL, INT UNSIGNED |
    | title       | String, NOT NULL                                    |
    | amount      | Float, UNSIGNED, NOT NULL                           | 
    | category    | String                                              |
    | date        | Date, NOT NULL, > Date.now()                        |
    | description | String                                              |
    | createdAt   | Datetime NOT NULL                                   |  
    + ----------------------------------------------------------------- +
