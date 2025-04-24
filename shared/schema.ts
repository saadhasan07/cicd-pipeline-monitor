import { pgTable, text, serial, integer, boolean, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enums
export const deploymentStatusEnum = pgEnum('deployment_status', [
  'pending', 
  'running', 
  'success', 
  'failed', 
  'cancelled'
]);

export const environmentEnum = pgEnum('environment', [
  'development',
  'testing',
  'staging',
  'production'
]);

export const deploymentSlotEnum = pgEnum('deployment_slot', [
  'blue', 
  'green'
]);

export const deploymentStrategyEnum = pgEnum('deployment_strategy', [
  'direct',
  'blue_green',
  'canary',
  'rolling'
]);

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  role: text("role").default("developer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  pipelines: many(pipelines),
  deployments: many(deployments),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  role: true,
});

// Projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  repoUrl: text("repo_url").notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projectsRelations = relations(projects, ({ many }) => ({
  pipelines: many(pipelines),
}));

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true, 
  updatedAt: true,
});

// Pipelines table
export const pipelines = pgTable("pipelines", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  projectId: integer("project_id").notNull().references(() => projects.id),
  createdById: integer("created_by_id").notNull().references(() => users.id),
  configYaml: text("config_yaml").notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const pipelinesRelations = relations(pipelines, ({ one, many }) => ({
  project: one(projects, {
    fields: [pipelines.projectId],
    references: [projects.id],
  }),
  createdBy: one(users, {
    fields: [pipelines.createdById],
    references: [users.id],
  }),
  deployments: many(deployments),
}));

export const insertPipelineSchema = createInsertSchema(pipelines).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Deployments table
export const deployments = pgTable("deployments", {
  id: serial("id").primaryKey(),
  pipelineId: integer("pipeline_id").notNull().references(() => pipelines.id),
  environment: environmentEnum("environment").notNull(),
  status: deploymentStatusEnum("status").default("pending").notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  triggeredById: integer("triggered_by_id").references(() => users.id),
  commitSha: text("commit_sha").notNull(),
  commitMessage: text("commit_message"),
  buildLogs: text("build_logs"),
  buildDuration: integer("build_duration"),
  requiresApproval: boolean("requires_approval").default(false).notNull(),
  isApproved: boolean("is_approved").default(false),
  approvedById: integer("approved_by_id").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  // Blue/Green deployment fields
  deploymentStrategy: deploymentStrategyEnum("deployment_strategy").default("direct").notNull(),
  slot: deploymentSlotEnum("slot"),
  isActive: boolean("is_active").default(false),
  trafficPercentage: integer("traffic_percentage").default(0),
  healthCheckUrl: text("health_check_url"),
  healthCheckStatus: text("health_check_status"),
  previousDeploymentId: integer("previous_deployment_id"),
});

export const deploymentsRelations = relations(deployments, ({ one }) => ({
  pipeline: one(pipelines, {
    fields: [deployments.pipelineId],
    references: [pipelines.id],
  }),
  triggeredBy: one(users, {
    fields: [deployments.triggeredById],
    references: [users.id],
  }),
  approvedBy: one(users, {
    fields: [deployments.approvedById],
    references: [users.id],
  }),
  previousDeployment: one(deployments, {
    fields: [deployments.previousDeploymentId],
    references: [deployments.id],
  }),
}));

export const insertDeploymentSchema = createInsertSchema(deployments).omit({
  id: true,
  completedAt: true,
  buildLogs: true,
  buildDuration: true,
  isApproved: true,
  approvedById: true,
  approvedAt: true,
  // Skip additional fields which are managed by the system
  isActive: true,
  healthCheckStatus: true,
});

// Metrics table
export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  deploymentId: integer("deployment_id").notNull().references(() => deployments.id),
  name: text("name").notNull(),
  value: text("value").notNull(),
  unit: text("unit"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const metricsRelations = relations(metrics, ({ one }) => ({
  deployment: one(deployments, {
    fields: [metrics.deploymentId],
    references: [deployments.id],
  }),
}));

export const insertMetricSchema = createInsertSchema(metrics).omit({
  id: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertPipeline = z.infer<typeof insertPipelineSchema>;
export type Pipeline = typeof pipelines.$inferSelect;

export type InsertDeployment = z.infer<typeof insertDeploymentSchema>;
export type Deployment = typeof deployments.$inferSelect;

export type InsertMetric = z.infer<typeof insertMetricSchema>;
export type Metric = typeof metrics.$inferSelect;
