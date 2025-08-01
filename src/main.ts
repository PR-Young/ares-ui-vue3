import Cookies from "js-cookie";
import * as Vue from "vue";
import "normalize.css/normalize.css"; // a modern alternative to CSS resets
import ElementPlus from "element-plus";
import "./assets/styles/element-variables.scss";
import "./assets/styles/index.scss"; // global css
import "./assets/styles/ares.scss"; // ares css
import App from "./App.vue";
import store from "./store";
import router from "./router";
import permission from "./directive/permission";

import SvgIcon from "@/components/SvgIcon/index.vue";
import "virtual:svg-icons-register";
import "./permission"; // permission control
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import {
  addDateRange,
  download,
  handleTree,
  parseTime,
  resetForm,
  selectDictLabel,
} from "@/utils/ares";
import Pagination from "@/components/Pagination/index.vue";
import VueParticles from "particles.vue3";
// markdown 注册
import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import AiForm from "ai-form";
// 1. 引入VTJ核心功能
import { createProvider, LocalService, ContextMode } from "@vtj/renderer";
import { createModules } from "./modules";

import zhCn from "element-plus/es/locale/lang/zh-cn";

const app = Vue.createApp(App);

// 3. 实例化低代码服务
// 注意：LocalService仅适用于开发环境
// 生产环境需实现RemoteService接口
const service = new LocalService();

// 4. 创建VTJ提供者实例
const { provider, onReady } = createProvider({
  // 关键：设置物料基础路径
  materialPath: '/',
  // 设置运行环境
  nodeEnv: process.env.NODE_ENV,
  mode: ContextMode.Runtime,
  // 注册应用模块
  modules: createModules(),
  // 注入服务实例
  service,
  // 注入路由实例
  router,
  dependencies: {
    Vue: () => import("vue"),
    VueRouter: () => import("vue-router"),
    ElementPlus: () => import("element-plus"),
  },
  project: {
    // 需要和 package.json 文件的 name 字段匹配
    id: "ares",
  },
  routeAppendTo: "Pages",
});

// 5. 初始化完成后挂载应用
onReady(async () => {
  // 修改分页器默认文字
  zhCn.el.pagination.total = "共 {total} 条";
  zhCn.el.pagination.goto = "跳至";
  zhCn.el.pagination.pagesize = "条/页";
  zhCn.el.pagination.pageClassifier = "页";
  // 全局方法挂载
  app.config.globalProperties.getDicts = getDicts;
  app.config.globalProperties.getConfigKey = getConfigKey;
  app.config.globalProperties.parseTime = parseTime;
  app.config.globalProperties.resetForm = resetForm;
  app.config.globalProperties.addDateRange = addDateRange;
  app.config.globalProperties.selectDictLabel = selectDictLabel;
  app.config.globalProperties.download = download;
  app.config.globalProperties.handleTree = handleTree;

  app.config.globalProperties.msgSuccess = function (msg: any) {
    this.$message({ showClose: true, message: msg, type: "success" });
  };

  app.config.globalProperties.msgError = function (msg: any) {
    this.$message({ showClose: true, message: msg, type: "error" });
  };

  app.config.globalProperties.msgWarning = function (msg: any) {
    this.$message({ showClose: true, message: msg, type: "warning" });
  };

  app.config.globalProperties.msgInfo = function (msg: any) {
    this.$message.info(msg);
  };

  // 全局组件挂载
  app.component("Pagination", Pagination);
  app.component("svg-icon", SvgIcon);

  app.use(permission);
  app.use(VueParticles);
  app.use(mavonEditor);
  // app.use(AiForm)

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }

  app.use(ElementPlus, {
    size: Cookies.get("size") || "default",
    locale: zhCn,
  });

  app.config.globalProperties.routerAppend = (
    path: string,
    pathToAppend: string,
  ) => {
    return path + (path.endsWith("/") ? "" : "/") + pathToAppend;
  };
  app.use(router);
  app.use(store);
  app.use(provider);
  app.mount("#app");
});
