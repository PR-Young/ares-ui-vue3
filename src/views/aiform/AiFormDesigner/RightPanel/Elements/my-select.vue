<template>
  <el-form-item v-if="props.data.tag === 'el-select'" label="能否搜索">
    <el-switch v-model="props.data.filterable" />
  </el-form-item>

  <el-form-item v-if="props.data.tag === 'el-select'" label="是否多选">
    <el-switch v-model="props.data.multiple" />
  </el-form-item>

  <OptionsPanel :data="props.data"></OptionsPanel>
</template>


<script setup>
import { defineAsyncComponent } from "vue";

const props = defineProps(["data"]);

const OptionsPanel = defineAsyncComponent(() =>
  import("./components/options.vue")
);
</script>