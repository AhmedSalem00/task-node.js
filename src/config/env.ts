import dotenv from 'dotenv';

dotenv.config();

function requireEnv(key: string, minLength = 1): string {
  const val = process.env[key];
  if (!val || val.trim().length < minLength) {
    throw new Error(
      `Missing or invalid environment variable: ${key}` +
        (minLength > 1 ? ` (must be at least ${minLength} characters)` : '')
    );
  }
  return val.trim();
}

// Accepts Vercel-style duration strings: 60, 60s, 15m, 1h, 7d, etc.
function requireJwtExpiry(key: string): string {
  const val = process.env[key]?.trim();
  if (!val || !/^\d+[smhd]?$/.test(val)) {
    throw new Error(
      `Invalid environment variable: ${key} must be a number or duration string (e.g. 3600, 15m, 1h, 7d). Got: "${val}"`
    );
  }
  return val;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name:
      process.env.NODE_ENV === 'test'
        ? process.env.DB_NAME_TEST || 'project_task_db_test'
        : process.env.DB_NAME || 'project_task_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    dialect: (process.env.DB_DIALECT || 'postgres') as 'postgres',
  },

  jwt: {
    secret: requireEnv('JWT_SECRET', 32),
    expiresIn: requireJwtExpiry('JWT_EXPIRES_IN'),
  },

  cors: {
    origin: (process.env.CORS_ORIGIN || 'http://localhost:3000')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean),
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },

  authRateLimit: {
    windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || '900000', 10),
    max: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '20', 10),
  },
};
