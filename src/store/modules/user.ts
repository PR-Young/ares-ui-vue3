import { defineStore } from 'pinia'
import { getInfo, login, logout } from '@/api/login'
import { getToken, removeToken, setToken } from '@/utils/auth'
import { getNoticeNum } from '@/api/notify/message'
import defAva from "@/assets/image/profile.jpeg";

const useUserStore = defineStore('user', {
  state: () => {
    return {
      token: getToken(),
      name: '',
      avatar: {},
      roles: [] as any[],
      permissions: [],
      notice: 0,
      account: '',
      notice_num: 0
    }
  },
  actions: {
    // 登录
    Login(userInfo: { username: string; password: any; code: any; uuid: any; rememberMe: any }) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      const rememberMe = userInfo.rememberMe
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid, rememberMe)
          .then((res: any) => {
            setToken(res.token)
            this.token = res.token
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetInfo() {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res: any) => {
            const user = res.user
            let avatar = { url: '' }
            avatar.url =
              user.avatar == null || user.avatar == ''
                ? defAva
                : import.meta.env.VITE_APP_BASE_API +
                '/ares/system/user/profile/' +
                user.avatar
            if (res.roles && res.roles.length > 0) {
              // 验证返回的roles是否是一个非空数组
              this.roles = res.roles
              this.permissions = res.permissions

            } else {
              this.roles = ['ROLE_DEFAULT']
            }
            this.name = user.userName
            this.avatar = avatar
            this.account = user.account
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 退出系统
    LogOut() {
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            this.token = ''
            this.roles = []
            this.permissions = []
            removeToken()
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 前端 登出
    FedLogOut() {
      return new Promise((resolve) => {
        this.token = ''
        removeToken()
        resolve()
      })
    },

    GetNoticeNumber() {
      return new Promise((resolve, reject) => {
        getNoticeNum()
          .then((res) => {
            this.notice_num = res.data
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    updateNoticeNumber(data: any) {
      this.notice_num = data
    },
  },
  getters: {
    getToken(): any { return this.token },
    getAvatar(): any { return this.avatar },
    getName(): any { return this.name },
    getUserAccount(): any { return this.account },
    getRoles(): any { return this.roles },
    getPermissions(): any { return this.permissions },
    getNoticeNum(): any { return this.notice_num },
  }
})

export default useUserStore
