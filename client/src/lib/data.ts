import { Project, SkillCategory } from "./types";

// We'll create a component for this visualization in the Projects page instead
// as React JSX isn't directly supported in TypeScript files

export const projects: Project[] = [
  {
    id: 1,
    title: "Containerized App CI/CD Pipeline",
    description: "A comprehensive CI/CD pipeline for a containerized application, featuring automated testing, security scanning, and deployment to Kubernetes.",
    status: "completed",
    type: "GitHub Repository",
    features: [
      "GitHub Actions workflow for CI/CD pipeline",
      "Docker containerization with multi-stage builds",
      "Automated testing (unit, integration, E2E)",
      "Kubernetes deployment with Helm charts",
      "Prometheus & Grafana monitoring stack"
    ],
    technologies: ["Docker", "GitHub Actions", "Kubernetes", "Terraform", "Prometheus"],
    link: "#",
    linkText: "View GitHub Repository"
  },
  {
    id: 2,
    title: "Infrastructure as Code - AWS Environment",
    description: "A complete AWS infrastructure setup using Terraform with multi-environment support (dev, staging, production) and automated deployment.",
    status: "in-progress",
    type: "AWS-based Project",
    features: [
      "Terraform modules for reusable components",
      "Multi-account AWS architecture",
      "VPC, networking, and security groups",
      "ECS/EKS cluster for containerized workloads",
      "RDS databases with automated backups",
      "CI/CD pipeline for infrastructure changes",
      "CloudWatch/Grafana monitoring dashboards",
      "Cost optimization and tagging strategy"
    ],
    technologies: ["Terraform", "AWS", "GitHub Actions", "CloudWatch", "ECS/EKS"],
    link: "#",
    linkText: "View Project Details",
    codeSnippet: `module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 3.0"

  name = "main-vpc-\${var.environment}"
  cidr = "10.0.0.0/16"

  azs             = ["us-west-2a", "us-west-2b", "us-west-2c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway     = true
  single_nat_gateway     = var.environment != "production"
  enable_vpn_gateway     = false
  enable_dns_hostnames   = true
  enable_dns_support     = true

  tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "terraform"
  }
}`
  }
];

export const projectIdeas = [
  {
    title: "Microservices Deployment",
    description: "Implement a microservices architecture with service discovery, API gateway, and containerized deployment.",
    technologies: "Docker, Kubernetes, Istio",
    icon: "Package"
  },
  {
    title: "Security Automation",
    description: "Create a security automation pipeline for vulnerability scanning, compliance checks, and security remediation.",
    technologies: "OWASP ZAP, SonarQube, AWS Security Hub",
    icon: "Shield"
  },
  {
    title: "Database CI/CD",
    description: "Build a CI/CD pipeline for database schema changes with automated testing and rollback capabilities.",
    technologies: "Flyway, Liquibase, PostgreSQL",
    icon: "Database"
  },
  {
    title: "Monitoring & Alerting",
    description: "Set up a comprehensive monitoring stack with dashboards, alerts, and automated incident response.",
    technologies: "Prometheus, Grafana, AlertManager",
    icon: "BarChart"
  },
  {
    title: "GitOps Pipeline",
    description: "Implement GitOps principles with infrastructure and application deployment driven by Git repositories.",
    technologies: "ArgoCD, Flux, Kubernetes",
    icon: "GitBranch"
  },
  {
    title: "Infrastructure Testing",
    description: "Develop a comprehensive testing framework for infrastructure code with policy enforcement.",
    technologies: "Terratest, Checkov, OPA/Conftest",
    icon: "Boxes"
  }
];

export const skillCategories: SkillCategory[] = [
  {
    name: "CI/CD Tools",
    icon: "Code",
    skills: [
      { name: "Jenkins", percentage: 95 },
      { name: "GitHub Actions", percentage: 90 },
      { name: "GitLab CI", percentage: 85 },
      { name: "CircleCI", percentage: 80 },
      { name: "AWS CodePipeline", percentage: 75 }
    ]
  },
  {
    name: "Infrastructure as Code",
    icon: "Layers",
    skills: [
      { name: "Terraform", percentage: 95 },
      { name: "Ansible", percentage: 85 },
      { name: "CloudFormation", percentage: 80 },
      { name: "Pulumi", percentage: 75 },
      { name: "Helm", percentage: 70 }
    ]
  },
  {
    name: "Container Orchestration",
    icon: "Server",
    skills: [
      { name: "Docker", percentage: 90 },
      { name: "Kubernetes", percentage: 85 },
      { name: "AWS ECS", percentage: 80 },
      { name: "AWS EKS", percentage: 70 },
      { name: "OpenShift", percentage: 65 }
    ]
  },
  {
    name: "Security & Compliance",
    icon: "Shield",
    skills: [
      { name: "SAST/DAST", percentage: 85 },
      { name: "SonarQube", percentage: 80 },
      { name: "AWS Security Hub", percentage: 75 },
      { name: "OWASP ZAP", percentage: 70 },
      { name: "Trivy", percentage: 65 }
    ]
  },
  {
    name: "Monitoring & Observability",
    icon: "BarChart3",
    skills: [
      { name: "Prometheus", percentage: 90 },
      { name: "Grafana", percentage: 90 },
      { name: "ELK Stack", percentage: 85 },
      { name: "CloudWatch", percentage: 80 },
      { name: "Datadog", percentage: 75 }
    ]
  },
  {
    name: "Cloud Platforms",
    icon: "Cloud",
    skills: [
      { name: "AWS", percentage: 95 },
      { name: "Azure", percentage: 85 },
      { name: "GCP", percentage: 80 },
      { name: "Digital Ocean", percentage: 70 },
      { name: "Heroku", percentage: 65 }
    ]
  }
];
