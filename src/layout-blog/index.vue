<template>
  <div id="app">
    <div class="container">
      <transition name="fade">
        <aside v-if="menuStatus" class="left-wrapper">
          <div class="left-wrapper-fixed">
            <div class="user-wrapper">
              <img src="../assets/image/profile.jpeg" />
              <p class="user-name">young</p>
              <p class="user-email">email</p>
            </div>
            <div class="menu-wrapper">
              <ul>
                <li
                  :class="{ 'li-active': active == 'blog' }"
                  @click="changeMenu('blog', '/blog')"
                >
                  <el-icon class="iconfont"><el-icon-house /></el-icon>
                  <p>Home</p>
                </li>
                <li
                  :class="{ 'li-active': active == 'archives' }"
                  @click="changeMenu('archives', '/archives')"
                >
                  <el-icon class="iconfont"><el-icon-notebook-1 /></el-icon>
                  <p>Archives</p>
                </li>
                <li
                  :class="{ 'li-active': active == 'tag' }"
                  @click="changeMenu('tag', '/tag')"
                >
                  <el-icon class="iconfont"><el-icon-collection-tag /></el-icon>
                  <p>Tag</p>
                </li>
                <li class="">
                  <el-icon class="iconfont"><el-icon-link /></el-icon>
                  <p>Github</p>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </transition>
      <div class="main-wrapper">
        <div class="nav-wrapper" :class="{ 'nav-shadow': navShadow }">
          <!-- <i
                  class="iconfont"
                  style="padding: 10px 25px 1px 1px; cursor: pointer"
                  :class="{
                    'el-icon-close move-right': menuStatus,
                    'el-icon-menu move-left': !menuStatus,
                  }"
                  @click="asideStatus()"
                ></i> -->
          <i
            class="iconfont"
            style="cursor: pointer; width: 120px"
            @click="changeMenu('blog', '/blog')"
          >
            Home
          </i>
          <i
            class="iconfont"
            style="cursor: pointer; width: 120px"
            @click="changeMenu('archives', '/archives')"
          >
            Archives
          </i>
          <i
            class="iconfont"
            style="cursor: pointer; width: 120px"
            @click="changeMenu('tag', '/tag')"
          >
            Tag
          </i>
          <i
            class="iconfont"
            style="cursor: pointer; width: 120px"
            @click="changeMenu('updateinfo', '/updateinfo')"
          >
            Info
          </i>
          <el-icon
            class="iconfont"
            style="padding: 20px 1px 1px 1px; float: right; cursor: pointer"
            ><el-icon-share
          /></el-icon>
          <el-icon
            class="iconfont search-i"
            style="padding: 20px 1px 1px 40px; float: right"
            ><el-icon-search
          /></el-icon>
          <div
            class="search-wrapper"
            :class="searchStatus ? 'width-amplify' : 'width-narrow'"
          >
            <input
              type="text"
              placeholder="输入感兴趣的关键字"
              @change="search"
            />
          </div>
        </div>
        <router-view />
        <div class="footer">
          <div class="copyright">
            <p>ares</p>
            <p>Power by <a href="">vue</a> Theme <a href="">element-ui</a></p>
            <p><router-link to="/login">Management</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlogLayout',
  components: {},
  data() {
    return {
      //导航栏是否显示阴影
      navShadow: true,
      //左边菜单栏是否显示
      menuStatus: false,
      //搜索框是否显示
      searchStatus: false,
      //当前选中菜单
      active: 'blog',
    }
  },
  mounted() {
    // 触发监听窗口滚动事件
    window.addEventListener('scroll', this.isScroll)
  },
  methods: {
    // 监听窗口滚动
    isScroll() {
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      if (scrollTop == 0) {
        //滚动条为0
        this.navShadow = false
      } else {
        //滚动条不为0
        this.navShadow = true
      }
    },

    //切换左边菜单栏显示状态
    asideStatus() {
      this.menuStatus = !this.menuStatus
      let self = this
      if (this.menuStatus) {
        let interval = setInterval(function () {
          self.navPadding += 1
          if (self.navPadding >= 240) {
            self.navPadding = 240
            clearInterval(interval)
          }
        }, 0.5)
      } else {
        let interval = setInterval(function () {
          self.navPadding -= 1
          if (self.navPadding <= 0) {
            self.navPadding = 0
            clearInterval(interval)
          }
        }, 1)
      }
    },

    // 路由跳转
    location(url) {
      this.$router.push({ path: url })
    },

    //单击菜单修改菜单样式
    changeMenu(active, url) {
      this.active = active
      this.location(url)
    },
    search(event) {
      console.log(event)
      console.log(this)
    },
  },
}
</script>

