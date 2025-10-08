# Notification System

Система управления уведомлениями с архитектурой микросервисов, включающая Frontend, Backend API, Worker и очередь сообщений NATS.

## Архитектура

- **Frontend**: React + Vite + TypeScript
- **Backend API**: NestJS + TypeScript + PostgreSQL
- **Worker**: Node.js + TypeScript для обработки уведомлений
- **Message Queue**: NATS
- **Database**: PostgreSQL
- **Containerization**: Docker + Docker Compose

## Структура проекта

```
src/                    # Backend API (NestJS)
├── modules/notifications/
│   ├── domain/         # Доменные сущности
│   ├── application/     # Use cases
│   ├── infrastructure/ # Репозитории и внешние сервисы
│   └── presentation/   # Controllers и DTOs
worker/                 # Worker сервис
frontend/               # React приложение
docker-compose.yml      # Конфигурация всех сервисов
Dockerfile             # Backend API контейнер
```

## Быстрый старт

### Предварительные требования

- Docker
- Docker Compose

### Запуск всех сервисов

```bash
# Клонируйте репозиторий
git clone <repository-url>

# Создайте .env файл (опционально, есть значения по умолчанию)
# DB_HOST=db
# DB_PORT=5432
# DB_USER=postgres
# DB_PASSWORD=postgres
# DB_NAME=notifications
# NATS_URL=nats://nats:4222
# PORT=3000

# Запустите все сервисы
docker-compose up --build
```

### Доступные сервисы

После запуска будут доступны:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **NATS**: nats://localhost:4222
- **PostgreSQL**: localhost:5432
- **NATS Monitoring**: http://localhost:8222

## API Endpoints

### Создание уведомления
```http
POST /notifications
Content-Type: application/json

{
  "title": "Test Notification",
  "message": "This is a test message"
}
```

### Получение списка уведомлений
```http
GET /notifications
```

## Статусы уведомлений

- `pending` - Ожидает обработки
- `processed` - Успешно обработано
- `failed` - Ошибка обработки

## Разработка

### Backend API

```bash
npm install
npm run start:dev
```

### Worker

```bash
cd worker
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Архитектурные принципы

### Domain Driven Design (DDD)

- **Domain**: Бизнес-логика и сущности
- **Application**: Use cases и сервисы приложения
- **Infrastructure**: Внешние зависимости (БД, NATS)
- **Presentation**: API контроллеры и DTOs

### SOLID принципы

- **Single Responsibility**: Каждый класс имеет одну ответственность
- **Open/Closed**: Легко расширяется без изменения существующего кода
- **Liskov Substitution**: Интерфейсы корректно реализованы
- **Interface Segregation**: Интерфейсы разделены по функциональности
- **Dependency Inversion**: Зависимости инвертированы через DI

## Технологии

- **Backend**: NestJS, TypeORM, PostgreSQL, NATS
- **Frontend**: React, Vite, TypeScript, Tailwind CSS
- **Worker**: Node.js, TypeScript, NATS, PostgreSQL
- **DevOps**: Docker, Docker Compose
- **Code Quality**: ESLint, Prettier

## Мониторинг

- NATS Monitoring: http://localhost:8222
- Логи контейнеров: `docker-compose logs -f [service-name]`

## Остановка сервисов

```bash
docker-compose down
```

Для полной очистки (включая volumes):

```bash
docker-compose down -v
```