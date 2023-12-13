<template>
  <div class="container">
    <ai-form-designer
      :show-header="true"
      v-model="formData"
      style="width: 100%"
    />
  </div>
</template>

<script>
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/es/locale/lang/zh-cn";
export default {
  data() {
    return { formData: null };
  },
  watch: {
    formData() {
      console.log(this.formData);
    },
  },
};
</script>