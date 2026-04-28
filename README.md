# CI/CD Pipeline Monitor

[![Continuous Integration](https://github.com/saadhasan07/cicd-pipeline-monitor/actions/workflows/ci.yml/badge.svg)](https://github.com/saadhasan07/cicd-pipeline-monitor/actions/workflows/ci.yml)
[![Preview](https://github.com/saadhasan07/cicd-pipeline-monitor/actions/workflows/preview.yml/badge.svg)](https://github.com/saadhasan07/cicd-pipeline-monitor/actions/workflows/preview.yml)

A full-stack dashboard concept for tracking software delivery health, deployments, approval gates, and release visibility across environments.

## Live Preview

- Product preview: [https://saadhasan07.github.io/cicd-pipeline-monitor/](https://saadhasan07.github.io/cicd-pipeline-monitor/)
- Repository: [https://github.com/saadhasan07/cicd-pipeline-monitor](https://github.com/saadhasan07/cicd-pipeline-monitor)
- Actions: [https://github.com/saadhasan07/cicd-pipeline-monitor/actions](https://github.com/saadhasan07/cicd-pipeline-monitor/actions)

## What This Project Shows

- Pipeline health and deployment visibility in one place
- A frontend built with React, TypeScript, Tailwind, and shadcn/ui
- An Express backend prepared for authentication, sessions, and API routes
- A professional GitHub Actions setup for validation and preview publishing
- A static GitHub Pages experience so visitors can understand the product without local setup

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion, Recharts
- Backend: Node.js, Express, PostgreSQL, Drizzle ORM
- Authentication: Passport with session-based flows
- Tooling: GitHub Actions, npm, TypeScript, esbuild

## CI/CD Setup

The repository now includes two GitHub Actions workflows:

1. `Continuous Integration`
   Runs dependency installation, TypeScript validation, and a production build on every push to `main`, every pull request to `main`, and manual dispatches.
2. `Preview`
   Publishes a polished static product preview to GitHub Pages so recruiters, teammates, and other visitors can explore the project quickly.

This keeps the public preview reliable while the full application remains free to use real authentication, APIs, and database-backed behavior.

## Local Development

### Prerequisites

- Node.js 20+
- PostgreSQL

### Setup

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Create a `.env` file in the project root.
4. Add at least these values:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/cicd_monitor
SESSION_SECRET=your_session_secret
```

5. Push the schema with `npm run db:push`.
6. Start the app with `npm run dev`.

### Useful Scripts

- `npm run dev` starts the local full-stack app
- `npm run check` runs the TypeScript check
- `npm run build` creates the production build
- `npm run ci` runs the same validation flow used in CI
- `npm run preview` serves the Vite production build locally

## Project Structure

- `client/` React frontend
- `server/` Express server and API routes
- `shared/` shared schema and types
- `preview/` static GitHub Pages preview
- `.github/workflows/` CI and deployment automation

## Preview Notes

The GitHub Pages site is a static walkthrough of the product. It is intentionally separate from the authenticated full-stack app so visitors can always see a stable preview without needing the backend, database, or login flow.

## License

This project is licensed under the MIT License.
