import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export type ProjectStatus = 'active' | 'completed' | 'archived';

export interface ProjectAttributes {
  id: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  ownerId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProjectCreationAttributes = Optional<
  ProjectAttributes,
  'id' | 'description' | 'status' | 'createdAt' | 'updatedAt'
>;

export class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
  public id!: string;
  public title!: string;
  public description!: string | null;
  public status!: ProjectStatus;
  public ownerId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Project.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'archived'),
      allowNull: false,
      defaultValue: 'active',
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'owner_id',
    },
  },
  {
    sequelize,
    tableName: 'projects',
    modelName: 'Project',
  }
);
