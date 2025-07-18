const request = require('supertest');
const app = require('../server');
const Weight = require('../models/Weight');
// eslint-disable-next-line no-unused-vars
const User = require('../models/User');

describe('Weight Controller', () => {
  let token;
  let userId;

  beforeEach(async () => {
    // Create a test user and get token
    const userData = {
      email: 'test@example.com',
      password: 'TestPass123!'
    };

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(userData);

    token = registerResponse.body.token;
    userId = registerResponse.body._id;
  });

  describe('POST /api/weights', () => {
    it('should create a new weight entry with valid data', async () => {
      const weightData = {
        weight: 70.5,
        unit: 'kg',
        date: '2024-01-15',
        notes: 'Morning weight'
      };

      const response = await request(app)
        .post('/api/weights')
        .set('Authorization', `Bearer ${token}`)
        .send(weightData)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('weight', weightData.weight);
      expect(response.body).toHaveProperty('unit', weightData.unit);
      expect(response.body).toHaveProperty('userId', userId);
      expect(response.body).toHaveProperty('notes', weightData.notes);

      // Verify weight was saved in database
      const weight = await Weight.findById(response.body._id);
      expect(weight).toBeTruthy();
      expect(weight.weight).toBe(weightData.weight);
    });

    it('should not create weight entry without authentication', async () => {
      const weightData = {
        weight: 70.5,
        unit: 'kg'
      };

      const response = await request(app)
        .post('/api/weights')
        .send(weightData)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Not authorized, no token');
    });

    it('should not create weight entry with invalid weight', async () => {
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
    });

    it('should not create weight entry with invalid unit', async () => {
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
    });

    it('should not create weight entry with notes too long', async () => {
      const weightData = {
        weight: 70.5,
        unit: 'kg',
        notes: 'a'.repeat(501) // More than 500 characters
      };

      const response = await request(app)
        .post('/api/weights')
        .set('Authorization', `Bearer ${token}`)
        .send(weightData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Validation failed');
    });
  });

  describe('GET /api/weights', () => {
    beforeEach(async () => {
      // Create some test weight entries
      const weights = [
        { weight: 70.5, unit: 'kg', date: '2024-01-15', notes: 'Morning' },
        { weight: 71.0, unit: 'kg', date: '2024-01-16', notes: 'Evening' },
        { weight: 69.8, unit: 'kg', date: '2024-01-17', notes: 'Morning' }
      ];

      for (const weightData of weights) {
        await request(app)
          .post('/api/weights')
          .set('Authorization', `Bearer ${token}`)
          .send(weightData);
      }
    });

    it('should get all weight entries for authenticated user', async () => {
      const response = await request(app)
        .get('/api/weights')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body.weights)).toBe(true);
      expect(response.body.weights).toHaveLength(3);
      
      // Verify all entries belong to the user
      response.body.weights.forEach(weight => {
        expect(weight).toHaveProperty('userId', userId);
        expect(weight).toHaveProperty('weight');
        expect(weight).toHaveProperty('unit');
        expect(weight).toHaveProperty('date');
      });
    });

    it('should not get weight entries without authentication', async () => {
      const response = await request(app)
        .get('/api/weights')
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Not authorized, no token');
    });

    it('should return empty array for user with no weight entries', async () => {
      // Create a new user
      const newUserData = {
        email: 'newuser@example.com',
        password: 'TestPass123!'
      };

      const newUserResponse = await request(app)
        .post('/api/auth/register')
        .send(newUserData);

      const newToken = newUserResponse.body.token;

      const response = await request(app)
        .get('/api/weights')
        .set('Authorization', `Bearer ${newToken}`)
        .expect(200);

      expect(Array.isArray(response.body.weights)).toBe(true);
      expect(response.body.weights).toHaveLength(0);
    });
  });

  describe('PUT /api/weights/:id', () => {
    let weightId;

    beforeEach(async () => {
      // Create a test weight entry
      const weightData = {
        weight: 70.5,
        unit: 'kg',
        date: '2024-01-15',
        notes: 'Original note'
      };

      const response = await request(app)
        .post('/api/weights')
        .set('Authorization', `Bearer ${token}`)
        .send(weightData);

      weightId = response.body._id;
    });

    it('should update weight entry with valid data', async () => {
      const updateData = {
        weight: 71.2,
        unit: 'kg',
        notes: 'Updated note'
      };

      const response = await request(app)
        .put(`/api/weights/${weightId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('_id', weightId);
      expect(response.body).toHaveProperty('weight', updateData.weight);
      expect(response.body).toHaveProperty('notes', updateData.notes);
      expect(response.body).toHaveProperty('userId', userId);
    });

    it('should not update weight entry without authentication', async () => {
      const updateData = {
        weight: 71.2,
        unit: 'kg'
      };

      const response = await request(app)
        .put(`/api/weights/${weightId}`)
        .send(updateData)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Not authorized, no token');
    });

    it('should not update non-existent weight entry', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const updateData = {
        weight: 71.2,
        unit: 'kg'
      };

      const response = await request(app)
        .put(`/api/weights/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Weight entry not found');
    });

    it('should not update weight entry with invalid data', async () => {
      const updateData = {
        weight: -10,
        unit: 'kg'
      };

      const response = await request(app)
        .put(`/api/weights/${weightId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Validation failed');
    });
  });

  describe('DELETE /api/weights/:id', () => {
    let weightId;

    beforeEach(async () => {
      // Create a test weight entry
      const weightData = {
        weight: 70.5,
        unit: 'kg',
        date: '2024-01-15'
      };

      const response = await request(app)
        .post('/api/weights')
        .set('Authorization', `Bearer ${token}`)
        .send(weightData);

      weightId = response.body._id;
    });

    it('should delete weight entry', async () => {
      const response = await request(app)
        .delete(`/api/weights/${weightId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Weight entry deleted successfully');

      // Verify weight was deleted from database
      const weight = await Weight.findById(weightId);
      expect(weight).toBeNull();
    });

    it('should not delete weight entry without authentication', async () => {
      const response = await request(app)
        .delete(`/api/weights/${weightId}`)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Not authorized, no token');
    });

    it('should not delete non-existent weight entry', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .delete(`/api/weights/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Weight entry not found');
    });
  });
}); 