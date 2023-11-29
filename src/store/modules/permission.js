import { defineStore } from 'pinia'
import { constantRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index.vue'

const routeAllPathToCompMap = import.meta.glob(`@/views/**/*.vue`);

const usePermissionStore = defineStore('permission', {
  state: () => {
    return {
      routes: [],
      addRoutes: [],
    }
  },
  actions: {
    // 生成路由
    GenerateRoutes() {
      return new Promise((resolve) => {
        // 向后端请求路由数据
        getRouters().then((res) => {
          const accessedRoutes = filterAsyncRouter(res.data)
          accessedRoutes.push({ path: '/:pathMatch(.*)', redirect: '/404', hidden: true })
          this.routes = constantRoutes.concat(accessedRoutes)
          this.addRoutes = accessedRoutes
          resolve(accessedRoutes)
        })
      })
    },
  },
  getters: {
    permissionRoutes() { return this.routes },
  }
})

// 遍历后台传来的路由字符串，转换为组件对象
export function filterAsyncRouter(asyncRouterMap) {
  return asyncRouterMap.filter((route) => {
    if (route.component) {
      // Layout组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }

    return true
  })
}

export const loadView = (view) => {
  // 路由懒加载
  return routeAllPathToCompMap[`/src/views/${view}.vue`]
}

export default usePermissionStore
