import router from './router'
import store from './store'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'

NProgress.configure({ showSpinner: false })

const whiteList = [
  '/login',
  '/auth-redirect',
  '/bind',
  '/register',
  '/mypage',
  '/blog',
  '/tag',
  '/archives',
  '/details',
  '/updateinfo',
]

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/index' })
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        // 判断当前用户是否已拉取完user_info信息
        store
          .dispatch('GetInfo')
          .then((res) => {
            store.dispatch('GetNoticeNumber')
            // 拉取user_info
            const roles = res.roles
            store.dispatch('GenerateRoutes', { roles }).then((accessRoutes) => {
              // 根据roles权限生成可访问的路由表
              accessRoutes.forEach(route => {
                router.addRoute(route)
              })
              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
            })
          })
          .catch((err) => {
            console.log(err)
            // 在request中已经判断用户是否登录，拉取用户信息失败一般是没有登录，所以在此可以不用一下操作
            store.dispatch('FedLogOut').then(() => {
              ElMessage.error(err)
              next({ path: '/login' })
            })
          })
      } else {
        next()
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        // if (hasPermission(store.getters.roles, to.meta.roles)) {
        //   next()
        // } else {
        //   next({ path: '/401', replace: true, query: { noGoBack: true }})
        // }
        // 可删 ↑
      }
    }
  } else {
    // 没有token
    if (
      whiteList.indexOf(to.path) !== -1 ||
      to.path.indexOf('/details') !== -1
    ) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
