'use strict';

const ADMIN_ID = '11111111-1111-1111-1111-111111111111';
const MEMBER_ID = '22222222-2222-2222-2222-222222222222';

const PROJECT_1_ID = '33333333-3333-3333-3333-333333333333';
const PROJECT_2_ID = '44444444-4444-4444-4444-444444444444';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('projects', [
      {
        id: PROJECT_1_ID,
        title: 'Website Redesign',
        description: 'Revamp the marketing website with a new design system.',
        status: 'active',
        owner_id: MEMBER_ID,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: PROJECT_2_ID,
        title: 'Internal Tooling Migration',
        description: 'Migrate internal admin tools to the new platform.',
        status: 'active',
        owner_id: ADMIN_ID,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    await queryInterface.bulkInsert('tasks', [
      {
        id: '55555555-5555-5555-5555-555555555555',
        title: 'Design homepage mockup',
        description: 'Create high-fidelity mockups for the new homepage.',
        status: 'in_progress',
        priority: 'high',
        due_date: '2026-07-01',
        project_id: PROJECT_1_ID,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '66666666-6666-6666-6666-666666666666',
        title: 'Set up CI pipeline',
        description: 'Configure GitHub Actions for lint, test, and build.',
        status: 'pending',
        priority: 'medium',
        due_date: '2026-07-10',
        project_id: PROJECT_1_ID,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '77777777-7777-7777-7777-777777777777',
        title: 'Audit admin tool permissions',
        description: 'Review current role permissions before migration.',
        status: 'done',
        priority: 'high',
        due_date: '2026-06-20',
        project_id: PROJECT_2_ID,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('tasks', {
      project_id: [PROJECT_1_ID, PROJECT_2_ID],
    });
    await queryInterface.bulkDelete('projects', {
      id: [PROJECT_1_ID, PROJECT_2_ID],
    });
  },
};
