# GOT-IT Tracker

> A collaborative expense management platform built with React, TypeScript and .NET, designed to simplify shared financial control between groups.

## Overview

**GOT-IT Tracker** is a full-stack application focused on managing shared expenses, participants, groups, and approval workflows.

The project was created to solve a common problem: organizing financial responsibilities inside groups where multiple people contribute, spend, and need transparency over transactions.

The platform allows users to create collaborative environments called **Playgrounds**, manage participants, register transactions, control approvals, and visualize financial summaries through dashboards.

The project was developed with a focus on:

- clean architecture;
- maintainable backend design;
- secure authentication;
- scalable API structure;
- modern frontend practices;
- user experience and responsiveness.

---

# Features

## Authentication and Users

- User registration and authentication;
- JWT-based authentication;
- Refresh token support;
- Protected API endpoints;
- User management.

## Playgrounds (Groups)

- Create and manage financial groups;
- Invite participants;
- Configure group permissions;
- Manage members and access control.

## Transactions

- Register expenses and transactions;
- Associate transactions with participants;
- Track financial activity;
- Update and remove transactions.

## Approval Workflow

- Request approval for transactions;
- Approve or reject pending requests;
- Maintain control over group expenses.

## Dashboard and Reports

- Financial overview;
- Transaction summaries;
- Balance visualization;
- Reports and comparisons.

## Internationalization

- Portuguese and English language support.

---

# Architecture

The project follows a layered architecture separating responsibilities between frontend, API, business logic, and persistence.

```
GOT-IT Tracker

├── Frontend
│   ├── React
│   ├── TypeScript
│   ├── Vite
│   └── Tailwind CSS
│
└── Backend
    ├── ASP.NET Core Web API
    ├── Entity Framework Core
    ├── ASP.NET Identity
    ├── JWT Authentication
    └── SQLite Database
```

The backend follows a service-oriented structure:

```
Controllers
     |
Services
     |
Repositories
     |
Entity Framework Core
     |
Database
```

This separation keeps controllers lightweight and centralizes business rules inside application services.

---

# Technology Stack

## Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Motion animations
- Lucide React
- Axios

## Backend

- .NET 10
- C#
- ASP.NET Core Web API
- Entity Framework Core
- ASP.NET Identity
- JWT Authentication
- AutoMapper
- Scalar/OpenAPI

## Database

Development environment:

- SQLite

The application was designed to allow migration to production databases such as PostgreSQL or SQL Server.

---

# Technical Highlights

## Secure Authentication

Implemented authentication using:

- ASP.NET Identity;
- custom User entity;
- JWT access tokens;
- refresh tokens;
- protected routes.

## Domain Modeling

The application contains domain entities designed around real business scenarios:

- Users;
- People;
- Playgrounds;
- Playground Members;
- Transactions;
- Approval Requests.

The model supports relationships between users, groups, and financial operations.

## API Design

The backend exposes a RESTful API with:

- DTO-based communication;
- validation;
- centralized exception handling;
- standardized error responses;
- dependency injection.

## Frontend Organization

The frontend was structured with:

- reusable React components;
- separated API services;
- centralized TypeScript types;
- reusable utilities;
- responsive interfaces.

---

# Project Structure

```
got-it-tracker/

├── backend-csharp/
│   ├── Controllers/
│   ├── Application/
│   ├── Domain/
│   ├── Infrastructure/
│   └── Migrations/
│
└── frontend-react/
    ├── src/
    │   ├── components/
    │   ├── services/
    │   ├── types.ts
    │   └── utils.ts
    └── package.json
```

---

# Running Locally

## Backend

Requirements:

- .NET 10 SDK

```bash
cd backend-csharp

dotnet restore

dotnet build

dotnet run
```

Backend runs locally at:

```
https://localhost:7189
```

API documentation:

```
https://localhost:7189/scalar/v1
```

---

## Frontend

Requirements:

- Node.js 18+

```bash
cd frontend-react

npm install

npm run dev
```

Frontend runs locally at:

```
http://localhost:3000
```

---

# Development Practices

The project follows modern development practices:

- Git flow with feature branches;
- separation of concerns;
- clean code principles;
- asynchronous programming;
- reusable components;
- API-first communication;
- environment-based configuration.

---

# Future Improvements

Possible improvements planned:

- PostgreSQL production deployment;
- Docker containerization;
- automated testing pipeline;
- cloud deployment;
- role-based permissions;
- advanced financial analytics.

- Add Java backend using Spring Boot and Hibernate for a more robust backend architecture.

---
