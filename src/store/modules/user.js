import { defineStore } from 'pinia'
import { getInfo, login, logout } from '@/api/login'
import { getToken, removeToken, setToken } from '@/utils/auth'
import { getNoticeNum } from '@/api/notify/message'

const useUserStore = defineStore('user', {
  state: () => {
    return {
      token: getToken(),
      name: '',
      avatar: '',
      roles: [],
      permissions: [],
      notice: 0,
      account: '',
    }
  },
  actions: {
    // 登录
    Login(userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      const rememberMe = userInfo.rememberMe
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid, rememberMe)
          .then((res) => {
            setToken(res.token)
            this.token = res.token
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetInfo() {
      return new Promise((resolve, reject) => {
        getInfo(this.token)
          .then((res) => {
            const user = res.user
            let avatar = {}
            avatar.url =
              user.avatar == null || user.avatar == ''
                ? require('@/assets/image/profile.jpeg')
                : process.env.VUE_APP_BASE_API +
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
        logout(this.token)
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
    updateNoticeNumber(data) {
      this.notice_num = data
    },
  },
  getters: {
    getToken() { return this.token },
    getAvatar() { return this.avatar },
    getName() { return this.name },
    getUserAccount() { return this.userAccount },
    getIntroduction() { return this.introduction },
    getRoles() { return this.roles },
    getPermissions() { return this.permissions },
    getNoticeNum() { return this.notice_num },
  }
})

export default useUserStore
