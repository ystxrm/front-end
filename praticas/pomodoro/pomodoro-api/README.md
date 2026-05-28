# Pomodoro API

Backend da aplicação Pomodoro — Express + Prisma + MySQL.

## Pré-requisitos

- Node.js 18+
- MySQL rodando localmente na porta 3306

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo de exemplo e edite com suas credenciais:

```bash
cp .env.example .env
```

`.env`:
```
DATABASE_URL="mysql://root:SUA_SENHA@localhost:3306/pomodoro_db"
PORT=3333
```

### 3. Criar o banco e rodar migrations

```bash
npx prisma migrate dev --name init
```

### 4. Subir o servidor

```bash
npm run dev
```

A API estará disponível em `http://localhost:3333`.

---

## Endpoints

| Método | Rota                       | Descrição                        |
|--------|----------------------------|----------------------------------|
| GET    | /health                    | Health check                     |
| GET    | /settings                  | Retorna configurações            |
| PUT    | /settings                  | Atualiza configurações           |
| GET    | /tasks                     | Lista histórico de tasks         |
| POST   | /tasks                     | Cria uma nova task               |
| PATCH  | /tasks/:id/complete        | Marca task como concluída        |
| PATCH  | /tasks/:id/interrupt       | Marca task como interrompida     |
| DELETE | /tasks                     | Limpa todo o histórico           |

---

## Exemplos de uso

### GET /health
```
GET http://localhost:3333/health

Resposta: { "ok": true }
```

### GET /settings
```
GET http://localhost:3333/settings

Resposta:
{
  "id": 1,
  "workTime": 25,
  "shortBreakTime": 5,
  "longBreakTime": 15,
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### PUT /settings
```
PUT http://localhost:3333/settings
Content-Type: application/json

{
  "workTime": 30,
  "shortBreakTime": 10,
  "longBreakTime": 20
}
```

### POST /tasks
```
POST http://localhost:3333/tasks
Content-Type: application/json

{
  "id": "abc123",
  "name": "Estudar TypeScript",
  "duration": 25,
  "type": "workTime",
  "startDate": 1700000000000
}

Resposta (201):
{
  "id": "abc123",
  "name": "Estudar TypeScript",
  "duration": 25,
  "type": "workTime",
  "startDate": 1700000000000,
  "completeDate": null,
  "interruptDate": null,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### PATCH /tasks/:id/complete
```
PATCH http://localhost:3333/tasks/abc123/complete
Content-Type: application/json

{ "completeDate": 1700001500000 }
```

### PATCH /tasks/:id/interrupt
```
PATCH http://localhost:3333/tasks/abc123/interrupt
Content-Type: application/json

{ "interruptDate": 1700001000000 }
```

### DELETE /tasks
```
DELETE http://localhost:3333/tasks

Resposta: 204 No Content
```

---

## Scripts disponíveis

| Script                   | Descrição                          |
|--------------------------|------------------------------------|
| `npm run dev`            | Inicia servidor em modo watch      |
| `npm run build`          | Compila TypeScript                 |
| `npm run start`          | Inicia versão compilada            |
| `npm run prisma:migrate` | Roda migrations                    |
| `npm run prisma:studio`  | Abre Prisma Studio (GUI do banco)  |

---

## Erros comuns

| Erro           | Causa                                              | Solução                              |
|----------------|----------------------------------------------------|--------------------------------------|
| ECONNREFUSED   | API não está rodando                               | Execute `npm run dev`                |
| P2025          | Task não encontrada                                | Verifique o id enviado               |
| P2002          | Task com esse id já existe                         | Use um id único                      |
| 400            | Payload inválido (tipos errados ou campo faltando) | Revise o body da requisição          |
| Can't connect  | MySQL não está rodando ou DATABASE_URL errada      | Verifique o .env e o MySQL           |
