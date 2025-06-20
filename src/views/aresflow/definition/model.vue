<template>
  <div class="container" ref="container">
    <iframe
      ref="iframe"
      :src="iframeUrl"
      frameborder="0"
      width="100%"
      height="100%"
    ></iframe>
  </div>
</template>

<script setup name="WarmFlow">
import { onMounted, ref, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

const definitionId = ref(proxy.$route.query.definitionId).value;
const disabled = ref(proxy.$route.query.disabled).value;
const iframeUrl = ref(
  import.meta.env.VITE_APP_BASE_API +
    `/ares/warm-flow-ui/index.html?id=${definitionId}&disabled=${disabled}&showGrid=true`
);

const iframeLoaded = () => {
  // iframe监听组件内设计器保存事件
  window.onmessage = (event) => {
    switch (event.data.method) {
      case "close":
        close();
        break;
    }
  };
};

/** 关闭按钮 */
function close() {
  const obj = { path: "/flow/definition" };
  proxy.$tab.closeOpenPage(obj);
}

onMounted(() => {
  iframeLoaded();
});
</script>

<style scoped>
.container {
  width: 100%;
  height: calc(100vh - 84px);
}
</style>
