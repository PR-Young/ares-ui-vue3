<template>
  <div class="icon-body">
    <el-input
      v-model="name"
      style="position: relative"
      clearable
      placeholder="请输入图标名称"
      @clear="filterIcons"
      @input="filterIcons"
    >
      <template v-slot:suffix>
        <el-icon class="el-input__icon"><el-icon-search /></el-icon>
      </template>
    </el-input>
    <div class="icon-list">
      <div
        v-for="(item, index) in iconList"
        :key="index"
        @click="selectedIcon(item)"
      >
        <svg-icon :icon-class="item" style="height: 30px; width: 16px" />
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script setup name="IconSelect">
import { Search as ElIconSearch } from "@element-plus/icons";
import icons from "./requireIcons";
import { ref } from "vue";

const name = ref("");
const iconList = ref(icons);

const emit = defineEmits(["selected"]);
const filterIcons = () => {
  if (name.value) {
    iconList.value = iconList.value.filter((item) => item.includes(name));
  } else {
    iconList.value = icons;
  }
};
const selectedIcon = (name) => {
  emit("selected", name);
  document.body.click();
};
const reset = () => {
  name.value = "";
  iconList.value = icons;
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.icon-body {
  width: 100%;
  padding: 10px;
  .icon-list {
    height: 200px;
    overflow-y: scroll;
    div {
      height: 30px;
      line-height: 30px;
      margin-bottom: -5px;
      cursor: pointer;
      width: 33%;
      float: left;
    }
    span {
      display: inline-block;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
  }
}
</style>
