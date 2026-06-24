require('dotenv').config();

const base = {
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  dialect: process.env.DB_DIALECT || 'postgres',
};

module.exports = {
  development: {
    ...base,
    database: process.env.DB_NAME || 'project_task_db',
  },
  test: {
    ...base,
    database: process.env.DB_NAME_TEST || 'project_task_db_test',
    logging: false,
  },
  production: {
    ...base,
    database: process.env.DB_NAME || 'project_task_db',
    logging: false,
  },
};
