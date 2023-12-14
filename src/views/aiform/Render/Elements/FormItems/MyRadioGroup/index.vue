<template>
  <el-radio-group v-bind="$attrs">
    <template v-for="(item, index) in $attrs.options" :key="index">
      <el-radio-button
        v-if="$attrs.optionType === 'button'"
        :label="item.value"
        >{{ item.label }}</el-radio-button
      >
      <el-radio v-else :border="$attrs.border" :label="item.value">{{
        item.label
      }}</el-radio>
    </template>
  </el-radio-group>
</template>
<script>
export default {
  name: "my-radio-group",
};
</script>