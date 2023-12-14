<template>
  <el-select v-bind="$attrs">
    <el-option
      v-for="item in $attrs.options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script>
import { reactive } from "vue";
export default {
  name: "my-select",
  props: {},
  state: reactive({ options1: [{ label: "A", value: "A" }] }),
};
</script>