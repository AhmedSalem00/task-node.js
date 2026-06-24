import request from 'supertest';
import { app } from './helpers';

describe('Auth API', () => {
  describe('POST /api/v1/auth/register', () => {
    it('registers a new user and returns a token', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Alice Example',
        email: `alice_${Date.now()}@example.com`,
        password: 'StrongPass123',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toContain('alice_');
      expect(res.body.data.user.password).toBeUndefined();
    });

    it('always assigns role "member" regardless of body payload', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Role Escalation Attempt',
        email: `escalate_${Date.now()}@example.com`,
        password: 'StrongPass123',
        role: 'admin', // must be silently ignored
      });

      expect(res.status).toBe(201);
      expect(res.body.data.user.role).toBe('member');
    });

    it('rejects duplicate emails with 409', async () => {
      const email = `dup_${Date.now()}@example.com`;
      await request(app).post('/api/v1/auth/register').send({
        name: 'Bob',
        email,
        password: 'StrongPass123',
      });

      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Bob Again',
        email,
        password: 'StrongPass123',
      });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('rejects invalid input with 400', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'X',
        email: 'not-an-email',
        password: '123',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(Array.isArray(res.body.details)).toBe(true);
    });

    it('rejects passwords shorter than 8 characters with 400', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Short Pass',
        email: `short_${Date.now()}@example.com`,
        password: 'abc123',
      });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('logs in with correct credentials', async () => {
      const email = `login_${Date.now()}@example.com`;
      const password = 'StrongPass123';

      await request(app).post('/api/v1/auth/register').send({ name: 'Login User', email, password });

      const res = await request(app).post('/api/v1/auth/login').send({ email, password });

      expect(res.status).toBe(200);
      expect(res.body.data.token).toBeDefined();
    });

    it('rejects incorrect password with 401', async () => {
      const email = `loginfail_${Date.now()}@example.com`;
      await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'Fail User', email, password: 'CorrectPass123' });

      const res = await request(app).post('/api/v1/auth/login').send({ email, password: 'WrongPass123' });

      expect(res.status).toBe(401);
    });

    it('rejects unknown email with 401', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'doesnotexist@example.com', password: 'whatever123' });

      expect(res.status).toBe(401);
    });
  });
});
