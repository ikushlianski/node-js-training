import { Model, DataTypes } from 'sequelize';

import { sequelizeConnection } from '../connection';
import { TableNames } from '../constants';
import { GroupPermission } from '../../entities/group';

export class GroupModel extends Model {
  public id!: string;
  public name!: string;
  public permissions!: GroupPermission[];
}

GroupModel.init(
  {
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
  },
  {
    tableName: TableNames.GROUPS,
    sequelize: sequelizeConnection,
    freezeTableName: true,
    timestamps: false,
  },
);
