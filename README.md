# Authentication & Authorization API — Node.js, TypeScript, PostgreSQL

A backend API for authentication and authorization, built with Node.js, TypeScript, Express, and PostgreSQL.

This project focuses on backend application design, feature-oriented organization, layered validation, test-driven development, integration testing, and Docker-based CI with GitHub Actions.

## What this project demonstrates to backend teams

- authentication and authorization flows
- structured backend code organization
- validation close to application rules
- integration testing and CI
- PostgreSQL-backed API development

## What this project covers

- user registration
- user authentication
- user retrieval
- user information update
- user password update

## Architecture overview

The project is structured around business features in order to keep responsibilities clear and the codebase easier to evolve.

Within each feature, the current structure separates responsibilities between:

- **runtime and dependency wiring**
- **controller-level input handling and boundary validation**
- **use case orchestration and business-rule validation**
- **feature-level tests**

The controller layer validates the incoming request structure before it enters the application flow. The use case layer applies stricter validation based on business rules and expected behavior.

This structure is intended to keep application logic explicit, testable, and easier to maintain as the codebase grows.

## Quality practices

This project includes:

- **layered validation**, from controller-level boundary checks to stricter use case validation based on business rules
- **dedicated automated tests** for validation behavior and feature logic
- **feature-level tests** covering expected behavior, invalid inputs, and error cases
- **integration tests** exercising the exposed HTTP endpoints
- **test-driven development practices**
- **TypeScript compilation checks**
- **containerized CI** using Docker Compose and GitHub Actions
- **PostgreSQL test database setup** during CI execution

The goal is to keep the API behavior explicit, testable, and maintainable over time.

## Tech stack

- **Backend:** Node.js, TypeScript, Express
- **Database:** PostgreSQL
- **Validation:** Joi
- **Authentication:** JSON Web Token, Argon2
- **Testing:** Jest, Supertest
- **DevOps / Tooling:** Docker Compose, GitHub Actions

## Engineering focus

This project is built to emphasize:

- feature-oriented code organization
- Clean Architecture-inspired separation of responsibilities
- validation at multiple levels of the application flow
- test-driven development
- integration testing of exposed HTTP endpoints
- containerized CI with Docker Compose and GitHub Actions

## Quick start

### Prerequisites

- Docker
- Docker Compose

### Run locally

```bash
git clone https://github.com/icarta-l/authentication-api-nodejs.git
cd authentication-api-nodejs

# Start the application and database
docker compose up --build -d

# Install dependencies inside the container
docker compose run --rm node npm install

# Compile TypeScript
docker compose run --rm node npm run typescript

# Import database schema and seed data
docker compose exec -T db sh -c 'psql -U my-user -d authentication-api -X' < ./dump.sql

# Run the test suite
docker compose run --rm test-runner
```

The API runs on `http://localhost:8080`.

## Example API usage

### Register user

**Request**

```http
POST /user
Content-Type: application/json

{
  "username": "Bobby",
  "email": "user@example.com",
  "password": "My Strong Password 123!",
  "firstName": "Idan",
  "lastName": "Carta"
}
```

**Response**

```json
{
  "message": "User Registered!"
}
```

## Project structure

```text
.github/
  workflows/

features/
  UserManagement/

services/

tests/
  UserManagement/

app.ts
server.ts
compose.yaml
database-postgresql-tables.sql
dump.sql
```

### Structure notes

- `features/` contains business features grouped by domain area
- `services/` contains shared technical services
- `tests/` contains integration-oriented test code
- `.github/workflows/` contains the CI workflow
- `compose.yaml` defines the containerized local and test environment