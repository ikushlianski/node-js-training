import { DataTypes, Model } from 'sequelize';
import { TableNames } from '../constants';
import { sequelizeConnection } from '../connection';
import { GroupPermission } from '../../entities/group';

export class GroupModel extends Model {
  public id!: string;
  public name!: string;
  public permissions!: GroupPermission[];
}

export const groupModelAttributes = {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  name: {
    type: new DataTypes.STRING(255),
    allowNull: false,
  },
  permissions: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
};

export const groupModelOptions = {
  tableName: TableNames.GROUPS,
  sequelize: sequelizeConnection,
  freezeTableName: true,
  timestamps: false,
  modelName: 'Group',
};
