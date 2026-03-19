# Raw Node.js + SQLite To‑Do API (Backend Only) Plan

## Goal
Build a small REST-ish JSON API for a simple task/to‑do list using **raw Node.js** (no Express/Fastify) and **SQLite** for persistence.

## Non-goals (for now)
- Auth/users, multi-tenant workspaces
- UI/frontend
- Realtime updates / websockets
- Background jobs / reminders

## Proposed approach
- Use Node’s built-in `http` + `URL` for routing and query parsing.
- Implement a tiny router + helpers:
  - parse JSON body (with size limit)
  - consistent JSON responses
  - centralized error handling (400/404/409/500)
- Use SQLite with a small DB module and prepared statements.
  - Recommended: `better-sqlite3` for simplest code (sync) **or** `sqlite3` if you prefer async.
  - Enable WAL mode for better concurrency.

## Data model (SQLite)
Table: `tasks`
- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `title` TEXT NOT NULL
- `notes` TEXT NULL
- `completed` INTEGER NOT NULL DEFAULT 0  -- 0/1
- `created_at` TEXT NOT NULL              -- ISO8601
- `updated_at` TEXT NOT NULL              -- ISO8601

Indexes (optional but cheap):
- `CREATE INDEX idx_tasks_completed ON tasks(completed);`
- `CREATE INDEX idx_tasks_updated_at ON tasks(updated_at);`

## API surface (JSON)
Base: `/tasks`

- `GET /health`
  - 200 `{ "ok": true }`

- `POST /tasks`
  - body: `{ "title": string, "notes"?: string }`
  - 201 returns created task

- `GET /tasks`
  - query (optional):
    - `completed=0|1`
    - `q=<substring>` (search in title/notes)
    - `limit` (default 50, max 200)
    - `offset` (default 0)
    - `sort=updated_at|created_at` (default `updated_at`)
    - `order=asc|desc` (default `desc`)
  - 200 returns `{ items: Task[], limit, offset, total }`

- `GET /tasks/:id`
  - 200 returns task; 404 if not found

- `PATCH /tasks/:id`
  - body: any of `{ "title", "notes", "completed" }`
  - 200 returns updated task; 404 if not found

- `DELETE /tasks/:id`
  - 204 on success; 404 if not found

### Task JSON shape
`{ id, title, notes, completed, created_at, updated_at }`

## Validation rules (suggested defaults)
- `title`: required on create; trimmed; 1..200 chars
- `notes`: optional; 0..2000 chars
- `completed`: boolean-like (accept true/false or 0/1) on patch
- Reject unknown top-level fields (helps catch client bugs)

## Error format
Consistent JSON errors:
- `{ error: { code: string, message: string, details?: any } }`
Examples:
- 400 `VALIDATION_ERROR`
- 404 `NOT_FOUND`
- 415 `UNSUPPORTED_MEDIA_TYPE` (if non-JSON body)

## Project structure (suggested)
- `src/server.js` (http server + route table)
- `src/router.js` (path matching `/tasks/:id`)
- `src/db.js` (open DB, migrations, prepared statements)
- `src/handlers/tasks.js` (CRUD handlers)
- `src/utils/body.js` (read/parse JSON with limit)
- `src/utils/respond.js` (send JSON, errors)

## Configuration
- `PORT` (default 3000)
- `DB_PATH` (default `./data/todo.sqlite`)

## Minimal testing (no extra frameworks)
Use Node’s built-in test runner `node:test` + global `fetch`:
- start server on ephemeral port in test setup
- cover:
  - create -> fetch by id
  - list pagination
  - patch validation + 404
  - delete

## Acceptance criteria
- All endpoints above work and persist to SQLite.
- Input validation returns 400 with clear error codes.
- Tests pass via `node --test`.
- Server can be started with a single `node src/server.js` (or `npm start`).

## Build Plan: Step-by-Step Implementation

### Phase 1: Project Setup
1. Initialize Node.js project
   - Create `package.json` with name, version, type: "module"
   - Add scripts: `"start": "node src/server.js"`, `"test": "node --test tests/**/*.test.js"`
2. Install dependencies
   - `npm install better-sqlite3` (or `sqlite3` if async preferred)
3. Create directory structure
   - `mkdir -p src/{handlers,utils} data tests`
