import { defineStore } from 'pinia'
import variables from '@/assets/styles/element-variables.scss?inline'
import defaultSettings from '@/settings'

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings

const useSettingsStore = defineStore('settings', {
  state: () => {
    return {
      theme: variables.theme,
      showSettings: showSettings,
      tagsView: tagsView,
      fixedHeader: fixedHeader,
      sidebarLogo: sidebarLogo,
    }
  },
  actions: {
    changeSetting(data) {
      const { key, value } = data
      if (this.hasOwnProperty(key)) {
        this[key] = value
      }
    },
  }
})

export default useSettingsStore
