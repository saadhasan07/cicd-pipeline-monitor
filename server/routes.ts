import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProjectSchema, 
  insertPipelineSchema, 
  insertDeploymentSchema, 
  insertMetricSchema,
  type Deployment
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

  // Update blue/green deployment traffic percentage
  app.patch("/api/deployments/:id/traffic", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid deployment ID"
        });
      }
      
      const { trafficPercentage, isActive, previousDeploymentId } = req.body;
      if (trafficPercentage === undefined) {
        return res.status(400).json({
          success: false,
          message: "Traffic percentage is required"
        });
      }
      
      // Validate traffic percentage is between 0 and 100
      if (trafficPercentage < 0 || trafficPercentage > 100) {
        return res.status(400).json({
          success: false,
          message: "Traffic percentage must be between 0 and 100"
        });
      }
      
      const deployment = await storage.getDeploymentById(id);
      if (!deployment) {
        return res.status(404).json({
          success: false,
          message: "Deployment not found"
        });
      }
      
      // Ensure this is a blue/green deployment
      if (deployment.deploymentStrategy !== 'blue_green') {
        return res.status(400).json({
          success: false,
          message: "This deployment is not configured for blue/green deployment strategy"
        });
      }
      
      // Prepare update object with traffic percentage and optional isActive flag
      const updateData: Partial<Deployment> = { trafficPercentage };
      
      // If isActive is explicitly set, include it in the update
      if (isActive !== undefined) {
        updateData.isActive = isActive;
      }
      
      // If we're updating the previous deployment relationship, include it
      if (previousDeploymentId !== undefined) {
        updateData.previousDeploymentId = previousDeploymentId;
      }
      
      const updatedDeployment = await storage.updateDeployment(id, updateData);
      if (!updatedDeployment) {
        return res.status(500).json({
          success: false,
          message: "Failed to update deployment traffic"
        });
      }
      
      // If we're setting this deployment to active, and we have a previous deployment,
      // update the previous deployment to be inactive
      if (isActive === true && deployment.previousDeploymentId) {
        await storage.updateDeployment(deployment.previousDeploymentId, { 
          isActive: false,
          trafficPercentage: 0
        });
      }
      
      res.status(200).json({
        success: true,
        data: updatedDeployment
      });
    } catch (error) {
      console.error("Error updating deployment traffic:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
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
  
  // Get metrics dashboard data
  app.get("/api/metrics/dashboard", isAuthenticated, async (req: Request, res: Response) => {
    try {
      // Get all deployments for calculating metrics
      const deployments = await storage.getAllDeployments();
      
      // Calculate deployment metrics by date (last 7 days)
      const today = new Date();
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (6 - i));
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      });
      
      // Initialize metrics for each day
      const deploymentsByDate = last7Days.map(date => ({
        date,
        count: 0,
        successful: 0,
        failed: 0,
        environment: ''
      }));
      
      // Calculate environment stats
      const environments = ['Production', 'Staging', 'Testing', 'Development'];
      const environmentStats = environments.map(name => ({
        name,
        deployments: 0,
        successRate: 0
      }));
      
      // Calculate status distribution
      const statusColors = {
        'success': '#00C49F',
        'failed': '#FF8042',
        'running': '#0088FE',
        'pending': '#FFBB28'
      };
      const statusDistribution = Object.entries(statusColors).map(([status, color]) => ({
        status,
        count: 0,
        color
      }));
      
      // Calculate build times
      const buildTimes = last7Days.map(date => ({
        date,
        environment: 'All',
        averageBuildTime: 0
      }));
      
      // Deployment frequency
      const deploymentFrequency = last7Days.map(date => ({
        date,
        count: 0
      }));
      
      // Process deployments to calculate metrics
      const successfulByEnv: Record<string, number> = {};
      const totalByEnv: Record<string, number> = {};
      const buildTimesByDate: Record<string, number[]> = {};
      
      deployments.forEach(deployment => {
        // Skip deployments older than 7 days
        const deploymentDate = new Date(deployment.startedAt).toISOString().split('T')[0];
        if (!last7Days.includes(deploymentDate)) return;
        
        // Count by date
        const dateIndex = last7Days.indexOf(deploymentDate);
        if (dateIndex >= 0) {
          deploymentsByDate[dateIndex].count++;
          deploymentFrequency[dateIndex].count++;
          
          if (deployment.status === 'success') {
            deploymentsByDate[dateIndex].successful++;
          } else if (deployment.status === 'failed') {
            deploymentsByDate[dateIndex].failed++;
          }
        }
        
        // Count by environment
        const envIndex = environments.indexOf(deployment.environment);
        if (envIndex >= 0) {
          environmentStats[envIndex].deployments++;
          
          // Track success rate by environment
          if (!totalByEnv[deployment.environment]) {
            totalByEnv[deployment.environment] = 0;
            successfulByEnv[deployment.environment] = 0;
          }
          
          totalByEnv[deployment.environment]++;
          if (deployment.status === 'success') {
            successfulByEnv[deployment.environment]++;
          }
        }
        
        // Count by status
        const statusIndex = statusDistribution.findIndex(s => s.status === deployment.status);
        if (statusIndex >= 0) {
          statusDistribution[statusIndex].count++;
        }
        
        // Track build times
        if (deployment.buildDuration) {
          if (!buildTimesByDate[deploymentDate]) {
            buildTimesByDate[deploymentDate] = [];
          }
          buildTimesByDate[deploymentDate].push(deployment.buildDuration);
        }
      });
      
      // Calculate environment success rates
      environments.forEach((env, index) => {
        if (totalByEnv[env] && totalByEnv[env] > 0) {
          const successRate = (successfulByEnv[env] / totalByEnv[env]) * 100;
          environmentStats[index].successRate = Math.round(successRate);
        }
      });
      
      // Calculate average build times
      Object.entries(buildTimesByDate).forEach(([date, times]) => {
        const dateIndex = last7Days.indexOf(date);
        if (dateIndex >= 0 && times.length > 0) {
          const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
          buildTimes[dateIndex].averageBuildTime = avgTime;
        }
      });
      
      // Return all metrics data
      res.status(200).json({
        success: true,
        data: {
          deploymentsByDate,
          buildTimes,
          statusDistribution,
          environmentStats,
          deploymentFrequency
        }
      });
      
    } catch (error) {
      console.error("Error generating metrics data:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

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

  // ==== Notifications Routes ====
  
  // Get notifications
  app.get("/api/notifications", isAuthenticated, async (req: Request, res: Response) => {
    try {
      // In a real implementation, we would fetch notifications from the database
      // For now, we'll return a hardcoded list of demo notifications
      const now = new Date();
      
      const notifications = [
        {
          id: 1,
          type: 'success',
          title: 'Deployment Completed',
          message: 'Deployment to production completed successfully',
          timestamp: new Date(now.getTime() - 1000 * 60 * 15).toISOString(),
          read: false,
          deploymentId: 12
        },
        {
          id: 2,
          type: 'warning',
          title: 'Approval Required',
          message: 'Production deployment #15 requires your approval',
          timestamp: new Date(now.getTime() - 1000 * 60 * 45).toISOString(),
          read: false,
          deploymentId: 15
        },
        {
          id: 3,
          type: 'error',
          title: 'Deployment Failed',
          message: 'Staging deployment failed due to test errors',
          timestamp: new Date(now.getTime() - 1000 * 60 * 120).toISOString(),
          read: true,
          deploymentId: 14
        },
        {
          id: 4,
          type: 'info',
          title: 'New Pipeline Created',
          message: `User ${req.user?.username || 'Alex'} created a new pipeline for Project B`,
          timestamp: new Date(now.getTime() - 1000 * 60 * 240).toISOString(),
          read: true
        }
      ];
      
      res.status(200).json({
        success: true,
        data: notifications
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });
  
  // Mark notification as read
  app.patch("/api/notifications/:id/read", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const notificationId = parseInt(req.params.id);
      if (isNaN(notificationId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid notification ID"
        });
      }
      
      // In a real implementation, we would update the database
      // For now, we'll just return success
      
      res.status(200).json({
        success: true,
        message: "Notification marked as read"
      });
    } catch (error) {
      console.error("Error updating notification:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });
  
  // Mark all notifications as read
  app.post("/api/notifications/read-all", isAuthenticated, async (req: Request, res: Response) => {
    try {
      // In a real implementation, we would update the database
      // For now, we'll just return success
      
      res.status(200).json({
        success: true,
        message: "All notifications marked as read"
      });
    } catch (error) {
      console.error("Error updating notifications:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
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
