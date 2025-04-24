# CI/CD Pipeline Monitor

A modern web application for monitoring and managing CI/CD pipelines, deployments, and DevOps activities.

![CI/CD Pipeline Monitor](generated-icon.png)

## Features

- **Real-time Pipeline Monitoring**: Track the status of CI/CD pipelines with animated visualizations
- **Blue/Green Deployment Strategy**: Control and monitor blue/green deployments with traffic shifting
- **Comprehensive Metrics Dashboard**: Visualize deployment statistics, build times, and success rates
- **Environment Management**: Monitor deployments across multiple environments (Development, Testing, Staging, Production)
- **Notification System**: Real-time notifications for deployment events, approvals, and failures
- **User Authentication**: Secure login system with role-based access control
- **Interactive UI**: Modern, responsive design with animations and a professional look and feel

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn UI, Recharts, Framer Motion
- **Backend**: Node.js, Express.js, PostgreSQL, Drizzle ORM
- **Authentication**: Passport.js with session-based authentication
- **State Management**: React Query for server state, React hooks for local state
- **Styling**: TailwindCSS with custom animations and UI components

## Getting Started

### Prerequisites

- Node.js (v16+)
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/saadhasan07/cicd-pipeline-monitor.git
   cd cicd-pipeline-monitor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/cicd_monitor
   SESSION_SECRET=your_session_secret
   ```

4. Set up the database:
   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Features in Detail

### Blue/Green Deployment Visualization

The application includes a visual representation of blue/green deployments with traffic shifting capabilities. Users can:
- Monitor the status of both blue and green environments
- Control traffic distribution between environments
- View health metrics for each deployment slot

### Metrics Dashboard

The metrics dashboard provides comprehensive insights including:
- Deployment frequency over time
- Success/failure rates by environment
- Average build times
- Deployment status distribution
- Environment comparison stats

### Notification System

The notification center keeps users informed about important events:
- Deployment completions and failures
- Approval requests
- Pipeline changes
- Build status updates

## Screenshots

*Insert screenshots here*

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
