# Got It Tracker Frontend

A modern React and TypeScript frontend for managing transactions, participants, playgrounds, approvals, and reports. The interface is designed to provide a responsive and well-organized experience for financial tracking and group administration.

## Overview

The project includes a main dashboard with:

- transaction registration and tracking;
- management of people and members;
- creation and configuration of playgrounds;
- approval and validation workflows;
- reporting and financial summary views;
- support for multiple languages (Portuguese and English);
- local data persistence through localStorage.

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Motion for animations
- Lucide React for icons
- Node.js for local development

## Requirements

Before getting started, make sure you have installed:

- Node.js 18 or higher
- npm or pnpm
- a backend compatible with the API expected by the frontend

## Project structure

The main organization is as follows:

- src/components: application screens and visual components
- src/services: API integration and communication logic
- src/types.ts: core data models used throughout the application
- src/data.ts: initial seed data and development mocks
- src/translations.ts: localization text content
- src/utils.ts: reusable helper functions

## Local development

1. Clone the repository:

   ```bash
   git clone https://github.com/luizgdsmdev/got-it-tracker.git
   cd got-it-tracker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development environment:

   ```bash
   npm run dev
   ```

4. Open the application in your browser at:

   ```text
   http://localhost:3000
   ```

## Available scripts

- npm run dev: starts the Vite development server
- npm run build: creates a production build
- npm run preview: previews the build locally
- npm run lint: validates TypeScript types
- npm run clean: removes temporary build files

## API configuration

The frontend expects a backend API running at:

```ts
https://localhost:7189/api/
```

This endpoint is defined in src/services/api.ts. If the backend runs on a different port or domain, update the BASE_URL constant before running the project.

## Main features

### Dashboard

A central view with an overview of transactions, balance, and recent activity.

### People management

Create, edit, and view participants within the application.

### Playgrounds

Create and organize shared spaces with configurable rules.

### Approvals

A workflow to review and approve or reject transaction requests.

### Reports

Display totals, breakdowns, and comparisons for financial analysis.

## Development best practices

- keep components small and reusable;
- centralize API calls in src/services;
- use the types from src/types.ts to avoid inconsistencies;
- prefer predictable state updates;
- test interface changes and core flows before release.

## Important notes

- Data can be persisted in the browser through localStorage during local use.
- Authentication depends on a compatible backend and locally stored tokens.
- For production environments, it is recommended to review storage strategy and authentication security.

## Contribution

To contribute to the project:

1. create a branch for your change;
2. implement the update with a focus on usability and quality;
3. validate it with build and type verification;
4. open a pull request with a clear description of the context and impact.
