process.env.NODE_ENV = 'test';

import { sequelize } from '../src/config/database';
import '../src/models';

beforeAll(async () => {
  // Recreate schema fresh for the test database before the suite runs.
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});
