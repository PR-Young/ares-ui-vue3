<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <!-- <sidebar class="sidebar-container" /> -->
    <component :is="sidebarCom" class="sidebar-container" />
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <!-- <right-panel v-if="showSettings">
        <settings />
      </right-panel> -->
      <el-drawer
        v-model="showSettings"
        title="系统布局配置"
        :show-close="false"
      >
        <!-- <settings /> -->
        <component :is="settingsCom" />
      </el-drawer>
    </div>
  </div>
</template>

<script setup name="Layout">
import RightPanel from "@/components/RightPanel/index.vue";
import { AppMain, Navbar, Settings, Sidebar, TagsView } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import store from "@/store";
import useAppStore from "@/store/modules/app";
import useSettingsStore from "@/store/modules/settings";
import { markRaw, computed, defineAsyncComponent } from "vue";

const sidebarCom = markRaw(Sidebar);
const settingsCom = markRaw(Settings);

const app = useAppStore(store);
const settings = useSettingsStore(store);

const sidebar = computed(() => {
  return app.sidebar;
});
const device = computed(() => {
  return app.device;
});
const showSettings = computed({
  get() {
    return settings.showSettings;
  },
  set(val) {
    settings.changeSetting({
      key: "showSettings",
      value: val,
    });
  },
});
const needTagsView = computed(() => {
  return settings.tagsView;
});
const fixedHeader = computed(() => {
  return settings.fixedHeader;
});
const classObj = computed(() => {
  return {
    hideSidebar: !sidebar.value.opened,
    openSidebar: sidebar.value.opened,
    withoutAnimation: sidebar.value.withoutAnimation,
    mobile: device.value === "mobile",
  };
});

const handleClickOutside = () => {
  app.closeSideBar(false);
};
</script>

<style lang="scss" scoped>
@use "../assets/styles/mixin.scss";
@use "../assets/styles/variables.module.scss";

.app-wrapper {
  @include mixin.clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{variables.$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
