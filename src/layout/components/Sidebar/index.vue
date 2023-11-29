<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
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

<script>
import store from "@/store";
import Logo from "./Logo.vue";
import SidebarItem from "./SidebarItem.vue";
import variables from "@/assets/styles/variables.module.scss?inlineq";
import usePermissionStore from "@/store/modules/permission";
import useAppStore from "@/store/modules/app";
import useSettingsStore from "@/store/modules/settings";

const permission = usePermissionStore(store);
const app = useAppStore(store);
const settings = useSettingsStore(store);

export default {
  components: { SidebarItem, Logo },
  computed: {
    permission_routes() {
      return permission.permissionRoutes;
    },
    sidebar() {
      return app.sidebar;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
};
</script>
