import { User } from './User';
import { Project } from './Project';
import { Task } from './Task';

// User <-> Project (one user owns many projects)
User.hasMany(Project, { foreignKey: 'ownerId', as: 'projects', onDelete: 'CASCADE' });
Project.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// Project <-> Task (one project has many tasks)
Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks', onDelete: 'CASCADE' });
Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

export { User, Project, Task };
