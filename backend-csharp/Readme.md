# GOT-IT Tracker — Backend Documentation (accurate to local project)

Version: 1.0.1
Last updated: 2026-07-30

---

Table of Contents

- Implementation-Accurate Addendum (local project)
- Project Overview
- Architecture
- Technology Stack
- Prerequisites
- Local Setup
- Configuration
- Database & Migrations
- Running the Application
- API Reference (examples)
- Authentication
- Error Handling & Status Codes
- Logging & Monitoring
- Testing
- Contributing
- Code Style
- Versioning
- Troubleshooting
- Contact

---

Implementation-Accurate Addendum (local project)

This section reflects the current local backend implementation in Program.cs, controllers, and appsettings.json, and should be treated as the source of truth when this conflicts with generic examples below.

Repository structure (current)

- backend-csharp.slnx (solution)
- Program.cs (service registration, auth, CORS, middleware, OpenAPI/Scalar mapping)
- Controllers (Auth, Users, PlayGround, PlayGroundMember, Transactions, ApprovalRequests)
- Infrastructure/Data/ApplicationDbContext.cs (EF Core context)
- Migrations (EF Core migrations)
- appsettings.json and appsettings.Development.json

Runtime and configuration behavior

- Runtime: .NET 10 Web API.
- Default local DB provider is SQLite via UseSqlite with Data Source=expense_tracker.db.
- JWT settings are read from configuration section JWT (issuer/audience/secret).
- Startup requires Jwt:Secret; app throws InvalidOperationException if missing.
- CORS policy "AllowAll" is configured and applied.
- In Development, OpenAPI is mapped and Scalar API reference is exposed.

Local run profile

- launchSettings.json local URLs:
  - http://localhost:5076
  - https://localhost:7189
- HTTPS profile launchUrl points to scalar/v1.

Current route summary (from controllers)

- Auth: /api/auth
  - POST /login
  - POST /register
  - POST /refresh-token
  - POST /revoke/{userId}
  - POST /update-user

- Users: /api/Users
  - POST /
  - GET /{id}
  - GET /email/{email}
  - PUT /{id}
  - DELETE /{id}

- Playgrounds: /api/Playgrounds
  - POST /
  - GET /{playGroundId}
  - GET /all
  - GET /user/{userId}
  - PATCH /toggle-approval/{playgroundId}
  - PUT /{playgroundId}
  - DELETE /{playgroundId}

- Playground members: /api/PlayGroundMember
  - POST /{playgroundId}
  - GET /{playgroundId}/{memberId}
  - POST /{playgroundId}/invite
  - PUT /{playgroundId}/{memberId}
  - DELETE /{playgroundId}/{memberId}
  - GET /all-members/{playgroundId}

- Transactions: /api/transactions
  - POST /playground/{playgroundId}
  - GET /playground/{playgroundId}/{transactionId}
  - GET /playground/{playgroundId}
  - GET /all
  - PUT /playground/{playgroundId}/{transactionId}
  - DELETE /playground/{playgroundId}/{transactionId}

- Approval requests: /api/ApprovalRequests
  - GET /playground/{playgroundId}
  - GET /{approvalRequestId}
  - PUT /approve
  - PUT /reject

Notes for this document

- Generic sample paths like /api/v1/... and placeholder project names in sections below are examples only.
- For local development and integration, prefer the concrete routes, runtime settings, and URLs documented in this addendum.

---

Project Overview

The GOT-IT Tracker backend is a .NET 10 Web API that implements domain concepts for collaborative expense tracking: Users, People, Playgrounds (groups), PlaygroundMembers, Transactions and ApprovalRequests. 
The implementation follows a layered approach: Controllers expose HTTP endpoints, Application services implement business logic and DTO mapping, and Infrastructure contains EF Core persistence and repositories.

This document focuses on the exact, local implementation details (runtime, configuration, database and routes) so developers can run, modify and integrate with the API.

Architecture

- Layered service architecture (Presentation -> API controllers, Domain -> services & business logic, Persistence -> repository/EF Core)
- REST API with versioning (recommended /api/v1/...)
- Authentication via JWT (token-based)
- Persistence using a relational database (EF Core recommended)
- Typical environment separation: Development, Staging, Production

