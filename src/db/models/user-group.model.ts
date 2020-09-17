import sequelize, { DataTypes, Model } from 'sequelize';
import { TableNames } from '../constants';
import { sequelizeConnection } from '../connection';
import { UserModel } from './user.model';
import { GroupModel } from './group.model';

export class UserGroupModel extends Model {
  public userId!: string;
  public groupId!: string;
}

export const userGroupModelAttributes = {
  userId: {
    primaryKey: true,
    type: DataTypes.UUID,
    field: 'user_id',
    allowNull: false,
    references: {
      model: UserModel,
      key: 'id',
    },
  },
  groupId: {
    primaryKey: true,
    type: DataTypes.UUID,
    field: 'group_id',
    allowNull: false,
    references: {
      model: GroupModel,
      key: 'id',
    },
  },
};

export const userGroupModelOptions = {
  tableName: TableNames.USER_GROUPS,
  sequelize: sequelizeConnection,
  freezeTableName: true,
  timestamps: false,
  onDelete: 'CASCADE',
};
