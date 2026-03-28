# CRUD To-Do List API

A simple CRUD API for managing tasks using raw Node.js (without Express).

This project demonstrates:
- HTTP server creation with Node.js native modules
- Route matching with path params
- Query string filtering
- JSON body parsing middleware
- File-based persistence

## Tech Stack

- Node.js (ES Modules)
- Native `http` and `fs` modules
- JSON file persistence (`data/data.json`)

## Project Structure

- `src/server.js`: HTTP server, route resolution, params/query extraction
- `src/routes.js`: API route handlers
- `src/database.js`: data operations (insert, select, update, delete)
- `middlewares/json.js`: JSON body parser middleware
- `utils/build_route_path.js`: converts route patterns into RegExp
- `utils/extract_query_params.js`: parses query string into object
- `data/data.json`: persisted data

## Requirements

- Node.js 18+ (recommended)
- npm

## Installation

```bash
npm install
```

## Running the API

```bash
npm run dev
```

Server starts at:

```text
http://localhost:3000
```

## Task Model

A task object currently looks like this:

```json
{
  "id": 123,
  "title": "Study Node",
  "description": "Read about streams",
  "is_done": false,
  "created_at": "2026-03-27"
}
```

## API Endpoints

### 1) Get all tasks

```http
GET /tasks
```

Optional query filtering is supported.

Examples:

```http
GET /tasks?title=study
GET /tasks?description=stream
```

### 2) Get task by id

```http
GET /tasks/:id
```

Example:

```http
GET /tasks/123
```

### 3) Create task

```http
POST /tasks
Content-Type: application/json
```

Body:

```json
{
  "title": "Learn routing",
  "description": "Study route params and query parsing"
}
```

Response:
- `201 Created` on success
- `400 Bad Request` when body is missing/invalid

### 4) Patch task

```http
PATCH /tasks/:id
Content-Type: application/json
```

Intended for partial updates.

Typical body:

```json
{
  "title": "Updated title",
  "is_done": true
}
```

Current route accepts field list:
- `title`
- `description`
- `is_done`

Response:
- `204 No Content` on success
- `400 Bad Request` when body is missing

### 5) Delete task

```http
DELETE /tasks/:id
```

Response:
- `200 OK` when request is processed
- `400 Bad Request` when params are missing

## cURL Examples

Get all tasks:

```bash
curl -X GET http://localhost:3000/tasks
```

Get by id:

```bash
curl -X GET http://localhost:3000/tasks/123
```

Create task:

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"My task","description":"My description"}'
```

Patch task:

```bash
curl -X PATCH http://localhost:3000/tasks/123 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated","is_done":true}'
```

Delete task:

```bash
curl -X DELETE http://localhost:3000/tasks/123
```

## Notes

- Data is persisted in `data/data.json`.
- IDs are generated randomly with `Math.ceil(Math.random() * 1000)`.
- Middleware sets `Content-type: application/json` for responses.

## License

MIT (see `LICENSE`).
