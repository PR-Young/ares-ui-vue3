<template>
  <el-form-item
    v-if="props.data['show-stops'] !== undefined"
    label="显示间断点"
  >
    <el-switch v-model="props.data['show-stops']" />
  </el-form-item>
</template>


<script setup>
const props = defineProps(["data"]);
</script>