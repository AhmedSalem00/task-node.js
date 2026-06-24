'use strict';
const bcrypt = require('bcrypt');

const ADMIN_ID = '11111111-1111-1111-1111-111111111111';
const MEMBER_ID = '22222222-2222-2222-2222-222222222222';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash('Password123!', 12);

    await queryInterface.bulkInsert('users', [
      {
        id: ADMIN_ID,
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: MEMBER_ID,
        name: 'Member User',
        email: 'member@example.com',
        password: hashedPassword,
        role: 'member',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', {
      email: ['admin@example.com', 'member@example.com'],
    });
  },
};
