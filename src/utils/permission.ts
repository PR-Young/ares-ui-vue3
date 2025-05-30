import store from "@/store";
import useUserStore from "@/store/modules/user";
const user = useUserStore(store);

/**
 * 字符权限校验
 * @param {Array} value 校验值
 * @returns {Boolean}
 */
export function checkPermi(value: string | any[]) {
  if (value && value instanceof Array && value.length > 0) {
    const permissions = user.permissions;
    const permissionDatas = value;

    const hasPermission = permissions.some((permission) => {
      return permissionDatas.includes(permission);
    });

    if (!hasPermission) {
      return false;
    }
    return true;
  } else {
    console.error(
      `need roles! Like checkPermi="['system:user:add','system:user:edit']"`,
    );
    return false;
  }
}

/**
 * 角色权限校验
 * @param {Array} value 校验值
 * @returns {Boolean}
 */
export function checkRole(value: string | any[]) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = user.roles;
    const permissionRoles = value;

    const hasRole = roles.some((role) => {
      return permissionRoles.includes(role);
    });

    if (!hasRole) {
      return false;
    }
    return true;
  } else {
    console.error(`need roles! Like checkRole="['admin','editor']"`);
    return false;
  }
}
