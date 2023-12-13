import * as VueRouter from 'vue-router'

/* Layout */
import Layout from '@/layout/index.vue'
import BlogLayout from '@/layout-blog/index.vue'

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']    // 设置该路由进入的权限，支持多个权限叠加
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect.vue')
        ,
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/views/login.vue'),
    hidden: true,
  },
  {
    path: '/404',
    component: () => import('@/views/error/404.vue'),
    hidden: true,
  },
  {
    path: '/401',
    component: () => import('@/views/error/401.vue'),
    hidden: true,
  },
  {
    path: '/mypage',
    component: BlogLayout,
    redirect: 'blog',
    hidden: true,
    children: [
      {
        path: '/blog',
        component: () => import('@/layout-blog/components/Index.vue')
        ,
        name: '主页',
      },
      {
        path: '/details/:contentId',
        component: () => import('@/layout-blog/components/Details.vue')
        ,
        name: 'details',
      },
      {
        path: '/archives',
        component: () => import('@/layout-blog/components/Archives.vue')
        ,
        name: 'archives',
      },
      {
        path: '/tag',
        component: () => import('@/layout-blog/components/Tag.vue')
        ,
        name: 'tag',
      },
      {
        path: '/updateinfo',
        component: () => import('@/layout-blog/components/UpdateInfo.vue')
        ,
        name: 'updateinfo',
      },
    ],
  },
  {
    path: '/',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/index.vue'),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true },
      },
    ],
  },
  {
    path: '/userfile',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index.vue'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' },
      },
    ],
  },
  {
    path: '/dictdata',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/data/:dictId',
        component: () => import('@/views/system/dict/data.vue'),
        name: 'Data',
        meta: { title: '字典数据', icon: '' },
      },
    ],
  },
  {
    path: '/joblog',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'log',
        component: () => import('@/views/monitor/job/log.vue'),
        name: 'JobLog',
        meta: { title: '调度日志' },
      },
    ],
  },
  {
    path: '/mq',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'bindings/:vhost/:queueName',
        component: () => import('@/views/monitor/mq/bindings.vue'),
        name: 'Bindings',
        meta: { title: '绑定关系' },
      },
    ],
  },
  {
    path: '/genedit',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'edit',
        component: () => import('@/views/tool/gen/editTable.vue'),
        name: 'GenEdit',
        meta: { title: '修改生成配置' },
      },
    ],
  },
  {
    path: '/notify',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'message',
        component: () => import('@/views/notify/index.vue'),
        name: 'Message',
        meta: { title: '消息中心', icon: 'message' },
      },
    ],
  },
  {
    path: '/query',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'result',
        component: () => import('@/views/query.vue'),
        name: 'Search',
        meta: { title: '全文检索', icon: '' },
      },
    ],
  },
  {
    path: '/flowable',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'definition/model',
        component: () => import('@/views/flowable/definition/model.vue'),
        name: 'Model',
        meta: { title: '流程设计', icon: '' },
      },
    ],
  },
  {
    path: '/flowable',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'task/record/index',
        component: () => import('@/views/flowable/task/record/index.vue'),
        name: 'Record',
        meta: { title: '流程处理', icon: '' },
      },
    ],
  },
  {
    path: '/tool',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'build/index',
        component: () => import('@/views/tool/build/index.vue'),
        name: 'FormBuild',
        meta: { title: '表单配置', icon: '' },
      },
      {
        path: 'formcreate/index',
        component: () => import('@/views/tool/formcreate/index.vue'),
        name: 'FormCreate',
        meta: { title: '表单配置', icon: '' },
      },
    ],
  },
  {
    name: "流程管理(新)",
    redirect: "noRedirect",
    path: '/aresflow',
    component: Layout,
    meta: { title: '流程管理(新)', icon: 'table', },
    alwaysShow: true,
    hidden: false,
    children: [
      {
        path: 'build/index',
        component: () => import('@/views/aresflow/build/index.vue'),
        name: 'AresModel',
        meta: { title: '流程设计', icon: 'component' },
        hidden: false
      },
    ],
  },
  {
    name: "表单管理(新)",
    redirect: "noRedirect",
    path: '/aiform',
    component: Layout,
    meta: { title: '表单管理(新)', icon: 'table', },
    alwaysShow: true,
    hidden: false,
    children: [
      {
        path: 'build/index',
        component: () => import('@/views/aiform/AiFormDesigner/index.vue'),
        name: 'AresForm',
        meta: { title: '表单设计', icon: 'component' },
        hidden: false
      },
    ],
  },
]

export default VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes: constantRoutes,
  strict: true,
  scrollBehavior: () => ({
    left: 0,
    top: 0,
  }),
})
