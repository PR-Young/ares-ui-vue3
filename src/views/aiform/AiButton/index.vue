<template>
  <section>
    <el-button type="danger" @click="test"><slot></slot></el-button>
  </section>
</template>

<script>
export default {
  name: "ai-button",
};
</script>
 
<script setup  name="AiButton">
import { reactive } from "vue";
import { getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance();
const state = reactive({
  msg: "自定义组件111",
});

const test = () => {
  proxy.$modal.msg("验证表单设计");
};
</script>