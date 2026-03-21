# Plano do Projeto: API de Tarefas em Node.js (CRUD + Importacao CSV)

## Objetivo
Desenvolver uma API em Node.js para gerenciamento completo de tarefas, com as seguintes funcionalidades obrigatorias:
- Criacao de tarefas
- Listagem de tarefas com filtros por `title` e `description`
- Atualizacao de tarefas
- Remocao de tarefas
- Marcacao de tarefas como concluidas
- Importacao em massa via arquivo CSV usando `csv-parse`

## Escopo
- API backend apenas (sem frontend)
- Persistencia local (arquivo JSON), suficiente para o desafio
- Respostas em JSON

## Fora de escopo
- Autenticacao e autorizacao
- Multiusuario
- Deploy em nuvem
- Interface grafica

## Modelo de Dados
Entidade: `task`
- `id`: string (UUID)
- `title`: string (obrigatorio)
- `description`: string (obrigatorio)
- `completed_at`: string ISO ou `null`
- `created_at`: string ISO
- `updated_at`: string ISO

## Endpoints da API

### 1. Criar tarefa
- `POST /tasks`
- Body:
```json
{
  "title": "Estudar Node.js",
  "description": "Revisar streams e http module"
}
```
- Sucesso: `201 Created`

### 2. Listar tarefas com filtros
- `GET /tasks`
- Query params opcionais:
  - `title=<texto>`
  - `description=<texto>`
- Regras:
  - Se ambos forem enviados, aplicar os dois filtros
  - Busca parcial e case-insensitive
- Sucesso: `200 OK`

### 3. Atualizar tarefa
- `PUT /tasks/:id`
- Body (campos permitidos):
```json
{
  "title": "Novo titulo",
  "description": "Nova descricao"
}
```
- Sucesso: `204 No Content` (ou `200` com recurso atualizado, manter padrao escolhido no projeto)

### 4. Remover tarefa
- `DELETE /tasks/:id`
- Sucesso: `204 No Content`

### 5. Marcar tarefa como concluida
- `PATCH /tasks/:id/complete`
- Regra: define `completed_at` com data/hora atual
- Sucesso: `204 No Content`

### 6. Importacao em massa via CSV
- `POST /tasks/import`
- Entrada: arquivo CSV lido por stream
- Biblioteca obrigatoria: `csv-parse`
- Colunas esperadas no CSV:
  - `title`
  - `description`
- Comportamento:
  - Criar uma tarefa para cada linha valida
  - Ignorar/registrar linhas invalidas sem derrubar a importacao inteira
  - Retornar resumo da importacao
- Sucesso: `201 Created` ou `200 OK` com resumo

## Regras de Validacao
- `title` obrigatorio e nao vazio
- `description` obrigatorio e nao vazio
- `id` invalido ou inexistente deve retornar `404 Not Found`
- Payload invalido deve retornar `400 Bad Request`

## Estrutura Sugerida
- `src/server.js` - inicializacao do servidor HTTP
- `src/routes.js` - mapeamento das rotas
- `src/middlewares/json.js` - parser JSON
- `src/database.js` - persistencia em arquivo
- `src/utils/build-route-path.js` - parser de params
- `src/utils/extract-query-params.js` - parser de query
- `src/tasks/import-csv.js` - rotina de importacao com `csv-parse`

## Dependencias
- `csv-parse`
- `uuid` (opcional, para gerar IDs)

## Plano de Implementacao

### Fase 1: Base do servidor
1. ✅ Criar servidor HTTP com Node.js puro
2. ✅ Implementar parser de JSON
3. Implementar roteamento com suporte a params e query string

### Fase 2: CRUD de tarefas
1. Implementar `POST /tasks`
2. Implementar `GET /tasks` com filtros por `title` e `description`
3. Implementar `PUT /tasks/:id`
4. Implementar `DELETE /tasks/:id`
5. Implementar `PATCH /tasks/:id/complete`

### Fase 3: Importacao CSV
1. Criar script/handler de importacao usando `csv-parse`
2. Processar CSV em stream para evitar alto uso de memoria
3. Integrar com `POST /tasks/import`
4. Retornar relatorio: total lidas, importadas, invalidas

### Fase 4: Qualidade
1. Validar codigos de status e formatos de resposta
2. Testar fluxos principais:
   - CRUD completo
   - filtros por `title` e `description`
   - conclusao de tarefa
   - importacao CSV com sucesso e com linhas invalidas

## Criterios de Aceite
- API realiza CRUD completo de tarefas
- `GET /tasks` filtra por titulo e descricao
- Endpoint de conclusao atualiza `completed_at`
- Importacao em massa funciona com `csv-parse`
- Erros de validacao e recurso nao encontrado retornam status corretos
