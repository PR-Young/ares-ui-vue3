<template>
  <div
    v-if="isExternal"
    :style="styleExternalIcon"
    class="svg-external-icon svg-icon"
    v-on="$attrs"
  />
  <svg
    v-else
    :class="svgClass"
    aria-hidden="true"
    v-on="$attrs"
    fill="red"
    :style="styleExternalIcon"
  >
    <use :href="iconName" />
  </svg>
</template>

<script setup name="AiSvgIcon">
import { computed } from "vue";

//const modules = import.meta.glob("../icons/svg/*.svg", { eager: true, import: 'default' });

// doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
function isExternalLink(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}
const props = defineProps({
  iconClass: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    default: "",
  },
  // svg 颜色
  color: {
    type: String,
  }, // svg 大小
  size: {
    type: Number,
    default: () => 14,
  },
});

const isExternal = computed(() => {
  return isExternalLink(props.iconClass);
});
const iconName = computed(() => {
  return `#icon-${props.iconClass}`;
});
const svgClass = computed(() => {
  if (props.className) {
    return `svg-icon ${props.className}`;
  }
  return "svg-icon";
});
const styleExternalIcon = computed(() => {
  return {
    //  mask: `url(${props.iconClass}) no-repeat 50% 50%`,
    "font-size": `${props.size}px`,
    color: `${props.color}`,
    //"-webkit-mask": `url(${props.iconClass}) no-repeat 50% 50%`,
  };
});
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
