# 🗂️ Employee Leave Management System

A role-based leave management web application built with **Angular 17+** and **Angular Material**, backed by a mock REST API. Employees can apply for and track leave, managers can review and approve requests, and admins can manage employees and leave policies — all through clean, role-specific dashboards.

![Angular](https://img.shields.io/badge/Angular-17+-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Angular Material](https://img.shields.io/badge/Angular%20Material-UI-757575?logo=material-design&logoColor=white)
![Status](https://img.shields.io/badge/Status-Complete-brightgreen)

---

## ✨ Features

### 👤 Employee
- Login with role-based redirect
- Dashboard with live leave balance cards and recent requests
- Apply for leave via a reactive form with full validation (date range, minimum reason length, max leave days, no past dates)
- My Leaves: search, filter by status/type, sort, paginate, and cancel pending requests
- Leave details page with a visual status timeline
- Leave balance and profile screens

### 👔 Manager
- Dashboard with team-wide leave summary
- Pending approvals queue
- Approve or reject requests, with a mandatory comment on rejection
- Team leaves overview
- Monthly team calendar showing who's on leave each day

### 🛡️ Admin
- Dashboard with organization-wide stats
- Employee management: add, edit, search, filter by department, activate/deactivate
- Leave type management: create, update, deactivate, delete
- Reports: leave counts by status and by department

### 🔐 Across the app
- Role-based route guards (`authGuard`, `roleGuard`) — no page is reachable outside its intended role
- Centralized error handling via an HTTP interceptor
- Fully responsive Material Design UI with a persistent toolbar and role-aware side menu

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 17+ (standalone components, signals, new control flow `@if`/`@for`) |
| UI | Angular Material |
| Forms | Reactive Forms with custom validators |
| State | Angular Signals + computed() |
| Data | RxJS, HttpClient |
| Mock API | JSON Server |
| Versioning | Git & GitHub |

---

## 📂 Project Structure

```
src/app/
├── core/
│   ├── models/          # TypeScript interfaces (User, LeaveRequest, LeaveType)
│   ├── services/        # AuthService, LeaveService, UserService
│   ├── guards/           # authGuard, roleGuard
│   └── interceptors/     # errorInterceptor
├── shared/
│   └── components/       # summary-card, status-badge, leave-table, placeholder
├── layout/
│   └── main-layout/      # toolbar + role-based side menu shell
└── features/
    ├── auth/login/
    ├── employee/          # dashboard, apply-leave, my-leaves, leave-details, leave-balance, profile
    ├── manager/           # dashboard, pending-approvals, review-leave, team-leaves, team-calendar
    └── admin/             # dashboard, employees, leave-types, reports
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS)
- Angular CLI → `npm install -g @angular/cli`

### Installation
```bash
git clone https://github.com/jayanth422232/Leave-Management-System.git
cd leave-management
npm install
```

### Running the app

This app needs **two terminals running at the same time** — one for the mock API, one for the Angular dev server.

**Terminal 1 — mock API**
```bash
npm run api
```
Runs on `http://localhost:3000`

**Terminal 2 — Angular app**
```bash
ng serve
```
Runs on `http://localhost:4200`

---

## 🔑 Test Credentials

| Role | Email | Password |
|---|---|---|
| Employee | `employee@test.com` | `Test@123` |
| Manager | `manager@test.com` | `Test@123` |
| Admin | `admin@test.com` | `Test@123` |

---

## 🧭 Architecture Notes

- **No backend required** — `json-server` serves `db.json` as a full REST API (`GET`, `POST`, `PATCH`, `DELETE`) for rapid prototyping.
- **Leave balance is calculated, not stored** — `maxDays − (approved + pending days used)`, computed live via signals.
- **Dates are stored as `YYYY-MM-DD` strings** to avoid timezone bugs common with raw `Date` objects.
- **Guards protect every role boundary** — both at the route level (`authGuard`) and the role level (`roleGuard`), so a logged-in employee can never reach `/admin/*` by typing the URL directly.

---

## 📌 Possible Future Enhancements

- Replace JSON Server with a real Spring Boot / Node backend
- JWT-based authentication
- Email notifications on approval/rejection
- Leave calendar export (iCal)
- Dark mode

---
