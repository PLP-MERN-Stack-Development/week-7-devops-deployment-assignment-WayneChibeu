const request = require('supertest');
const app = require('../server');
// eslint-disable-next-line no-unused-vars
const jwt = require('jsonwebtoken');

describe('Middleware', () => {
  describe('Auth Middleware', () => {
    it('should allow access with valid token', async () => {
      // Create a test user
      const userData = {
        email: 'test@example.com',
        password: 'TestPass123!'
      };

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData);

      const token = registerResponse.body.token;

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('email', userData.email);
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Not authorized, no token');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Not authorized, token failed');
    });

    it('should reject request with malformed authorization header', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'InvalidFormat token')
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Not authorized, no token');
    });
  });

  describe('Validation Middleware', () => {
    describe('Registration Validation', () => {
      it('should reject registration with invalid email', async () => {
        const userData = {
          email: 'invalid-email',
          password: 'TestPass123!'
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(userData)
          .expect(400);

        expect(response.body).toHaveProperty('message', 'Validation failed');
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors.some(e => e.path === 'email')).toBe(true);
      });

      it('should reject registration with weak password', async () => {
        const userData = {
          email: 'test@example.com',
          password: 'weak'
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(userData)
          .expect(400);

        expect(response.body).toHaveProperty('message', 'Validation failed');
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors.some(e => e.path === 'password')).toBe(true);
      });

      it('should accept registration with valid data', async () => {
        const userData = {
          email: 'test@example.com',
          password: 'TestPass123!'
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(userData)
          .expect(201);

        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('email', userData.email);
        expect(response.body).toHaveProperty('token');
      });
    });

    describe('Weight Validation', () => {
      let token;

      beforeEach(async () => {
        const userData = {
          email: 'test@example.com',
          password: 'TestPass123!'
        };

        const registerResponse = await request(app)
          .post('/api/auth/register')
          .send(userData);

        token = registerResponse.body.token;
      });

      it('should reject weight entry with negative weight', async () => {
        const weightData = {
          weight: -10,
          unit: 'kg'
        };

        const response = await request(app)
          .post('/api/weights')
          .set('Authorization', `Bearer ${token}`)
          .send(weightData)
          .expect(400);

        expect(response.body).toHaveProperty('message', 'Validation failed');
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors.some(e => e.path === 'weight')).toBe(true);
      });

      it('should reject weight entry with invalid unit', async () => {
        const weightData = {
          weight: 70.5,
          unit: 'invalid'
        };

        const response = await request(app)
          .post('/api/weights')
          .set('Authorization', `Bearer ${token}`)
          .send(weightData)
          .expect(400);

        expect(response.body).toHaveProperty('message', 'Validation failed');
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors.some(e => e.path === 'unit')).toBe(true);
      });

      it('should reject weight entry with notes too long', async () => {
        const weightData = {
          weight: 70.5,
          unit: 'kg',
          notes: 'a'.repeat(501)
        };

        const response = await request(app)
          .post('/api/weights')
          .set('Authorization', `Bearer ${token}`)
          .send(weightData)
          .expect(400);

        expect(response.body).toHaveProperty('message', 'Validation failed');
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors.some(e => e.path === 'notes')).toBe(true);
      });

      it('should accept weight entry with valid data', async () => {
        const weightData = {
          weight: 70.5,
          unit: 'kg',
          notes: 'Valid notes'
        };

        const response = await request(app)
          .post('/api/weights')
          .set('Authorization', `Bearer ${token}`)
          .send(weightData)
          .expect(201);

        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('weight', weightData.weight);
        expect(response.body).toHaveProperty('unit', weightData.unit);
      });
    });

    describe('Activity Validation', () => {
      let token;

      beforeEach(async () => {
        const userData = {
          email: 'test@example.com',
          password: 'TestPass123!'
        };

        const registerResponse = await request(app)
          .post('/api/auth/register')
          .send(userData);

        token = registerResponse.body.token;
      });

      it('should reject activity entry with empty type', async () => {
        const activityData = {
          type: '',
          duration: 30,
          unit: 'minutes'
        };

        const response = await request(app)
          .post('/api/activities')
          .set('Authorization', `Bearer ${token}`)
          .send(activityData)
          .expect(400);

        expect(response.body).toHaveProperty('message', 'Validation failed');
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors.some(e => e.path === 'type')).toBe(true);
      });

      it('should reject activity entry with negative duration', async () => {
        const activityData = {
          type: 'Running',
          duration: -10,
          unit: 'minutes'
        };

        const response = await request(app)
          .post('/api/activities')
          .set('Authorization', `Bearer ${token}`)
          .send(activityData)
          .expect(400);

        expect(response.body).toHaveProperty('message', 'Validation failed');
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors.some(e => e.path === 'duration')).toBe(true);
      });

      it('should reject activity entry with invalid unit', async () => {
        const activityData = {
          type: 'Running',
          duration: 30,
          unit: 'invalid'
        };

        const response = await request(app)
          .post('/api/activities')
          .set('Authorization', `Bearer ${token}`)
          .send(activityData)
          .expect(400);

        expect(response.body).toHaveProperty('message', 'Validation failed');
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors.some(e => e.path === 'unit')).toBe(true);
      });

      it('should accept activity entry with valid data', async () => {
        const activityData = {
          type: 'Running',
          duration: 30,
          unit: 'minutes',
          caloriesBurned: 300
        };

        const response = await request(app)
          .post('/api/activities')
          .set('Authorization', `Bearer ${token}`)
          .send(activityData)
          .expect(201);

        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('type', activityData.type);
        expect(response.body).toHaveProperty('duration', activityData.duration);
        expect(response.body).toHaveProperty('unit', activityData.unit);
      });
    });
  });
}); 