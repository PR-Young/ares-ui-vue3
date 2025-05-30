import { defineStore } from "pinia";
import variables from "@/assets/styles/element-variables.scss?inline";
import defaultSettings from "@/settings";

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings;
const vars = variables as any;

const useSettingsStore = defineStore("settings", {
  state: () => {
    return {
      theme: vars.theme,
      showSettings: showSettings,
      tagsView: tagsView,
      fixedHeader: fixedHeader,
      sidebarLogo: sidebarLogo,
    };
  },
  actions: {
    changeSetting(data: { key: any; value: any }) {
      const { key, value } = data;
      if (this.hasOwnProperty(key)) {
        this[key] = value;
      }
    },
  },
});

export default useSettingsStore;
