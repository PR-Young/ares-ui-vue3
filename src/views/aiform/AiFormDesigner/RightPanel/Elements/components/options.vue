<template v-if="['my-checkbox-group', 'my-radio-group', 'my-select'].indexOf(props.data.tag) > -1">
  <el-form-item v-if="props.data.optionType !== undefined" label="选项样式">
    <el-radio-group v-model="props.data.optionType">
      <el-radio-button label="default">默认</el-radio-button>
      <el-radio-button label="button">按钮</el-radio-button>
    </el-radio-group>
  </el-form-item>
  <el-divider>选项</el-divider>
  <el-radio-group v-if="!props.data.multiple" v-model="props.data.defaultValue">
    <draggable
      :list="props.data.options"
      :animation="340"
      group="selectItem"
      handle=".option-drag"
      item-key="index-options"
      ><template #item="{ element, index }">
        <div :key="index" class="select-item">
          <el-radio :label="element.value">
            <div class="select-line-icon option-drag">
              <el-icon><Operation></Operation></el-icon></div
          ></el-radio>
          <el-input v-model="element.label" placeholder="选项名" />
          <el-input placeholder="选项值" v-model="element.value" />
          <div
            class="close-btn select-line-icon"
            @click="props.data.options.splice(index, 1)"
          >
            <el-icon><Remove></Remove></el-icon>
          </div>
        </div>
      </template>
    </draggable>
  </el-radio-group>

  <el-checkbox-group v-else v-model="props.data.defaultValue">
    <draggable
      :list="props.data.options"
      :animation="340"
      group="selectItem"
      handle=".option-drag"
      item-key="index-check"
      ><template #item="{ element, index }">
        <div :key="index" class="select-item">
          <el-checkbox :label="element.value">
            <div class="select-line-icon option-drag">
              <el-icon><Operation></Operation></el-icon>
            </div>
          </el-checkbox>
          <el-input v-model="element.label" placeholder="选项名" />
          <el-input placeholder="选项值" v-model="element.value" />
          <div
            class="close-btn select-line-icon"
            @click="props.data.options.splice(index, 1)"
          >
            <el-icon><Remove></Remove></el-icon>
          </div>
        </div>
      </template>
    </draggable>
  </el-checkbox-group>
  <div style="margin-left: 20px">
    <el-button
      style="padding-bottom: 0"
      icon="el-icon-circle-plus-outline"
      type="text"
      @click="addSelectItem"
      >添加选项</el-button
    >
  </div>
  <el-divider />
</template>

<script setup>
import { isNumberStr } from "../../../utils/index.js";

import draggable from "vuedraggable/src/vuedraggable";
const props = defineProps(["data"]);

const setOptionValue = (item, val) => {
  let res = isNumberStr(val) ? +val : val;
  item.label = res;
  item.value = res;
};

const addSelectItem = () => {
  props.data.options.push({
    label: "",
    value: "",
  });
};
</script>
<style lang="scss">
.select-item {
  display: flex;
  border: 1px dashed #fff;
  box-sizing: border-box;
  .close-btn {
    cursor: pointer;
    color: #f56c6c;
  }
  .el-input {
    & + .el-input {
      margin-left: 4px;
    }
  }
  & + .select-item {
    margin-top: 4px;
  }
  &.sortable-chosen {
    border: 1px dashed #409eff;
  }
}

.el-radio:last-of-type {
  margin-right: 0;
}
.option-drag {
  cursor: move;
}
.select-line-icon {
  font-size: 22px;
  padding: 0 4px;
  color: #777;
}
</style>
