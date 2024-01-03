import { defineStore } from 'pinia'
import Cookies from 'js-cookie'


const useAppStore = defineStore('app', {
  state: () => {
    return {
      sidebar: {
        opened: Cookies.get('sidebarStatus')
          ? !!Cookies.get('sidebarStatus')
          : true,
        withoutAnimation: false,
      },
      device: 'desktop',
      size: Cookies.get('size') || 'default',
    }
  },
  actions: {
    toggleSideBar() {
      this.sidebar.opened = !this.sidebar.opened
      this.sidebar.withoutAnimation = false
      if (this.sidebar.opened) {
        Cookies.set('sidebarStatus', '1')
      } else {
        Cookies.set('sidebarStatus', '0')
      }
    },
    closeSideBar(withoutAnimation: boolean) {
      Cookies.set('sidebarStatus', '0')
      this.sidebar.opened = false
      this.sidebar.withoutAnimation = withoutAnimation
    },
    toggleDevice(device: string) {
      this.device = device
    },
    setSize(size: string) {
      this.size = size
      Cookies.set('size', size)
    },
  },
  getters: {
    getSidebar(): any {
      return this.sidebar
    },
    getSize(): any {
      return this.size
    },
    getDevice(): any {
      return this.device
    }
  }
})

export default useAppStore
