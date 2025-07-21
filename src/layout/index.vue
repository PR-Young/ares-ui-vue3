<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container" />
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script>
import RightPanel from "@/components/RightPanel/index.vue";
import { AppMain, Navbar, Settings, Sidebar, TagsView } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import store from "@/store";
import useAppStore from "@/store/modules/app";
import useSettingsStore from "@/store/modules/settings";
import { markRaw } from "vue";

const app = useAppStore(store);
const settings = useSettingsStore(store);

export default {
  name: "Layout",
  components: {
    AppMain: markRaw(AppMain),
    Navbar: markRaw(Navbar),
    RightPanel: markRaw(RightPanel),
    Settings: markRaw(Settings),
    Sidebar: markRaw(Sidebar),
    TagsView: markRaw(TagsView),
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return app.sidebar;
    },
    device() {
      return app.device;
    },
    showSettings() {
      return settings.showSettings;
    },
    needTagsView() {
      return settings.tagsView;
    },
    fixedHeader() {
      return settings.fixedHeader;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile",
      };
    },
  },
  methods: {
    handleClickOutside() {
      app.closeSideBar(false);
    },
  },
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
