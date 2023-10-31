import { debounce } from '@/utils'

export default {
  data() {
    return {
      sidebarElm: null,
      resizeHandler: null,
    }
  },
  mounted() {
    this.initListener()
  },
  activated() {
    if (!this.resizeHandler) {
      // avoid duplication init
      this.initListener()
    }

    // when keep-alive chart activated, auto resize
    //this.resize()
  },
  beforeUnmount() {
    this.destroyListener()
  },
  deactivated() {
    this.destroyListener()
  },
  methods: {
    // use $_ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    $_sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.resizeHandler()
      }
    },
    initListener() {
      this.resizeHandler = debounce(() => {
        this.resize()
      }, 100)
      window.addEventListener('resize', this.resizeHandler)

      this.sidebarElm =
        document.getElementsByClassName('sidebar-container')[0]
      this.sidebarElm &&
        this.sidebarElm.addEventListener(
          'transitionend',
          this.$_sidebarResizeHandler
        )
    },
    destroyListener() {
      window.removeEventListener('resize', this.resizeHandler)
      this.resizeHandler = null

      this.sidebarElm &&
        this.sidebarElm.removeEventListener(
          'transitionend',
          this.$_sidebarResizeHandler
        )
    },
    resize() {
      const { chart } = this
      chart && chart.resize()
    },
  },
}
