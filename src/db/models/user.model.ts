import { DataTypes, Model } from 'sequelize';
import { TableNames } from '../constants';
import { sequelizeConnection } from '../connection';

export class UserModel extends Model {
  public id!: string;
  public login!: string;
  public password!: string;
  public age!: number;
  public is_deleted?: boolean;
  public refresh_token?: boolean;
}

export const userModelAttributes = {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  login: {
    type: new DataTypes.STRING(255),
    allowNull: false,
  },
  password: {
    type: new DataTypes.STRING(255),
    allowNull: false,
  },
  age: {
    type: new DataTypes.INTEGER(),
    allowNull: false,
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  refresh_token: {
    type: new DataTypes.STRING(500),
    allowNull: true,
  },
};

export const userModelOptions = {
  tableName: TableNames.USERS,
  sequelize: sequelizeConnection,
  freezeTableName: true,
  timestamps: false,
};
