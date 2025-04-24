import { 
  users, type User, type InsertUser,
  projects, type Project, type InsertProject,
  contactForms, type ContactForm, type InsertContactForm 
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project methods
  getAllProjects(): Promise<Project[]>;
  getProjectById(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Contact form methods
  saveContactForm(contactForm: InsertContactForm): Promise<ContactForm>;
  getContactForms(): Promise<ContactForm[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private contactForms: Map<number, ContactForm>;
  
  private userIdCounter: number;
  private projectIdCounter: number;
  private contactFormIdCounter: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.contactForms = new Map();
    
    this.userIdCounter = 1;
    this.projectIdCounter = 1;
    this.contactFormIdCounter = 1;
    
    // Initialize with some demo data
    this.initializeData();
  }

  private initializeData() {
    // Initialize demo projects
    const demoProjects: InsertProject[] = [
      {
        title: "Containerized App CI/CD Pipeline",
        description: "A comprehensive CI/CD pipeline for a containerized application, featuring automated testing, security scanning, and deployment to Kubernetes.",
        status: "completed",
        type: "GitHub Repository",
        features: ["GitHub Actions workflow for CI/CD pipeline", "Docker containerization with multi-stage builds", "Automated testing (unit, integration, E2E)", "Kubernetes deployment with Helm charts", "Prometheus & Grafana monitoring stack"],
        technologies: ["Docker", "GitHub Actions", "Kubernetes", "Terraform", "Prometheus"],
        link: "https://github.com/demo/cicd-pipeline",
        linkText: "View GitHub Repository",
        codeSnippet: null
      },
      {
        title: "Infrastructure as Code - AWS Environment",
        description: "A complete AWS infrastructure setup using Terraform with multi-environment support (dev, staging, production) and automated deployment.",
        status: "in-progress",
        type: "AWS-based Project",
        features: ["Terraform modules for reusable components", "Multi-account AWS architecture", "VPC, networking, and security groups", "ECS/EKS cluster for containerized workloads", "RDS databases with automated backups", "CI/CD pipeline for infrastructure changes", "CloudWatch/Grafana monitoring dashboards", "Cost optimization and tagging strategy"],
        technologies: ["Terraform", "AWS", "GitHub Actions", "CloudWatch", "ECS/EKS"],
        link: "https://github.com/demo/terraform-aws",
        linkText: "View Project Details",
        codeSnippet: `module "vpc" {\n  source  = "terraform-aws-modules/vpc/aws"\n  version = "~> 3.0"\n\n  name = "main-vpc-\${var.environment}"\n  cidr = "10.0.0.0/16"\n\n  azs             = ["us-west-2a", "us-west-2b", "us-west-2c"]\n  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]\n  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]\n\n  enable_nat_gateway     = true\n  single_nat_gateway     = var.environment != "production"\n  enable_vpn_gateway     = false\n  enable_dns_hostnames   = true\n  enable_dns_support     = true\n\n  tags = {\n    Environment = var.environment\n    Project     = var.project_name\n    ManagedBy   = "terraform"\n  }\n}`
      }
    ];
    
    demoProjects.forEach(project => this.createProject(project));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Project methods
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }
  
  async getProjectById(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }
  
  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectIdCounter++;
    const now = new Date();
    
    const project: Project = {
      ...insertProject,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    this.projects.set(id, project);
    return project;
  }
  
  async updateProject(id: number, projectUpdate: Partial<InsertProject>): Promise<Project | undefined> {
    const existingProject = this.projects.get(id);
    
    if (!existingProject) {
      return undefined;
    }
    
    const updatedProject: Project = {
      ...existingProject,
      ...projectUpdate,
      id,
      updatedAt: new Date()
    };
    
    this.projects.set(id, updatedProject);
    return updatedProject;
  }
  
  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }
  
  // Contact form methods
  async saveContactForm(insertContactForm: InsertContactForm): Promise<ContactForm> {
    const id = this.contactFormIdCounter++;
    const now = new Date();
    
    const contactForm: ContactForm = {
      ...insertContactForm,
      id,
      createdAt: now
    };
    
    this.contactForms.set(id, contactForm);
    return contactForm;
  }
  
  async getContactForms(): Promise<ContactForm[]> {
    return Array.from(this.contactForms.values());
  }
}

export const storage = new MemStorage();
