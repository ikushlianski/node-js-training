import { TableNames } from '../constants';
import {
  groupModelAttributes,
  GroupModel,
  groupModelOptions,
} from './group.model';
import { userModelAttributes, UserModel, userModelOptions } from './user.model';

GroupModel.init(groupModelAttributes, groupModelOptions);
UserModel.init(userModelAttributes, userModelOptions);

GroupModel.belongsToMany(UserModel, { through: TableNames.USER_GROUPS });
UserModel.belongsToMany(GroupModel, { through: TableNames.USER_GROUPS });
