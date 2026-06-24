import request from 'supertest';
import { app, registerAndLogin } from './helpers';

describe('Projects API', () => {
  it('rejects requests without a token with 401', async () => {
    const res = await request(app).get('/api/v1/projects');
    expect(res.status).toBe(401);
  });

  it('creates a project for the authenticated user', async () => {
    const { token } = await registerAndLogin();

    const res = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'My Project', description: 'A test project', status: 'active' });

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe('My Project');
    expect(res.body.data.status).toBe('active');
  });

  it('rejects project creation with invalid input', async () => {
    const { token } = await registerAndLogin();

    const res = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'X' });

    expect(res.status).toBe(400);
  });

  it('lists only the projects owned by the requesting user', async () => {
    const { token: tokenA } = await registerAndLogin();
    const { token: tokenB } = await registerAndLogin();

    await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ title: 'Project Owned By A' });

    await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ title: 'Project Owned By B' });

    const res = await request(app).get('/api/v1/projects').set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    const titles = res.body.data.map((p: { title: string }) => p.title);
    expect(titles).toContain('Project Owned By A');
    expect(titles).not.toContain('Project Owned By B');
  });

  it('returns 404 when fetching a project that does not exist', async () => {
    const { token } = await registerAndLogin();
    const res = await request(app)
      .get('/api/v1/projects/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it("prevents a member from accessing another member’s project", async () => {
    const { token: tokenA } = await registerAndLogin();
    const { token: tokenB } = await registerAndLogin();

    const createRes = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ title: 'Private Project' });

    const projectId = createRes.body.data.id;

    const res = await request(app)
      .get(`/api/v1/projects/${projectId}`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(res.status).toBe(403);
  });

  it('updates a project owned by the requester', async () => {
    const { token } = await registerAndLogin();

    const createRes = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Old Title' });

    const projectId = createRes.body.data.id;

    const updateRes = await request(app)
      .put(`/api/v1/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New Title', status: 'completed' });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.title).toBe('New Title');
    expect(updateRes.body.data.status).toBe('completed');
  });

  it('deletes a project owned by the requester', async () => {
    const { token } = await registerAndLogin();

    const createRes = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'To Be Deleted' });

    const projectId = createRes.body.data.id;

    const deleteRes = await request(app)
      .delete(`/api/v1/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteRes.status).toBe(200);

    const getRes = await request(app)
      .get(`/api/v1/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getRes.status).toBe(404);
  });
});
