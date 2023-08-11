<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <search id="header-search" class="right-menu-item" />

        <el-badge
          class="right-menu-item"
          :model-value="notice_num > 0 ? notice_num : ''"
          :max="99"
        >
          <router-link to="/notify/message">
            <el-icon class="bell-style"><el-icon-bell /></el-icon>
          </router-link>
        </el-badge>

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" style="padding-top:15px" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img
            :src="avatar.url"
            @error="imgError(avatar)"
            class="user-avatar"
          />
          <el-icon><el-icon-caret-bottom /></el-icon>
        </div>
        <template v-slot:dropdown>
          <el-dropdown-menu>
            <router-link to="/userfile/profile">
              <el-dropdown-item>个人中心</el-dropdown-item>
            </router-link>
            <el-dropdown-item @click="setting = true">
              <span>布局设置</span>
            </el-dropdown-item>
            <el-dropdown-item divided @click="logout">
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import {
  Bell as ElIconBell,
  CaretBottom as ElIconCaretBottom,
} from '@element-plus/icons'
import { mapGetters, mapState } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import Hamburger from '@/components/Hamburger/index.vue'
import Screenfull from '@/components/Screenfull/index.vue'
import SizeSelect from '@/components/SizeSelect/index.vue'
import Search from '@/components/HeaderSearch/index.vue'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    ElIconBell,
    ElIconCaretBottom,
  },
  created() {
    // setInterval(() => {
    //   store.dispatch("GetNoticeNumber");
    // }, 60 * 1000);
    this.connectWebsocket()
  },
  unmounted() {
    //clearInterval();
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device', 'notice_num']),
    setting: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val,
        })
      },
    },
  },
  methods: {
    imgError(avatar) {
      avatar.url = require('@/assets/image/profile.jpeg')
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.reload()
        })
      })
    },
    connectWebsocket() {
      let userAccount = this.$store.getters.userAccount
      let websocket
      if (typeof WebSocket === 'undefined') {
        console.log('您的浏览器不支持WebSocket')
        return
      } else {
        let protocol = 'ws'
        let url = ''
        if (window.location.protocol == 'https:') {
          protocol = 'wss'
        }

        url = `${protocol}://10.211.55.4:8080/ares/ws/` + userAccount

        // 打开一个websocket
        websocket = new WebSocket(url)
        // 建立连接
        websocket.onopen = () => {
          // 发送数据
          //websocket.send("发送数据");
          console.log('websocket发送数据中')
        }
        // 客户端接收服务端返回的数据
        websocket.onmessage = (evt) => {
          this.$store.dispatch('updateNoticeNumber', evt.data)
          console.log('websocket返回的数据:', evt)
        }
        // 发生错误时
        websocket.onerror = (evt) => {
          console.log('websocket错误:', evt)
        }
        // 关闭连接
        websocket.onclose = (evt) => {
          console.log('websocket关闭:', evt)
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }

    .bell-style {
      font-weight: bold;
      font-size: larger;
      padding-top: 25px;
    }
  }
}
</style>
