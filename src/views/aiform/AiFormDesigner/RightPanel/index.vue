<!---
按组件拆分、重构
Develped by Leo on 2023.9.24
-->
<template>
  <el-tabs v-model="state.currentTab" class="center-tabs" :stretch="true">
    <el-tab-pane label="组件属性" name="field">
      <div class="field-box">
        <!-- <a class="document-link" target="_blank" :href="documentLink" title="查看组件文档">
<i class="el-icon-link" />
</a>-->

        <!-- 组件属性 -->
        <el-form
          v-show="state.currentTab === 'field' && showField"
          size="small"
          label-width="90px"
        >
          <GeneralPropertyPanel
            :data="props.activeData"
            :could-change-require="props.couldChangeRequire"
          ></GeneralPropertyPanel>
          <slot></slot>
          <component
            v-if="activeData.tag && components[activeData.tag] !== undefined"
            :is="components[activeData.tag]"
            :data="activeData"
            :list="list"
          ></component>

          <div v-for="(val, key, index) in activeData">
            <!--
<el-alert>{{ key }}|{{ val }}|{{ index }}</el-alert> -->
          </div>

          <!-- <el-form-item v-if="activeData.changeTag" label="组件类型">
    <el-select
      v-model="activeData.tagIcon"
      placeholder="请选择组件类型"
      :style="{width: '100%'}"
      @change="tagChange"
    >
      <el-option-group v-for="group in tagList" :key="group.label" :label="group.label">
        <el-option
          v-for="item in group.options"
          :key="item.label"
          :label="item.label"
          :value="item.tagIcon"
        >
          <svg-icon class="node-icon" :icon-class="item.tagIcon" />
          <span> {{ item.label }}</span>
        </el-option>
      </el-option-group>
    </el-select>
  </el-form-item>-->

          <!-- <el-form-item
    v-if="activeData.componentName!==undefined"
    label="组件名"
  >{{ activeData.componentName }}</el-form-item> -->
          <el-alert v-if="activeData.description" type="info">{{
            activeData.description
          }}</el-alert>

          <AdvancedPropertyPanel
            :data="props.activeData"
          ></AdvancedPropertyPanel>
        </el-form>
      </div>
    </el-tab-pane>

    <el-tab-pane label="表单属性" name="form">
      <FormPropertyPanel :form-conf="props.formConf"></FormPropertyPanel>
    </el-tab-pane>
  </el-tabs>
</template>
<script setup>
let components = {};

const elModules = import.meta.glob("./Elements/*.vue", {
  eager: true,
  import: "default",
});
for (const path in elModules) {
  let cname = elModules[path].__name;
  components[cname] = elModules[path];

  //console.log('cname', elModules[path],cname, components[cname])
}

import { defineAsyncComponent, reactive, computed, watch } from "vue";
const props = defineProps([
  "showField",
  "activeData",
  "formConf",
  "couldChangeRequire",
  "list",
]);
const AdvancedPropertyPanel = defineAsyncComponent(() =>
  import("./Advanced/index.vue")
);
const FormPropertyPanel = defineAsyncComponent(() => import("./form.vue"));
const GeneralPropertyPanel = defineAsyncComponent(() =>
  import("./general.vue")
);

const state = reactive({
  currentTab: "field",
  data: {},
  name: "el-button",
});
</script>

<style lang="scss">
.document-link {
  position: absolute;
  display: block;
  width: 26px;
  height: 26px;
  top: 0;
  left: 0;
  cursor: pointer;
  background: #409eff;
  z-index: 1;
  border-radius: 0 0 6px 0;
  text-align: center;
  line-height: 26px;
  color: #fff;
  font-size: 18px;
}
.node-label {
  font-size: 14px;
}
.node-icon {
  color: #bebfc3;
}
</Style>
