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
// import workflowBpmnModelerInstall from './components/Process/index'
// import bpmnViewerInstall from './components/BpmnViewer/index'

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
import AiForm from "ai-form"

import zhCn from "element-plus/es/locale/lang/zh-cn";
// 修改分页器默认文字
zhCn.el.pagination.total = '共 {total} 条';
zhCn.el.pagination.goto = '跳至';
zhCn.el.pagination.pagesize = '条/页';
zhCn.el.pagination.pageClassifier = '页';


const app = Vue.createApp(App)

// workflowBpmnModelerInstall(app)
// bpmnViewerInstall(app)

// 全局方法挂载
app.config.globalProperties.getDicts = getDicts
app.config.globalProperties.getConfigKey = getConfigKey
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.addDateRange = addDateRange
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.download = download
app.config.globalProperties.handleTree = handleTree

app.config.globalProperties.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: 'success' })
}

app.config.globalProperties.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: 'error' })
}

app.config.globalProperties.msgInfo = function (msg) {
  this.$message.info(msg)
}

// 全局组件挂载
app.component('Pagination', Pagination)
app.component('svg-icon', SvgIcon)

app.use(permission)
app.use(VueParticles)
app.use(mavonEditor)
app.use(formCreate)
app.use(FcDesigner)
app.use(AiForm)


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

app.use(Element, {
  size: Cookies.get('size') || 'default', // set element-ui default size
  locale: zhCn
})

app.config.globalProperties.routerAppend = (path, pathToAppend) => {
  return path + (path.endsWith('/') ? '' : '/') + pathToAppend
}
app.use(router)
app.use(store)
app.mount('#app')
