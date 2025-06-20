<template>
  <div v-loading="loading" :style="'height:' + height">
    <iframe
      :src="src"
      frameborder="no"
      style="width: 100%; height: 100%"
      scrolling="auto"
    />
  </div>
</template>

<script setup name="Druid">
import { onMounted, ref } from "vue";

const src = import.meta.env.VITE_APP_BASE_API + "/ares/druid/index.html";
const height = ref(document.documentElement.clientHeight - 94.5 + "px;");
const loading = ref(true);

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 230);

  window.onresize = function temp() {
    height.value = document.documentElement.clientHeight - 94.5 + "px;";
  };
});
</script>
