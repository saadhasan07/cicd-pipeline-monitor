import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProjectSchema, 
  insertPipelineSchema, 
  insertDeploymentSchema, 
  insertMetricSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { setupAuth, isAuthenticated, isAdmin } from "./auth";

// Helper function to handle validation errors
function handleValidationError(error: unknown, res: Response) {
  if (error instanceof ZodError) {
    const validationError = fromZodError(error);
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: validationError.details
    });
  } else {
    console.error("Server error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // ==== Project Routes ====
  
  // Get all projects
  app.get("/api/projects", isAuthenticated, async (_req: Request, res: Response) => {
    try {
      const projects = await storage.getAllProjects();
      res.status(200).json({
        success: true,
        data: projects
      });
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Get project by ID
  app.get("/api/projects/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID"
        });
      }
      
      const project = await storage.getProjectById(id);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found"
        });
      }
      
      res.status(200).json({
        success: true,
        data: project
      });
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Create project
  app.post("/api/projects", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const result = await storage.createProject(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Project created successfully",
        data: result
      });
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  // Update project
  app.patch("/api/projects/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID"
        });
      }

      const project = await storage.getProjectById(id);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found"
        });
      }

      const result = await storage.updateProject(id, req.body);
      res.status(200).json({
        success: true,
        message: "Project updated successfully",
        data: result
      });
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  // Delete project
  app.delete("/api/projects/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID"
        });
      }

      const project = await storage.getProjectById(id);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found"
        });
      }

      const result = await storage.deleteProject(id);
      res.status(200).json({
        success: true,
        message: "Project deleted successfully",
        data: { deleted: result }
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // ==== Pipeline Routes ====

  // Get all pipelines
  app.get("/api/pipelines", isAuthenticated, async (_req: Request, res: Response) => {
    try {
      const pipelines = await storage.getAllPipelines();
      res.status(200).json({
        success: true,
        data: pipelines
      });
    } catch (error) {
      console.error("Error fetching pipelines:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Get pipelines by project ID
  app.get("/api/projects/:projectId/pipelines", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.projectId);
      if (isNaN(projectId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID"
        });
      }
      
      const project = await storage.getProjectById(projectId);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found"
        });
      }
      
      const pipelines = await storage.getPipelinesByProjectId(projectId);
      res.status(200).json({
        success: true,
        data: pipelines
      });
    } catch (error) {
      console.error("Error fetching pipelines:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Get pipeline by ID
  app.get("/api/pipelines/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid pipeline ID"
        });
      }
      
      const pipeline = await storage.getPipelineById(id);
      if (!pipeline) {
        return res.status(404).json({
          success: false,
          message: "Pipeline not found"
        });
      }
      
      res.status(200).json({
        success: true,
        data: pipeline
      });
    } catch (error) {
      console.error("Error fetching pipeline:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Create pipeline
  app.post("/api/pipelines", isAuthenticated, async (req: Request, res: Response) => {
    try {
      // Add the current user as the creator
      const currentUser = req.user as Express.User;
      const pipelineData = {
        ...req.body,
        createdById: currentUser.id
      };

      const validatedData = insertPipelineSchema.parse(pipelineData);
      const result = await storage.createPipeline(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Pipeline created successfully",
        data: result
      });
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  // Update pipeline
  app.patch("/api/pipelines/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid pipeline ID"
        });
      }

      const pipeline = await storage.getPipelineById(id);
      if (!pipeline) {
        return res.status(404).json({
          success: false,
          message: "Pipeline not found"
        });
      }

      const result = await storage.updatePipeline(id, req.body);
      res.status(200).json({
        success: true,
        message: "Pipeline updated successfully",
        data: result
      });
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  // Delete pipeline
  app.delete("/api/pipelines/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid pipeline ID"
        });
      }

      const pipeline = await storage.getPipelineById(id);
      if (!pipeline) {
        return res.status(404).json({
          success: false,
          message: "Pipeline not found"
        });
      }

      const result = await storage.deletePipeline(id);
      res.status(200).json({
        success: true,
        message: "Pipeline deleted successfully",
        data: { deleted: result }
      });
    } catch (error) {
      console.error("Error deleting pipeline:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // ==== Deployment Routes ====

  // Get all deployments with optional limit
  app.get("/api/deployments", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const deployments = await storage.getAllDeployments(limit);
      res.status(200).json({
        success: true,
        data: deployments
      });
    } catch (error) {
      console.error("Error fetching deployments:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Get deployments by pipeline ID
  app.get("/api/pipelines/:pipelineId/deployments", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const pipelineId = parseInt(req.params.pipelineId);
      if (isNaN(pipelineId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid pipeline ID"
        });
      }
      
      const pipeline = await storage.getPipelineById(pipelineId);
      if (!pipeline) {
        return res.status(404).json({
          success: false,
          message: "Pipeline not found"
        });
      }
      
      const deployments = await storage.getDeploymentsByPipelineId(pipelineId);
      res.status(200).json({
        success: true,
        data: deployments
      });
    } catch (error) {
      console.error("Error fetching deployments:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Get deployments pending approval
  app.get("/api/deployments/approval", isAuthenticated, async (_req: Request, res: Response) => {
    try {
      const deployments = await storage.getDeploymentsForApproval();
      res.status(200).json({
        success: true,
        data: deployments
      });
    } catch (error) {
      console.error("Error fetching deployments for approval:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Get deployments by environment
  app.get("/api/deployments/environment/:environment", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const environment = req.params.environment;
      const deployments = await storage.getDeploymentsByEnvironment(environment);
      res.status(200).json({
        success: true,
        data: deployments
      });
    } catch (error) {
      console.error("Error fetching deployments by environment:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Get deployments by status
  app.get("/api/deployments/status/:status", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const status = req.params.status;
      const deployments = await storage.getDeploymentsByStatus(status);
      res.status(200).json({
        success: true,
        data: deployments
      });
    } catch (error) {
      console.error("Error fetching deployments by status:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Get deployment by ID
  app.get("/api/deployments/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid deployment ID"
        });
      }
      
      const deployment = await storage.getDeploymentById(id);
      if (!deployment) {
        return res.status(404).json({
          success: false,
          message: "Deployment not found"
        });
      }
      
      res.status(200).json({
        success: true,
        data: deployment
      });
    } catch (error) {
      console.error("Error fetching deployment:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Create deployment
  app.post("/api/deployments", isAuthenticated, async (req: Request, res: Response) => {
    try {
      // Add the current user as the trigger
      const currentUser = req.user as Express.User;
      const deploymentData = {
        ...req.body,
        triggeredById: currentUser.id
      };

      const validatedData = insertDeploymentSchema.parse(deploymentData);
      const result = await storage.createDeployment(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Deployment created successfully",
        data: result
      });
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  // Update deployment status
  app.patch("/api/deployments/:id/status", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid deployment ID"
        });
      }

      const deployment = await storage.getDeploymentById(id);
      if (!deployment) {
        return res.status(404).json({
          success: false,
          message: "Deployment not found"
        });
      }

      const { status } = req.body;
      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status is required"
        });
      }

      // If status is 'success' or 'failed', add completedAt
      const updateData: Partial<any> = { status };
      if (status === 'success' || status === 'failed') {
        updateData.completedAt = new Date();
        // Calculate build duration if applicable
        if (deployment.startedAt) {
          updateData.buildDuration = Math.floor(
            (updateData.completedAt.getTime() - new Date(deployment.startedAt).getTime()) / 1000
          );
        }
      }

      const result = await storage.updateDeployment(id, updateData);
      res.status(200).json({
        success: true,
        message: "Deployment status updated successfully",
        data: result
      });
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  // Update deployment logs
  app.patch("/api/deployments/:id/logs", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid deployment ID"
        });
      }

      const deployment = await storage.getDeploymentById(id);
      if (!deployment) {
        return res.status(404).json({
          success: false,
          message: "Deployment not found"
        });
      }

      const { logs } = req.body;
      if (!logs) {
        return res.status(400).json({
          success: false,
          message: "Logs are required"
        });
      }

      // Append to existing logs or create new logs
      const buildLogs = deployment.buildLogs 
        ? `${deployment.buildLogs}\n${logs}` 
        : logs;

      const result = await storage.updateDeployment(id, { buildLogs });
      res.status(200).json({
        success: true,
        message: "Deployment logs updated successfully",
        data: result
      });
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  // Approve deployment
  app.post("/api/deployments/:id/approve", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid deployment ID"
        });
      }

      const deployment = await storage.getDeploymentById(id);
      if (!deployment) {
        return res.status(404).json({
          success: false,
          message: "Deployment not found"
        });
      }

      if (!deployment.requiresApproval) {
        return res.status(400).json({
          success: false,
          message: "This deployment does not require approval"
        });
      }

      if (deployment.isApproved) {
        return res.status(400).json({
          success: false,
          message: "This deployment has already been approved"
        });
      }

      const currentUser = req.user as Express.User;
      const result = await storage.approveDeployment(id, currentUser.id);
      
      res.status(200).json({
        success: true,
        message: "Deployment approved successfully",
        data: result
      });
    } catch (error) {
      console.error("Error approving deployment:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // ==== Metrics Routes ====

  // Get metrics by deployment ID
  app.get("/api/deployments/:deploymentId/metrics", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const deploymentId = parseInt(req.params.deploymentId);
      if (isNaN(deploymentId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid deployment ID"
        });
      }
      
      const deployment = await storage.getDeploymentById(deploymentId);
      if (!deployment) {
        return res.status(404).json({
          success: false,
          message: "Deployment not found"
        });
      }
      
      const metrics = await storage.getMetricsByDeploymentId(deploymentId);
      res.status(200).json({
        success: true,
        data: metrics
      });
    } catch (error) {
      console.error("Error fetching metrics:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Create metric
  app.post("/api/metrics", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const validatedData = insertMetricSchema.parse(req.body);
      const result = await storage.createMetric(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Metric created successfully",
        data: result
      });
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  // ==== Users Routes ====

  // Get all users (admin only)
  app.get("/api/users", isAdmin, async (_req: Request, res: Response) => {
    try {
      const users = await storage.getAllUsers();
      
      // Don't send passwords back to client
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.status(200).json({
        success: true,
        data: usersWithoutPasswords
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
