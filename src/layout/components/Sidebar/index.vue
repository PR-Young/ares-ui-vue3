<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variabless.menuBg"
        :text-color="variabless.menuText"
        :unique-opened="true"
        :active-text-color="variabless.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="(route, index) in permission_routes"
          :key="route.path + index"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import store from "@/store";
import Logo from "./Logo.vue";
import SidebarItem from "./SidebarItem.vue";
import variables from "@/assets/styles/variables.module.scss?inlineq";
import usePermissionStore from "@/store/modules/permission";
import useAppStore from "@/store/modules/app";
import useSettingsStore from "@/store/modules/settings";
import { computed } from "vue";
import { useRouter } from "vue-router";

const permission = usePermissionStore(store);
const app = useAppStore(store);
const settings = useSettingsStore(store);
const { currentRoute } = useRouter();

const permission_routes = computed(() => {
  return permission.permissionRoutes;
});
const sidebar = computed(() => {
  return app.sidebar;
});
const activeMenu = computed(() => {
  const route = currentRoute.value;
  const { meta, path } = route;
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
});
const showLogo = computed(() => {
  return settings.sidebarLogo;
});
const variabless = computed(() => {
  return variables;
});
const isCollapse = computed(() => {
  return !sidebar.value.opened;
});
</script>
