# Employee Leave Management System

A role-based leave management web app built with Angular 17+, Angular Material, and a mock REST API (JSON Server).

## Features

- **Authentication** with role-based routing (Employee / Manager / Admin), route guards
- **Employee**: dashboard, apply leave (reactive form with validations), my leaves (search/filter/sort/pagination), leave details with status timeline, leave balance, profile
- **Manager**: dashboard, pending approvals, approve/reject with mandatory rejection comment, team leaves, team calendar
- **Admin**: dashboard, employee management (CRUD), leave type management (CRUD), reports

## Tech Stack

- Angular 17+ (standalone components, signals)
- Angular Material
- Reactive Forms
- RxJS
- JSON Server (mock REST API)

## Getting Started

\`\`\`bash
npm install
\`\`\`

Run the mock API and the app in two separate terminals:

\`\`\`bash
npm run api      # starts json-server on http://localhost:3000
ng serve         # starts the app on http://localhost:4200
\`\`\`

## Test Users

| Role     | Email               | Password  |
|----------|---------------------|-----------|
| Employee | employee@test.com   | Test@123  |
| Manager  | manager@test.com    | Test@123  |
| Admin    | admin@test.com      | Test@123  |

## Project Structure

\`\`\`
src/app/
├── core/          # models, services, guards, interceptors
├── shared/        # reusable components (summary-card, status-badge, leave-table)
├── layout/        # main app shell (toolbar + side menu)
└── features/      # feature modules: auth, employee, manager, admin
\`\`\`