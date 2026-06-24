<template>
  <component :is="type" v-bind="linkProps()">
    <slot />
  </component>
</template>

<script setup>
import { isExternal } from "@/utils/validate";
import { computed } from "vue";

const props = defineProps({
  to: {
    type: String,
    required: true,
  },
});

const type = computed(() => {
  if (isExternal(props.to)) {
    return "a";
  }
  return "router-link";
});

const linkProps = () => {
  if (isExternal(props.to)) {
    return {
      href: props.to,
      target: "_blank",
      rel: "noopener",
    };
  }
  return {
    to: props.to,
  };
};
</script>
