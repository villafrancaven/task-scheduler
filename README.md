# Task Scheduler API

A simple task scheduling REST API built with **NestJS**, **TypeScript**, and **PostgreSQL**.  
Supports JWT authentication and Swagger-based API documentation.

---

## Features

- CRUD for tasks
- JWT Authentication
- PostgreSQL with Docker
- OpenAPI (Swagger UI)

---

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/villafrancaven/task-scheduler.git
cd task-scheduler
```

### 2. Copy environment file
```bash
cp .env.example .env
or
copy .env.example .env
```

### 3. Run the app
```bash
docker compose up --build
```

App will be available at 
➡️ http://localhost:3000/api
