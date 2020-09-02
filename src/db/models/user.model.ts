import { Model, DataTypes } from 'sequelize';
import { sequelizeConnection } from '../connection';
import { TableNames } from '../constants/table-names.enum';

export class UserModel extends Model {
  public id!: string;
  public login!: string;
  public password!: string;
  public age!: number;
  public is_deleted?: boolean;
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
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    tableName: TableNames.USERS,
    sequelize: sequelizeConnection,
    freezeTableName: true,
    timestamps: false,
  },
);
