<template>
  <DateFormItems :data="props.data"></DateFormItems>
</template>
  
  
  <script setup>
import { defineAsyncComponent } from "vue";

const props = defineProps(["data"]);

const DateFormItems = defineAsyncComponent(() =>
  import("./components/date.vue")
);
</script>