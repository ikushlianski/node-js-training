import { Model, DataTypes } from 'sequelize';
import { sequelizeConnection } from '../connection';
import { TableNames } from '../constants';

export class UserModel extends Model {
  public id!: number;
  public login!: string;
  public password!: string;
  public age!: number;
  public isDeleted?: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserModel.init(
  {
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
      type: new DataTypes.INTEGER(),
      allowNull: true,
    },
  },
  {
    tableName: TableNames.USERS,
    sequelize: sequelizeConnection,
    freezeTableName: true,
  },
);
