import store from "@/store";
import useAppStore from "@/store/modules/app";
import { useWindowSize } from "@vueuse/core";

const app = useAppStore(store);

const { width, height } = useWindowSize();
const WIDTH = 992; // refer to Bootstrap's responsive design

export default {
  watch: {
    $route(route) {
      if (this.device === "mobile" && this.sidebar.opened) {
        app.closeSideBar(false);
      }
    },
  },
  beforeMount() {
    window.addEventListener("resize", this.resizeHandler);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.resizeHandler);
  },
  mounted() {
    const isMobile = this.$_isMobile();
    if (isMobile) {
      app.toggleDevice("mobile");
      app.closeSideBar(true);
    }
  },
  methods: {
    // use $_ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    $_isMobile() {
      return width.value - 1 < WIDTH;
    },
    resizeHandler() {
      if (!document.hidden) {
        const isMobile = this.$_isMobile();
        app.toggleDevice(isMobile ? "mobile" : "desktop");

        if (isMobile) {
          app.closeSideBar(true);
        }
      }
    },
  },
};
