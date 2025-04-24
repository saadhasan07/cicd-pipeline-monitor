# DevOps Portfolio Project

A comprehensive CI/CD and DevOps portfolio project showcasing GitHub Actions, automated testing, and deployment to Replit.

## Features

- **CI/CD Pipeline**: Complete GitHub Actions workflows for continuous integration and deployment
- **Automated Testing**: Comprehensive test coverage for both frontend and backend components
- **Infrastructure as Code**: Examples of Terraform configurations for AWS infrastructure
- **Monitoring Setup**: Sample monitoring dashboards and configurations
- **Deployment Automation**: Automatic deployment to Replit

## Tech Stack

### Frontend
- React
- Tailwind CSS
- Shadcn UI components
- React Query for data fetching

### Backend
- Express.js
- In-memory storage
- Jest for testing

### DevOps Tools
- GitHub Actions for CI/CD
- Replit for hosting
- GitHub for version control

## CI/CD Pipeline

This project implements a complete CI/CD pipeline using GitHub Actions:

1. **Continuous Integration**:
   - Linting and type checking
   - Automated tests for frontend and backend
   - Security scanning with npm audit and Snyk
   - Build validation

2. **Continuous Deployment**:
   - Automated deployment to Replit
   - Deployment notifications via Slack

### CI/CD Workflow

```mermaid
graph TD
    A[Code Commit] --> B[Lint & Type Check]
    B --> C1[Frontend Tests]
    B --> C2[Backend Tests]
    C1 --> D[Security Scan]
    C2 --> D
    D --> E[Build]
    E --> F[Deploy to Replit]
    F --> G[Notify Team]