<style lang="scss">
ul {
  list-style: none;
  margin: 0px;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html {
  border: #f6f6f6;
}
.container {
  display: flex;
  min-height: 100vh;
}
.left-wrapper {
  flex: 0 0 240px;
  width: 240px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
}
.left-wrapper-fixed {
  position: fixed;
  width: 220px;
  height: 100%;
  z-index: 2;
}
.main-wrapper {
  flex: 1;
  background: #f6f6f6;
  padding: 0 15px;
}
.user-wrapper {
  padding: 20px;
  height: 200px;
  background-image: url(../assets/image/brand.jpg);
  background-position: center;
}
.user-wrapper img {
  width: 80px;
  height: 80px;
  border: 2px solid #fff;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
}
.user-name {
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: #fff;
}
.user-email {
  padding-top: 4px;
  color: #1a36e2;
  font-size: 13px;
}
.menu-wrapper {
  padding: 20px 0;
}
.li-active,
.menu-wrapper li:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #3f51b5;
}
.menu-wrapper li {
  display: flex;
  padding: 0 20px;
  height: 44px;
  line-height: 44px;
  cursor: pointer;
}
.menu-wrapper li i {
  padding: 12px 0px 0px 25px;
  flex: 0 0 50px;
  width: 50px;
}
.nav-wrapper {
  height: 56px;
  background: #3f51b5;
  color: #fff;
  line-height: 56px;
  position: fixed;
  top: 0;
  z-index: 1;
  width: 100%;
  left: 0;
}
.nav-shadow {
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
}
.nav-wrapper i {
  display: inline-block;
  width: 56px;
  text-align: center;
  position: relative;
}
.nav-wrapper i:nth-child(1) {
  float: left;
} /*// .nav-wrapper i:nth-child(3)
 {
}*/
header {
  padding: 80px 15px 48px 50px;
  height: 200px;
  color: #fff;
  background: #3f51b5;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin: 0 -15px;
}
header h1 {
  line-height: 48px;
  font-size: 36px;
  font-weight: 500;
}
header h5 {
  font-size: 16px;
  margin-top: 5px;
  font-weight: 300;
}
.footer {
  padding: 15px;
  background: #303f9f;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  font-size: 13px;
  margin: 0 -15px;
}
.footer a {
  color: inherit;
  opacity: 0.8;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  margin-left: -240px;
}
.width-fade-enter-active,
.width-fade-leave-active {
  transition: all 0.5s ease;
}
.width-fade-enter,
.width-fade-leave-to {
  width: 330px;
}
.move-right {
  animation: moveRight 0.5s ease;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}
.move-left {
  animation: moveLeft 0.5s ease;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}
@keyframes moveLeft {
  from {
    left: 240px;
  }
  to {
    left: 0px;
  }
}
@keyframes moveRight {
  from {
    left: 0px;
  }
  to {
    left: 240px;
  }
}
.width-amplify {
  animation: amplify 0.3s ease;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}
.width-narrow {
  animation: narrow 0.3s ease;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}
@keyframes amplify {
  from {
    width: 0px;
  }
  to {
    width: 330px;
  }
}
@keyframes narrow {
  from {
    width: 330px;
  }
  to {
    width: 0px;
  }
}
.search-wrapper {
  width: 330px;
  height: 40px;
  position: absolute;
  color: #fff;
  border-bottom: 2px solid #fff;
  right: 56px;
  top: 8px;
  font-size: 0px;
}
.search-wrapper input {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  background: none;
  border: none;
  font-size: 14px;
  color: #fff;
  margin-right: 56px;
}
::-webkit-input-placeholder {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}
input {
  outline: none;
}
.search-i {
  position: relative;
  z-index: 2;
  cursor: pointer;
}
.search-opacity {
  opacity: 0.6;
}
.iconfont {
  font-weight: bold;
  font-size: large;
}
</style>
