<template>
  <div>
    <svg-icon
      :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
      @click="click"
    />
  </div>
</template>

<script setup name="Screenfull">
import screenfull from "screenfull";
import { onBeforeUnmount, onMounted, ref, getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance();
const isFullscreen = ref(false);

onMounted(() => {
  init();
});
onBeforeUnmount(() => {
  destroy();
});

const click = () => {
  if (!screenfull.isEnabled) {
    proxy.$message({
      message: "you browser can not work",
      type: "warning",
    });
    return false;
  }
  screenfull.toggle();
};
const change = () => {
  isFullscreen.value = screenfull.isFullscreen;
};
const init = () => {
  if (screenfull.isEnabled) {
    screenfull.on("change", change);
  }
};

const destroy = () => {
  if (screenfull.isEnabled) {
    screenfull.off("change", change);
  }
};
</script>

<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