4. Create `.gitignore`
   - Exclude `node_modules/`, `data/*.sqlite*`, `.env`
5. Create `.env.example` with `PORT=3000` and `DB_PATH=./data/todo.sqlite`

### Phase 2: Database Module (`src/db.js`)
1. Export function to initialize DB connection
2. Create `tasks` table on startup if it doesn't exist
   - Columns: id, title, notes, completed, created_at, updated_at
3. Create indexes: completed, updated_at
4. Export prepared statements for all queries:
   - `insertTask(title, notes)`
   - `getTaskById(id)`
   - `listTasks(limit, offset, filters)`  
   - `updateTask(id, fields)`
   - `deleteTask(id)`
   - `countTasks(filters)`
5. Export utility to close DB connection

### Phase 3: Response Utilities (`src/utils/respond.js`)
1. Export `success(res, data, statusCode)` — sends 200/201 with JSON
2. Export `error(res, code, message, statusCode, details)` — sends 400/404/500 with error format
3. Export `noContent(res)` — sends 204 for DELETE

### Phase 4: Request Body Parser (`src/utils/body.js`)
1. Export async `parseBody(req)` that:
   - Checks `Content-Type: application/json`
   - Reads incoming stream with size limit (~1MB)
   - Parses JSON, rejects on invalid JSON
   - Returns parsed object or throws error

### Phase 5: Router (`src/router.js`)
1. Export function `route(req, method, pathname, handlers)`
2. Implement path matching:
   - Exact matches: `/health`, `/tasks`
   - Parameterized: `/tasks/:id` → extracts id
3. Return `{ handler, params }` or null if no match
4. Handle 404 for unmatched routes

### Phase 6: Task Handlers (`src/handlers/tasks.js`)
1. **createTask(req, res)**
   - Parse body, validate title (1-200 chars, required)
   - Validate notes (0-2000 chars, optional)
   - Insert into DB, return 201 + task
2. **listTasks(req, res)**
   - Parse query params: completed, q, limit, offset, sort, order
   - Validate pagination (limit max 200)
   - Query DB with filters
   - Return 200 + { items, limit, offset, total }
3. **getTask(req, res, params)**
   - Get id from params
   - Query DB, return 200 + task or 404
4. **updateTask(req, res, params)**
   - Get id from params
   - Parse body, allow: title, notes, completed
   - Validate each field
   - Update DB, return 200 + task or 404
5. **deleteTask(req, res, params)**
   - Get id from params
   - Delete from DB, return 204 or 404

### Phase 7: Server (`src/server.js`)
1. Import http, router, handlers, db, utils
2. Initialize DB on startup
3. Create HTTP server:
   - Parse URL + method from request
   - Route to appropriate handler
   - Catch errors, return consistent JSON error
4. Load config from env (.env or defaults)
5. Listen on PORT
6. Graceful shutdown: close DB connection on SIGINT

### Phase 8: Testing (`tests/tasks.test.js`)
1. Test server startup on ephemeral port
2. Test health endpoint: GET /health → 200 ok
3. Test create task:
   - POST /tasks with valid title → 201 + task
   - POST /tasks with missing title → 400 VALIDATION_ERROR
   - POST /tasks with extra fields → 400 (reject unknown)
4. Test list tasks:
   - GET /tasks → 200 + items array
   - GET /tasks?limit=10&offset=5 → respects pagination
   - GET /tasks?completed=1 → filters correctly
   - GET /tasks?q=search → searches title/notes
5. Test get task:
   - GET /tasks/1 → 200 + task
   - GET /tasks/999 → 404 NOT_FOUND
6. Test update task:
   - PATCH /tasks/1 with title → 200 + updated task
   - PATCH /tasks/1 with invalid completed → 400
   - PATCH /tasks/999 → 404
7. Test delete task:
   - DELETE /tasks/1 → 204 (no content)
   - DELETE /tasks/999 → 404
8. Cleanup: teardown server and DB after tests

### Execution Order
Follow phases in order (1→2→3→4→5→6→7→8) to build bottom-up:
- Phases 1-4 are foundations (project, DB, utilities)
- Phases 5-6 add routing and business logic
- Phase 7 wires everything together
- Phase 8 validates the whole system works
