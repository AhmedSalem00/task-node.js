import request from 'supertest';
import { app, registerAndLogin } from './helpers';

const createProject = async (token: string, title = 'Task Test Project') => {
  const res = await request(app)
    .post('/api/v1/projects')
    .set('Authorization', `Bearer ${token}`)
    .send({ title });
  return res.body.data.id as string;
};

describe('Tasks API', () => {
  it('creates a task under a project', async () => {
    const { token } = await registerAndLogin();
    const projectId = await createProject(token);

    const res = await request(app)
      .post(`/api/v1/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Write tests', priority: 'high', status: 'pending', dueDate: '2026-08-01' });

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe('Write tests');
    expect(res.body.data.priority).toBe('high');
  });

  it('returns 404 when creating a task under a non-existent project', async () => {
    const { token } = await registerAndLogin();

    const res = await request(app)
      .post('/api/v1/projects/00000000-0000-0000-0000-000000000000/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Orphan Task' });

    expect(res.status).toBe(404);
  });

  it('lists all tasks for a project', async () => {
    const { token } = await registerAndLogin();
    const projectId = await createProject(token);

    await request(app)
      .post(`/api/v1/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Task One' });
    await request(app)
      .post(`/api/v1/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Task Two' });

    const res = await request(app)
      .get(`/api/v1/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
    expect(res.body.pagination.totalItems).toBe(2);
  });

  it('filters tasks by status', async () => {
    const { token } = await registerAndLogin();
    const projectId = await createProject(token);

    await request(app)
      .post(`/api/v1/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Pending Task', status: 'pending' });
    await request(app)
      .post(`/api/v1/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Done Task', status: 'done' });

    const res = await request(app)
      .get(`/api/v1/projects/${projectId}/tasks?status=done`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toBe('Done Task');
  });

  it('filters tasks by priority', async () => {
    const { token } = await registerAndLogin();
    const projectId = await createProject(token);

    await request(app)
      .post(`/api/v1/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Low Priority', priority: 'low' });
    await request(app)
      .post(`/api/v1/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'High Priority', priority: 'high' });

    const res = await request(app)
      .get(`/api/v1/projects/${projectId}/tasks?priority=high`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toBe('High Priority');
  });

  it('updates a task status', async () => {
    const { token } = await registerAndLogin();
    const projectId = await createProject(token);

    const createRes = await request(app)
      .post(`/api/v1/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Task To Update' });

    const taskId = createRes.body.data.id;

    const updateRes = await request(app)
      .put(`/api/v1/projects/${projectId}/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'in_progress' });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.status).toBe('in_progress');
  });

  it('deletes a task', async () => {
    const { token } = await registerAndLogin();
    const projectId = await createProject(token);

    const createRes = await request(app)
      .post(`/api/v1/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Task To Delete' });

    const taskId = createRes.body.data.id;

    const deleteRes = await request(app)
      .delete(`/api/v1/projects/${projectId}/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteRes.status).toBe(200);

    const getRes = await request(app)
      .get(`/api/v1/projects/${projectId}/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getRes.status).toBe(404);
  });

  it("prevents a non-owner member from creating tasks in another user's project", async () => {
    const { token: tokenA } = await registerAndLogin();
    const { token: tokenB } = await registerAndLogin();
    const projectId = await createProject(tokenA);

    const res = await request(app)
      .post(`/api/v1/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ title: 'Sneaky Task' });

    expect(res.status).toBe(403);
  });
});
