import request from 'supertest';
import { app, registerAndLogin, createAdminDirectly } from './helpers';

describe('RBAC: Admin-only routes', () => {
  it('blocks members from accessing the admin users list', async () => {
    const { token } = await registerAndLogin();

    const res = await request(app).get('/api/v1/users').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it('allows admins to access the users list', async () => {
    const { token } = await createAdminDirectly();

    const res = await request(app).get('/api/v1/users').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('lets an admin access projects owned by other users', async () => {
    const { token: memberToken } = await registerAndLogin();
    const { token: adminToken } = await createAdminDirectly();

    const createRes = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${memberToken}`)
      .send({ title: 'Member Owned Project' });

    const projectId = createRes.body.data.id;

    const res = await request(app)
      .get(`/api/v1/projects/${projectId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Member Owned Project');
  });

  it('prevents self-promotion to admin via the register API', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Sneaky Admin',
      email: `sneaky_${Date.now()}@example.com`,
      password: 'StrongPass123',
      role: 'admin',
    });

    // Registration must succeed (extra field is stripped, not rejected)
    expect(res.status).toBe(201);
    // But the assigned role must be member, not admin
    expect(res.body.data.user.role).toBe('member');
  });
});
