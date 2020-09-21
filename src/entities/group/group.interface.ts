import { ElementType } from '../../utils/element-type.util';
import { groupPermissionsList } from '../../constants/permissions.constant';

export type GroupPermission = ElementType<typeof groupPermissionsList>;

export interface GroupInterface {
  id: string;
  name: string;
  permissions: GroupPermission[];
}

export type GroupDto = Pick<GroupInterface, 'name' | 'permissions'>;
