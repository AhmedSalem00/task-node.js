import request from 'supertest';
import bcrypt from 'bcrypt';
import { createApp } from '../src/app';
import { User } from '../src/models/User';
import { signToken } from '../src/utils/jwt';

export const app = createApp();

interface TestUser {
  name: string;
  email: string;
  password: string;
}

/** Registers a regular member via the API and returns the auth token. */
export const registerAndLogin = async (overrides: Partial<TestUser> = {}) => {
  const user: TestUser = {
    name: 'Test User',
    email: `user_${Date.now()}_${Math.random().toString(36).slice(2)}@example.com`,
    password: 'TestPass123',
    ...overrides,
  };

  const res = await request(app).post('/api/v1/auth/register').send(user);
  return { token: res.body.data.token as string, user: res.body.data.user, credentials: user };
};

/**
 * Creates an admin user directly in the database (bypasses the public API,
 * which intentionally disallows self-assigning admin role).
 */
export const createAdminDirectly = async (overrides: Partial<TestUser> = {}) => {
  const email =
    overrides.email ||
    `admin_${Date.now()}_${Math.random().toString(36).slice(2)}@example.com`;
  const password = overrides.password || 'AdminPass123';
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: overrides.name || 'Admin User',
    email,
    password: hashedPassword,
    role: 'admin',
  });

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  return { token, user: user.toSafeJSON(), credentials: { name: user.name, email, password } };
};
