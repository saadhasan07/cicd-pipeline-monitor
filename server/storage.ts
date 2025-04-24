import { 
  users, type User, type InsertUser,
  projects, type Project, type InsertProject,
  pipelines, type Pipeline, type InsertPipeline,
  deployments, type Deployment, type InsertDeployment,
  metrics, type Metric, type InsertMetric
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

// Define SessionStore type
type SessionStore = ReturnType<typeof connectPg> extends new (...args: any[]) => infer R ? R : never;

export interface IStorage {
  // Session store
  sessionStore: SessionStore;

  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Project methods
  getAllProjects(): Promise<Project[]>;
  getProjectById(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Pipeline methods
  getAllPipelines(): Promise<Pipeline[]>;
  getPipelinesByProjectId(projectId: number): Promise<Pipeline[]>;
  getPipelineById(id: number): Promise<Pipeline | undefined>;
  createPipeline(pipeline: InsertPipeline): Promise<Pipeline>;
  updatePipeline(id: number, pipeline: Partial<InsertPipeline>): Promise<Pipeline | undefined>;
  deletePipeline(id: number): Promise<boolean>;

  // Deployment methods
  getAllDeployments(limit?: number): Promise<Deployment[]>;
  getDeploymentsByPipelineId(pipelineId: number): Promise<Deployment[]>;
  getDeploymentById(id: number): Promise<Deployment | undefined>;
  getDeploymentsByEnvironment(environment: string): Promise<Deployment[]>;
  getDeploymentsByStatus(status: string): Promise<Deployment[]>;
  getDeploymentsForApproval(): Promise<Deployment[]>;
  getDeploymentsByDateRange(startDate: Date, endDate: Date): Promise<Deployment[]>;
  createDeployment(deployment: InsertDeployment): Promise<Deployment>;
  updateDeployment(id: number, deployment: Partial<Deployment>): Promise<Deployment | undefined>;
  approveDeployment(id: number, userId: number): Promise<Deployment | undefined>;
  
  // Metrics methods
  getMetricsByDeploymentId(deploymentId: number): Promise<Metric[]>;
  createMetric(metric: InsertMetric): Promise<Metric>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  sessionStore: SessionStore;

  constructor() {
    const PostgresSessionStore = connectPg(session);
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
  
  // Project methods
  async getAllProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }
  
  async getProjectById(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }
  
  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }
  
  async updateProject(id: number, projectData: Partial<InsertProject>): Promise<Project | undefined> {
    const [updatedProject] = await db
      .update(projects)
      .set({ ...projectData, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }
  
  async deleteProject(id: number): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id)).returning({ id: projects.id });
    return result.length > 0;
  }
  
  // Pipeline methods
  async getAllPipelines(): Promise<Pipeline[]> {
    return await db.select().from(pipelines);
  }

  async getPipelinesByProjectId(projectId: number): Promise<Pipeline[]> {
    return await db.select().from(pipelines).where(eq(pipelines.projectId, projectId));
  }

  async getPipelineById(id: number): Promise<Pipeline | undefined> {
    const [pipeline] = await db.select().from(pipelines).where(eq(pipelines.id, id));
    return pipeline;
  }

  async createPipeline(insertPipeline: InsertPipeline): Promise<Pipeline> {
    const [pipeline] = await db.insert(pipelines).values(insertPipeline).returning();
    return pipeline;
  }

  async updatePipeline(id: number, pipelineData: Partial<InsertPipeline>): Promise<Pipeline | undefined> {
    const [updatedPipeline] = await db
      .update(pipelines)
      .set({ ...pipelineData, updatedAt: new Date() })
      .where(eq(pipelines.id, id))
      .returning();
    return updatedPipeline;
  }

  async deletePipeline(id: number): Promise<boolean> {
    const result = await db.delete(pipelines).where(eq(pipelines.id, id)).returning({ id: pipelines.id });
    return result.length > 0;
  }

  // Deployment methods
  async getAllDeployments(limit?: number): Promise<Deployment[]> {
    const query = db.select().from(deployments).orderBy(desc(deployments.startedAt));
    
    if (limit) {
      return await query.limit(limit);
    }
    
    return await query;
  }

  async getDeploymentsByPipelineId(pipelineId: number): Promise<Deployment[]> {
    return await db
      .select()
      .from(deployments)
      .where(eq(deployments.pipelineId, pipelineId))
      .orderBy(desc(deployments.startedAt));
  }

  async getDeploymentById(id: number): Promise<Deployment | undefined> {
    const [deployment] = await db.select().from(deployments).where(eq(deployments.id, id));
    return deployment;
  }

  async getDeploymentsByEnvironment(environment: string): Promise<Deployment[]> {
    return await db
      .select()
      .from(deployments)
      .where(eq(deployments.environment, environment as any))
      .orderBy(desc(deployments.startedAt));
  }

  async getDeploymentsByStatus(status: string): Promise<Deployment[]> {
    return await db
      .select()
      .from(deployments)
      .where(eq(deployments.status, status as any))
      .orderBy(desc(deployments.startedAt));
  }

  async getDeploymentsForApproval(): Promise<Deployment[]> {
    return await db
      .select()
      .from(deployments)
      .where(
        and(
          eq(deployments.requiresApproval, true),
          eq(deployments.isApproved, false),
          eq(deployments.status, 'pending' as any)
        )
      )
      .orderBy(desc(deployments.startedAt));
  }

  async getDeploymentsByDateRange(startDate: Date, endDate: Date): Promise<Deployment[]> {
    return await db
      .select()
      .from(deployments)
      .where(
        and(
          gte(deployments.startedAt, startDate),
          lte(deployments.startedAt, endDate)
        )
      )
      .orderBy(desc(deployments.startedAt));
  }

  async createDeployment(insertDeployment: InsertDeployment): Promise<Deployment> {
    const [deployment] = await db.insert(deployments).values(insertDeployment).returning();
    return deployment;
  }

  async updateDeployment(id: number, deploymentData: Partial<Deployment>): Promise<Deployment | undefined> {
    const [updatedDeployment] = await db
      .update(deployments)
      .set(deploymentData)
      .where(eq(deployments.id, id))
      .returning();
    return updatedDeployment;
  }

  async approveDeployment(id: number, userId: number): Promise<Deployment | undefined> {
    const [updatedDeployment] = await db
      .update(deployments)
      .set({
        isApproved: true,
        approvedById: userId,
        approvedAt: new Date()
      })
      .where(eq(deployments.id, id))
      .returning();
    return updatedDeployment;
  }

  // Metrics methods
  async getMetricsByDeploymentId(deploymentId: number): Promise<Metric[]> {
    return await db
      .select()
      .from(metrics)
      .where(eq(metrics.deploymentId, deploymentId));
  }

  async createMetric(insertMetric: InsertMetric): Promise<Metric> {
    const [metric] = await db.insert(metrics).values(insertMetric).returning();
    return metric;
  }
}

export const storage = new DatabaseStorage();
