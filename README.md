# Employee Leave Management System

![Angular](https://img.shields.io/badge/Angular-17%2B-DD0031?logo=angular&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1.1-6DB33F?logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/Java-21-007396?logo=openjdk&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql&logoColor=white)

A full-stack web application where employees apply for leave, managers approve or reject it, and administrators manage employees, leave types and reports.

- **Frontend:** Angular (standalone components, Angular Material, Reactive Forms, Signals)
- **Backend:** Spring Boot REST API with Spring Data JPA / Hibernate
- **Database:** MySQL (tables are generated automatically by Hibernate)
- **API testing:** Swagger UI

---

## Features

### Employee
- Dashboard with leave summary
- Apply for leave (server validates dates, overlaps and balance)
- My Leaves list and leave details
- Cancel a pending request
- Leave balance per leave type
- Profile

### Manager
- Dashboard
- Team leave requests
- Pending approvals, with approve / reject and a comment
- Team calendar of approved leave

### Administrator
- Dashboard
- Employee management (add, edit, activate / deactivate)
- Leave type management (add, edit, delete, activate / deactivate)
- Reports (totals by status, leave type and department)

---

## Architecture

```
Angular (localhost:4200)  ──HTTP/JSON──▶  Spring Boot (localhost:8080)  ──JPA──▶  MySQL (localhost:3306)
```

```
Leave-Management-System/
├── src/                          # Angular application
│   └── app/
│       ├── core/                 # models, services, guards, constants, mappers
│       ├── features/             # employee / manager / admin screens
│       └── shared/               # layout and reusable components
├── leave-management-backend/     # Spring Boot application
│   └── src/main/java/leave_management_backend/
│       ├── controller/           # REST endpoints
│       ├── service/              # business rules
│       ├── repository/           # Spring Data JPA
│       ├── entity/               # User, LeaveType, LeaveRequest
│       ├── dto/                  # request / response objects
│       ├── exception/            # global error handling
│       └── config/               # CORS configuration
├── angular.json
└── package.json
```

---

## Database

Three tables, created automatically on first run (`spring.jpa.hibernate.ddl-auto=update`).

| Table | Columns |
|---|---|
| `users` | `user_id` (PK), `name`, `email` (unique), `password`, `role`, `department`, `manager_id` (FK to `users`, nullable), `active` |
| `leave_types` | `leave_type_id` (PK), `name` (unique), `max_days`, `active` |
| `leave_requests` | `request_id` (PK), `user_id` (FK), `leave_type_id` (FK), `from_date`, `to_date`, `days`, `reason`, `status`, `manager_comment` (nullable), `applied_on` |

**Status flow:** `PENDING` → `APPROVED` or `REJECTED` (by the employee's manager). A `PENDING` request can also be `CANCELLED` by its owner.

---

## Business rules enforced by the backend

- The user and the leave type must exist and be active.
- `toDate` cannot be before `fromDate`, and leave cannot start in the past.
- `days` is calculated by the server (calendar days, inclusive).
- A request cannot overlap the user's other `PENDING` or `APPROVED` requests.
- Pending plus approved days for a leave type cannot exceed its `maxDays`.
- Only the employee's own manager can approve or reject, and only `PENDING` requests.
- A comment is required when rejecting.
- Only the owner can cancel, and only `PENDING` requests.
- A leave type that already has requests cannot be deleted (deactivate it instead).

---

## Getting started

### Prerequisites
- Node.js and npm, plus Angular CLI (`npm install -g @angular/cli`)
- Java 21
- MySQL 8.x running locally
- Eclipse (or any IDE) or Maven for the backend

### 1. Clone

```bash
git clone https://github.com/jayanth422232/Leave-Management-System.git
cd Leave-Management-System
```

### 2. Configure the database connection

The database `leave_management_db` is created automatically on first run. Open
`leave-management-backend/src/main/resources/application.properties` and set your own MySQL credentials:

```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### 3. Run the backend

From Eclipse, run `LeaveManagementBackendApplication` as a Java Application. Or from a terminal:

```bash
cd leave-management-backend
mvnw.cmd spring-boot:run        # Windows
./mvnw spring-boot:run          # macOS / Linux
```

The API starts at `http://localhost:8080`.

### 4. Run the frontend

In a second terminal at the repository root:

```bash
npm install
ng serve
```

Open `http://localhost:4200`.

### 5. Create the first users

There is no seed data. Open Swagger UI at `http://localhost:8080/swagger-ui/index.html` and call `POST /api/users` for each of these:

```json
{ "name": "Meera Rao",   "email": "manager@test.com",  "password": "Test@123", "role": "MANAGER",  "department": "IT" }
{ "name": "Admin User",  "email": "admin@test.com",    "password": "Test@123", "role": "ADMIN",    "department": "HR" }
{ "name": "Ravi Kumar",  "email": "employee@test.com", "password": "Test@123", "role": "EMPLOYEE", "department": "IT", "managerId": 1 }
```

`managerId` must be the `userId` returned for the manager. Then create at least one leave type with `POST /api/leave-types`, for example `{ "name": "Sick Leave", "maxDays": 12, "active": true }`.

Log in at `http://localhost:4200` with any of the accounts above.

---

## API overview

Interactive documentation: `http://localhost:8080/swagger-ui/index.html`

| Area | Endpoints |
|---|---|
| Auth | `POST /api/auth/login` |
| Users | `GET/POST /api/users`, `GET/PUT/PATCH /api/users/{id}`, `GET /api/users/manager/{managerId}`, `PATCH /api/users/{id}/toggle-active` |
| Leave types | `GET/POST /api/leave-types`, `GET /api/leave-types/active`, `GET/PUT/PATCH/DELETE /api/leave-types/{id}`, `PATCH /api/leave-types/{id}/toggle-active` |
| Leaves (employee) | `POST /api/leaves`, `GET /api/leaves/user/{userId}`, `GET /api/leaves/balance/{userId}`, `GET /api/leaves/{id}`, `PATCH /api/leaves/{id}/cancel?userId=` |
| Leaves (manager) | `GET /api/leaves/manager/{managerId}`, `.../pending`, `.../calendar`, `PATCH /api/leaves/{id}/approve`, `PATCH /api/leaves/{id}/reject` |
| Leaves (admin) | `GET /api/leaves?status=` |
| Reports | `GET /api/reports/summary` |

Errors return JSON: `{ "error", "message", "status", "timestamp" }`.

---

## Scope and known limitations

This is a learning project with a deliberately limited scope.

**Not included:** JWT or token authentication, leave accrual, carry-forward, holiday calendar, email or in-app notifications, escalation.

**Be aware:**
- Passwords are stored as plain text and the login returns the user record. This is acceptable for a demo, not for production. Hash passwords (for example BCrypt) and add token-based authentication before any real use.
- API endpoints are not protected on the server. Role-based access is enforced by the Angular route guards only.
- Leave balance is a per-leave-type cap on pending plus approved days and does not reset yearly.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Angular, Angular Material, RxJS, Reactive Forms, Signals, Router guards |
| Backend | Java 21, Spring Boot 4.1.1, Spring Web, Spring Data JPA (Hibernate), Jakarta Validation |
| Database | MySQL 8 |
| Docs / testing | springdoc-openapi (Swagger UI) |
| Tooling | Maven, Git, Eclipse, VS Code |

