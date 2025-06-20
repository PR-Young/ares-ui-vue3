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

<script setup name="Knife4j">
import { onMounted, ref } from "vue";

const src = import.meta.env.VITE_APP_BASE_API + "/ares/doc.html";
const height = document.documentElement.clientHeight - 94.5 + "px;";
const loading = ref(false);

onMounted(() => {
  window.open(src);
  // setTimeout(() => {
  //   loading.value = false;
  //}, 230);
  // const that = this;
  // window.onresize = function temp() {
  //   that.height = document.documentElement.clientHeight - 94.5 + "px;";
  // };
});
</script>
