/**
 * Backend test suite for the DevOps Portfolio application
 */
import request from 'supertest';
import express from 'express';
import { registerRoutes } from '../server/routes';
import { storage } from '../server/storage';

describe('API Endpoints', () => {
  let app: express.Express;
  let server: any;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    server = await registerRoutes(app);
  });

  afterAll((done) => {
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });

  describe('POST /api/contact', () => {
    it('should create a new contact form submission', async () => {
      const formData = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'This is a test message'
      };

      const res = await request(app)
        .post('/api/contact')
        .send(formData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('submitted successfully');
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.name).toBe(formData.name);
      expect(res.body.data.email).toBe(formData.email);
    });

    it('should return validation error for incomplete data', async () => {
      const incompleteData = {
        name: 'Test User',
        // Missing email
        subject: 'Test Subject',
        message: 'This is a test message'
      };

      const res = await request(app)
        .post('/api/contact')
        .send(incompleteData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Validation error');
    });
  });

  describe('GET /api/projects', () => {
    it('should return all projects', async () => {
      const res = await request(app)
        .get('/api/projects')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/projects/:id', () => {
    it('should return a specific project by id', async () => {
      // First get all projects
      const allProjects = await request(app)
        .get('/api/projects')
        .expect(200);
      
      const firstProject = allProjects.body.data[0];
      
      // Now get the specific project
      const res = await request(app)
        .get(`/api/projects/${firstProject.id}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id', firstProject.id);
      expect(res.body.data.title).toBe(firstProject.title);
    });

    it('should return 404 for non-existent project', async () => {
      const res = await request(app)
        .get('/api/projects/9999')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('not found');
    });

    it('should return 400 for invalid id', async () => {
      const res = await request(app)
        .get('/api/projects/invalid')
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid project ID');
    });
  });
});
