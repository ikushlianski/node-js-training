export * from './group.model';
export * from './user.model';
export * from './user-group.model';

import {
  groupModelAttributes,
  GroupModel,
  groupModelOptions,
} from './group.model';
import { userModelAttributes, UserModel, userModelOptions } from './user.model';
import {
  UserGroupModel,
  userGroupModelAttributes,
  userGroupModelOptions,
} from './user-group.model';

UserModel.init(userModelAttributes, userModelOptions);
GroupModel.init(groupModelAttributes, groupModelOptions);
UserGroupModel.init(userGroupModelAttributes, userGroupModelOptions);

GroupModel.belongsToMany(UserModel, {
  through: UserGroupModel,
  foreignKey: 'group_id',
});
UserModel.belongsToMany(GroupModel, {
  through: UserGroupModel,
  foreignKey: 'user_id',
});
