<template>
  <div class="drawer-container">
    <div>
      <!-- <h3 class="drawer-title">系统布局配置</h3> -->

      <div class="drawer-item">
        <span>主题颜色</span>
        <theme-picker
          style="float: right; height: 26px; margin: -3px 8px 0 0"
          @change="themeChange"
        />
      </div>

      <div class="drawer-item">
        <span>开启 Tags-Views</span>
        <el-switch v-model="tagsView" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>固定 Header</span>
        <el-switch v-model="fixedHeader" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>显示 Logo</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </div>
    </div>
  </div>
</template>

<script setup>
import ThemePicker from "@/components/ThemePicker/index.vue";
import useSettingsStore from "@/store/modules/settings";
import store from "@/store";
import { computed } from "vue";

const settings = useSettingsStore(store);

const fixedHeader = computed({
  get() {
    return settings.fixedHeader;
  },
  set(val) {
    settings.changeSetting({
      key: "fixedHeader",
      value: val,
    });
  },
});
const tagsView = computed({
  get() {
    return settings.tagsView;
  },
  set(val) {
    settings.changeSetting({
      key: "tagsView",
      value: val,
    });
  },
});

const sidebarLogo = computed({
  get() {
    return settings.sidebarLogo;
  },
  set(val) {
    settings.changeSetting({
      key: "sidebarLogo",
      value: val,
    });
  },
});

const themeChange = (val) => {
  settings.changeSetting({
    key: "theme",
    value: val,
  });
};
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 20px;
  font-size: 15px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, 0.65);
    font-size: 15px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right;
  }
}
</style>
