/**
 * 操作权限处理
 */

import store from '@/store'
import useUserStore from '@/store/modules/user'
import { DirectiveBinding } from 'vue'
const user = useUserStore(store)

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding, vnode: any) {
    const { value } = binding
    const all_permission = '*:*:*'
    const permissions = user.permissions

    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value

      const hasPermissions = permissions.some((permission) => {
        return (
          all_permission === permission || permissionFlag.includes(permission)
        )
      })

      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`请设置操作权限标签值`)
    }
  },
}
