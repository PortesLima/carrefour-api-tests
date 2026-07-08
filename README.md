# Carrefour API Tests - Desafio de Automação

Suíte de testes automatizados para a API ServeRest (https://serverest.dev), desenvolvida como parte do desafio de automação de testes do Banco Carrefour.

## Tecnologias utilizadas

- **Linguagem:** JavaScript
- **Gerenciador de testes:** Mocha
- **Biblioteca de asserts:** Chai
- **Cliente HTTP:** Axios
- **Relatórios:** Mochawesome
- **CI/CD:** GitHub Actions

## Estrutura do projeto

```
carrefour-api-tests/
├── .github/workflows/ci.yml   # Pipeline de CI/CD
├── test/
│   ├── usuarios.test.js       # Testes do CRUD de usuários
│   ├── login.test.js          # Testes de autenticação (login/JWT)
│   └── sanity.test.js         # Teste de sanidade do ambiente
├── .mocharc.json              # Configuração do Mocha e do reporter
├── package.json
└── README.md
```

## Como rodar o projeto localmente

### Pré-requisitos
- Node.js instalado (versão 18 ou superior)

### Passos

1. Clone o repositório:
git clone https://github.com/PortesLima/carrefour-api-tests.git
cd carrefour-api-tests

2. Instale as dependências:
npm install

3. Rode os testes:
npm test

4. Após a execução, o relatório HTML é gerado automaticamente em:
mochawesome-report/relatorio-testes.html
Basta abrir esse arquivo no navegador para visualizar o resultado.

## Casos de teste cobertos

### Usuários (CRUD)
- GET /usuarios - deve retornar status 200 e uma lista de usuários
- POST /usuarios - deve cadastrar um novo usuário com sucesso
- GET /usuarios/{id} - deve retornar os dados do usuário criado
- PUT /usuarios/{id} - deve atualizar o usuário criado
- DELETE /usuarios/{id} - deve excluir o usuário criado

### Usuários (cenários de erro e comportamentos específicos)
- POST /usuarios - não deve permitir cadastro com e-mail já existente
- GET /usuarios/{id} - deve retornar erro para id em formato inválido
- POST /usuarios - não deve permitir cadastro sem o campo nome (obrigatório)
- PUT /usuarios/{id} inexistente - deve criar um novo usuário (comportamento upsert identificado na API)
- DELETE /usuarios/{id} inexistente - deve retornar mensagem de "nenhum registro excluído" (a API responde 200 mesmo sem excluir nada)

### Login / Autenticação (JWT)
- POST /login - deve autenticar com sucesso e retornar um token JWT
- POST /login - não deve autenticar com senha incorreta
- POST /login - não deve autenticar com e-mail inexistente

## CI/CD

O projeto conta com um pipeline configurado em `.github/workflows/ci.yml`, que roda automaticamente a cada `push` ou `pull request` na branch `main`. O pipeline:
1. Faz o checkout do código
2. Configura o Node.js
3. Instala as dependências
4. Executa a suíte completa de testes
5. Salva o relatório de testes (Mochawesome) como artefato, disponível para download na aba Actions do GitHub

## Observações

Durante o desenvolvimento, alguns comportamentos reais da API foram identificados por investigação (não documentados previamente), e foram cobertos como casos de teste específicos:
- O endpoint PUT se comporta como "upsert": se o id informado não existir, ao invés de retornar erro, a API cria um novo usuário.
- O endpoint DELETE retorna status 200 mesmo quando o id informado não existe, apenas informando que nenhum registro foi excluído.
- O endpoint GET valida rigorosamente o formato do id (deve conter exatamente 16 caracteres alfanuméricos), retornando erro 400 caso contrário.