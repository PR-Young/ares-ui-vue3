<template>
  <div class="icons-container">
    <aside>
      <a href="#">图标示例</a>
    </aside>
    <el-tabs type="border-card">
      <el-tab-pane label="Icons">
        <div v-for="item of svgIcons" :key="item">
          <el-tooltip placement="top">
            <template v-slot:content>
              <div>{{ generateIconCode(item) }}</div>
            </template>
            <div class="icon-item">
              <svg-icon :icon-class="item" class-name="disabled" />
              <span>{{ item }}</span>
            </div>
          </el-tooltip>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Element-UI Icons">
        <div v-for="item of elementIcons" :key="item">
          <el-tooltip placement="top">
            <template v-slot:content>
              <div>{{ generateElementIconCode(item) }}</div>
            </template>
            <div class="icon-item">
              <el-icon> {{ showIcons(item) }}</el-icon>
              <span>{{ item }}</span>
            </div>
          </el-tooltip>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup name="Icons">
import svgIcons from "./svg-icons";
import elementIcons from "./element-icons";

const generateIconCode = (symbol) => {
  return `<svg-icon icon-class="${symbol}" />`;
};
const generateElementIconCode = (symbol) => {
  return `<${symbol} />`;
};
const showIcons = (symbol) => {
  return `<${symbol} />`;
};
</script>

<style lang="scss" scoped>
.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;
  .icon-item {
    margin: 20px;
    height: 85px;
    text-align: center;
    width: 100px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }

  .disabled {
    pointer-events: none;
  }
}
</style>
