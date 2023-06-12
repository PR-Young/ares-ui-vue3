import { getInfo, login, logout } from '@/api/login'
import { getToken, removeToken, setToken } from '@/utils/auth'
import { getNoticeNum } from '@/api/notify/message'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: [],
    notice: 0,
    account: '',
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_NOTICE_NUM: (state, notice) => {
      state.notice = notice
    },
    SET_ACCOUNT: (state, account) => {
      state.account = account
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      const rememberMe = userInfo.rememberMe
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid, rememberMe)
          .then((res) => {
            setToken(res.token)
            commit('SET_TOKEN', res.token)
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token)
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
              commit('SET_ROLES', res.roles)
              commit('SET_PERMISSIONS', res.permissions)
            } else {
              commit('SET_ROLES', ['ROLE_DEFAULT'])
            }
            commit('SET_NAME', user.userName)
            commit('SET_AVATAR', avatar)
            commit('SET_ACCOUNT', user.account)
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            commit('SET_PERMISSIONS', [])
            removeToken()
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    GetNoticeNumber({ commit, state }) {
      return new Promise((resolve, reject) => {
        getNoticeNum()
          .then((res) => {
            commit('SET_NOTICE_NUM', res.data)
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    updateNoticeNumber({ commit }, data) {
      commit('SET_NOTICE_NUM', data)
    },
  },
}

export default user