Technology Stack

- .NET 10
- C# (latest supported by .NET 10)
- ASP.NET Core Web API
- Entity Framework Core (SQLite provider for local dev)
- ASP.NET Identity (custom User entity) for authentication and user management
- AutoMapper (used in Application layer)
- Scalar.AspNetCore and OpenAPI for API metadata in Development
- Logging via Microsoft.Extensions.Logging (can be replaced by Serilog)

Package highlights (present in the project): Microsoft.EntityFrameworkCore.Sqlite, Microsoft.AspNetCore.Identity.EntityFrameworkCore, AutoMapper, Scalar.AspNetCore

Prerequisites

- .NET 10 SDK installed (https://dotnet.microsoft.com)
- dotnet-ef global tool (for adding/applying migrations) if you plan to manage EF migrations locally: dotnet tool install --global dotnet-ef
- Git
- SQLite client for inspecting the local DB file (expense_tracker.db)

Local Setup

1. Clone or open the repository and switch to the backend project folder:

   git clone https://github.com/luizgdsmdev/got-it-tracker.git
   cd got-it-tracker/backend-csharp

2. Restore packages and build:

   dotnet restore
   dotnet build

3. Verify dotnet-ef is available if you will run migrations:

   dotnet ef --version

4. The project uses a local SQLite database file (expense_tracker.db) by default; it will be created when EF applies migrations or when the app runs and ensures database creation.

Configuration

The application reads configuration from appsettings.json/appsettings.Development.json and environment variables. Configuration keys are case-insensitive when accessed via IConfiguration.

Important keys used by the local project (as present in appsettings.json):

- JWT:Secret (required) — symmetric signing key for JWT tokens. Program.cs throws if this is missing.
- JWT:ValidIssuer — the expected issuer for tokens.
- JWT:ValidAudience — the expected audience for tokens.
- JWT:TokenValidityInMinutes — access token lifetime (present in appsettings.json)
- JWT:RefreshTokenValidityInMinutes — refresh token lifetime (present in appsettings.json)
- Logging:LogLevel — configure logging verbosity

Set sensitive values via environment variables in CI/CD or local development secrets:

Example (PowerShell):

  $env:JWT__Secret = "your-very-strong-secret"
  $env:ASPNETCORE_ENVIRONMENT = "Development"

Database & Migrations

- Provider (local): SQLite (configured in Program.cs: UseSqlite("Data Source=expense_tracker.db")).

To add a migration for the backend project (from repo root):

  dotnet ef migrations add <MigrationName> 

To apply migrations / update the database:

  dotnet ef database update 

Notes:
- Migrations are stored in backend-csharp/Migrations. The repository already contains migrations; creating new migrations should be done against the backend-csharp project.
- For production you may switch EF provider to PostgreSQL or SQL Server and update the connection string in configuration.

Running the Application

Start the API from the backend folder:

  dotnet run --project backend-csharp

Local URLs (from Properties/launchSettings.json):
- HTTP: http://localhost:5076
- HTTPS: https://localhost:7189 (launch profile also maps http://localhost:5076)

In Development the app maps OpenAPI and a Scalar API reference (visit https://localhost:7189/scalar/v1 when launched with the https profile).

Important: Program.cs requires JWT:Secret to be configured. If missing the application will throw InvalidOperationException at startup with message "JWT secret key is not configured." Provide the secret via appsettings or environment variable before starting.

API Reference (examples)


Postman collection

A Postman collection has been added to the repository to facilitate manual testing and exploration of the API:

- File: backend-csharp/Got-It-App.postman_collection.json

How to use

1. Open Postman and import the collection (File → Import → choose the JSON file above).
2. Create or update an Environment in Postman with these recommended variables:
   - base_url = https://localhost:7189
   - token = (leave empty; populate after login)

3. In the collection requests the URL is already set to https://localhost:7189. If you run the API on a different port, update the environment base_url or edit the requests' host accordingly.

4. Authenticate: use the auth/login request in the "auth" folder to obtain an access token. Copy the returned accessToken value into the environment variable token.

5. Most requests in the collection include a sample Authorization header using the token variable; ensure the header contains: Bearer {{token}}

Folders included in the collection (high level):

- auth
- PlayGroundMember
- Playgrounds
- Transactions
- ApprovalRequests

Notes

- The collection includes example request bodies and example response models as comments inside the request body. These are illustrative; the real payloads must follow the DTO contracts in Application/DTOs/Requests.
- Some requests in the collection include pre-set bearer tokens for convenience. Replace them with a valid token obtained from the login request in your environment.
- If you want, I can convert this collection into a Postman environment file or generate a README section with direct curl examples extracted from the collection.

Authentication

Authentication uses ASP.NET Identity together with JWT Bearer tokens.

Flow:
1. Client POSTs credentials to POST /api/auth/login using CreateLoginRequest (email + password).
2. AuthService validates credentials and issues a LoginResponse with AccessToken, RefreshToken and ExpiresAt.
3. Client includes Authorization: Bearer <accessToken> on protected endpoints.

Token configuration:
- Token lifetimes and issuer/audience are configured in appsettings.json under JWT.
- Program.cs configures JWT validation parameters (ValidateIssuer, ValidateAudience, ValidateIssuerSigningKey, ClockSkew = 0).

Notes about DTOs:
- CreateLoginRequest requires Email and Password (password policy enforced by DataAnnotations in DTO).
- CreateAcessTokenRequest expects fields named AcessToken and RefreshToken (note: field names follow current DTO naming in code). Provide these exact property names in requests.

Error Handling & Status Codes

The project uses a global ExceptionMiddleware (Infrastructure/Middleware/ExceptionMiddleware.cs) which serializes all exceptions into a standardized ErrorResponse JSON. App-specific exceptions (AppException and its derivatives) set a status code that the middleware uses.

Common HTTP statuses returned by controllers and the middleware:

- 200 OK — successful GET/PUT that return a body
- 201 Created — successful resource creation (controllers use CreatedAtAction in some places)
- 204 No Content — used when no body is returned
- 400 Bad Request — validation errors (DataAnnotations on DTOs produce model state errors automatically)
- 401 Unauthorized — missing or invalid JWT
- 403 Forbidden — authenticated but not permitted by business rules
- 404 Not Found — resource not found
- 500 Internal Server Error — unhandled exceptions

Error payload format (ErrorResponse):

{
  "statusCode": 400,
  "error": "Validation",
  "message": "...",
  "timestamp": "2026-07-30T12:34:56Z",
  "traceId": "00-..."
}

The middleware differentiates AppException-derived errors (using ex.StatusCode) and generic Exception (500).

Logging & Monitoring

- Use structured logging (Serilog recommended) and write logs to console, file, or a centralized aggregator.
- Configure log levels per environment (Information for production, Debug for development).
- Optionally integrate Application Insights, Seq, or Grafana/Promtail stack for observability.

Testing

- Unit tests: run with dotnet test

  dotnet test ./tests/YourProject.Tests --configuration Debug

- Integration tests: use an ephemeral database (SQLite in-memory or test containers) and run migrations before tests.

Contributing

- Fork the repository and open a descriptive pull request.
- Follow branch naming: feature/<feature-name>, fix/<issue>
- Run tests locally before creating PR.
- Keep PRs focused and small.

Code Style

- Follow standard C# conventions (Microsoft's recommended style)
- Prefer async/await for I/O operations
- Keep controllers thin; put logic in services
- Use DTOs for request/response shapes and AutoMapper for mapping if helpful

Versioning

- Semantic Versioning (MAJOR.MINOR.PATCH)
- API versioning via URL (e.g., /api/v1/)

Troubleshooting

- Unable to connect to DB: verify connection string and that the DB server is running.
- 401 Unauthorized: check JWT configuration (Issuer, Audience, Key) and system clock skew.
- Migrations fail: ensure the EF tools are installed and the correct project is specified.

Contact

For questions about the backend implementation, contact the repository maintainer: luizgdsmdev via GitHub.

---

Notes

This document is intentionally comprehensive and covers typical backend concerns. 
Review and adapt the configuration examples (project names, connection strings, ports) to match the actual code in this repository. 
Update API endpoints and payload examples to reflect the real domain models implemented in the project.
