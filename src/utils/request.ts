import axios from "axios";
import { ElNotification, ElMessageBox, ElMessage } from "element-plus";
import store from "@/store";
import { getToken } from "@/utils/auth";
import useUserStore from "@/store/modules/user";
const user = useUserStore(store);

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";

const notLogin = [
  "未能读取到有效Token",
  "Token无效",
  "Token已过期",
  "Token已被顶下线",
  "Token已被踢下线",
  "当前会话未登录",
];
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 超时
  timeout: 100000,
});
// request拦截器
service.interceptors.request.use(
  (config) => {
    if (getToken()) {
      config.headers["Authorization"] = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    const code = res.data.code || res.status;
    if (code != 200) {
      if (code === 90002 || code === 90003) {
        ElMessageBox.confirm(
          "登录状态已过期，您可以继续留在该页面，或者重新登录",
          "系统提示",
          {
            confirmButtonText: "重新登录",
            cancelButtonText: "取消",
            type: "warning",
          },
        ).then(() => {
          user.LogOut().then(() => {
            location.hash = "/login";
            location.reload(); // 为了重新实例化vue-router对象 避免bug
          });
        });
      } else if (code === 90004) {
        const hash = location.hash;
        if (hash.includes("#")) {
          location.hash = "#/401";
        } else {
          location.hash = "/401";
        }
        location.reload();
      } else {
        const msg = res.data.msg.split("：");
        if (notLogin.includes(msg[0])) {
          ElMessageBox.confirm(
            "登录状态已过期，您可以继续留在该页面，或者重新登录",
            "系统提示",
            {
              confirmButtonText: "重新登录",
              cancelButtonText: "取消",
              type: "warning",
            },
          ).then(() => {
            user.LogOut().then(() => {
              location.hash = "/login";
              location.reload(); // 为了重新实例化vue-router对象 避免bug
            });
          });
        } else {
          ElNotification.error({
            //title: res.data.code,
            message: res.data.msg,
            type: "error",
            showClose: true,
          });
          return Promise.reject("error");
        }
      }
    } else {
      if (code === 90002 || code === 90003) {
        ElMessageBox.confirm(
          "登录状态已过期，您可以继续留在该页面，或者重新登录",
          "系统提示",
          {
            confirmButtonText: "重新登录",
            cancelButtonText: "取消",
            type: "warning",
          },
        ).then(() => {
          user.LogOut().then(() => {
            location.hash = "/login";
            location.reload(); // 为了重新实例化vue-router对象 避免bug
          });
        });
      } else if (code === 90004) {
        const hash = location.hash;
        if (hash.includes("#")) {
          location.hash = "#/401";
        } else {
          location.hash = "/401";
        }
        location.reload();
      } else {
        return res.data;
      }
    }
  },
  (error) => {
    console.log("err" + error);
    ElMessage({
      message: error.message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  },
);

export default service;
