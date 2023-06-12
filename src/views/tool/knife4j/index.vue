<template>
  <div></div>
  <!-- <div v-loading="loading" :style="'height:' + height">
          <iframe
            :src="src"
            frameborder="no"
            style="width: 100%; height: 100%"
            scrolling="auto"
          />
        </div> -->
</template>

<script>
export default {
  name: 'Knife4j',
  data() {
    return {
      src: process.env.VUE_APP_BASE_API + '/ares/doc.html',
      height: document.documentElement.clientHeight - 94.5 + 'px;',
      loading: false,
    }
  },
  mounted: function () {
    window.open(this.src)
    // setTimeout(() => {
    //   this.loading = false;
    // }, 230);
    // const that = this;
    // window.onresize = function temp() {
    //   that.height = document.documentElement.clientHeight - 94.5 + "px;";
    // };
  },
}
</script>
