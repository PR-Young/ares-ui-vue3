<template>
  <el-checkbox-group v-bind="$attrs">
    <template v-for="(item, index) in $attrs.options" :key="index">
      <el-checkbox-button
        v-if="$attrs.optionType === 'button'"
        :label="item.value"
      >
        {{ item.label }}
      </el-checkbox-button>
      <el-checkbox v-else :border="$attrs.border" :label="item.value">
        {{ item.label }}
      </el-checkbox>
    </template>
  </el-checkbox-group>
</template>

<script>
export default {
  name: "my-checkbox-group",
};
</script>