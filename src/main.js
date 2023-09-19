import Cookies from 'js-cookie'
import * as Vue from 'vue'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import Element from 'element-plus'
import './assets/styles/element-variables.scss'
import './assets/styles/index.scss' // global css
import './assets/styles/ares.scss' // ares css

import App from './App.vue'
import store from './store'
import router from './router'
import permission from './directive/permission'

//import './assets/icons' // icon
import SvgIcon from '@/components/SvgIcon/index.vue'
import 'virtual:svg-icons-register'
import './permission' // permission control
import { getDicts } from '@/api/system/dict/data'
import { getConfigKey } from '@/api/system/config'
import {
  addDateRange,
  download,
  handleTree,
  parseTime,
  resetForm,
  selectDictLabel,
} from '@/utils/ares'
import Pagination from '@/components/Pagination/index.vue'
import VueParticles from 'particles.vue3'
// markdown 注册
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import formCreate from '@form-create/element-ui'
import FcDesigner from '@form-create/designer'

window.$vueApp = Vue.createApp(App)

// 全局方法挂载
window.$vueApp.config.globalProperties.getDicts = getDicts
window.$vueApp.config.globalProperties.getConfigKey = getConfigKey
window.$vueApp.config.globalProperties.parseTime = parseTime
window.$vueApp.config.globalProperties.resetForm = resetForm
window.$vueApp.config.globalProperties.addDateRange = addDateRange
window.$vueApp.config.globalProperties.selectDictLabel = selectDictLabel
window.$vueApp.config.globalProperties.download = download
window.$vueApp.config.globalProperties.handleTree = handleTree

window.$vueApp.config.globalProperties.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: 'success' })
}

window.$vueApp.config.globalProperties.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: 'error' })
}

window.$vueApp.config.globalProperties.msgInfo = function (msg) {
  this.$message.info(msg)
}

// 全局组件挂载
window.$vueApp.component('Pagination', Pagination)
window.$vueApp.component('svg-icon', SvgIcon)

window.$vueApp.use(permission)
window.$vueApp.use(VueParticles)
window.$vueApp.use(mavonEditor)
window.$vueApp.use(formCreate)
window.$vueApp.use(FcDesigner)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  window.$vueApp.component(key, component)
}

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

window.$vueApp.use(Element, {
  size: Cookies.get('size') || 'default', // set element-ui default size
})

window.$vueApp.config.globalProperties.routerAppend = (path, pathToAppend) => {
  return path + (path.endsWith('/') ? '' : '/') + pathToAppend
}
window.$vueApp.use(store)
window.$vueApp.use(router)
window.$vueApp.mount('#app')
