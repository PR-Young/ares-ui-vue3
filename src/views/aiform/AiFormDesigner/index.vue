/**
 *Copyright: Copyright (c) 2023
 *Author:Leo
 *Title:  表单设计器
 *GitHub: https://github.com/leooneone/ai-form
 */

<template>
  <div style="height: 100%; background-color: white">
    <el-container style="height: 100%">
      <el-header
        v-if="props.showHeader"
        style="
          height: 50px;
          display: flex;
          -webkit-box-shadow: 0 2px 8px #f0f1f2;
          box-shadow: 0 2px 8px #f0f1f2;
        "
      >
        <span
          style="align-self: center; font-size: 20px; color: rgba(0, 0, 0, 0.7)"
        >
          <strong style="color: var(--el-color-primary)">A</strong>
          <strong style="color: var(--el-color-danger)">i</strong>
          <strong style="color: var(--el-color-primary)">F</strong>
          <strong style="color: var(--el-color-success)">o</strong>
          <strong style="color: var(--el-color-warning)">r</strong>
          <strong style="color: var(--el-color-danger)">m</strong>
          表单设计器</span
        >
      </el-header>
      <el-main style="padding: 0">
        <el-container style="height: 100%">
          <el-aside width="300px" class="left-panel">
            <el-tabs
              v-model="state.activeTabName"
              :stretch="true"
              style="height: 100%"
            >
              <el-tab-pane
                v-for="(item, index) in state.comTabs"
                :label="item.label"
                :name="item.name"
                :key="index"
              >
                <div class="components-list">
                  <template v-for="(com, idx) in item.coms" :key="idx">
                    <div class="components-title">
                      {{ com.title }}
                    </div>
                    <Draggable
                      class="components-draggable"
                      v-model="com.model"
                      :group="{
                        name: 'componentsGroup',
                        pull: 'clone',
                        put: false,
                      }"
                      :clone="cloneComponent"
                      draggable=".components-item"
                      :sort="false"
                      @end="onEnd"
                      item-key="index"
                    >
                      <template #item="{ element, index }">
                        <div
                          :key="index"
                          class="components-item"
                          @click="addComponent(element)"
                        >
                          <div class="components-body">
                            <svg-icon
                              :icon-class="element.tagIcon"
                              class="svg-icon"
                              size="18"
                              :color="com.color"
                            />
                            {{ element.label }}
                          </div>
                        </div>
                      </template>
                    </Draggable>
                  </template>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-aside>
          <el-main>
            <el-container class="center-panel" style="height: 100%">
              <el-header class="btn-bar" style="height: 45px">
                <el-button-group>
                  <el-button
                    @click="setMode('h5')"
                    icon="Cellphone"
                    title="手机"
                    >手机
                  </el-button>
                  <el-button @click="setMode('pc')" icon="Monitor" title="电脑"
                    >电脑</el-button
                  >
                  <el-button icon="View" plain @click="preview" title="预览"
                    >预览</el-button
                  >
                  <el-button icon="Delete" plain @click="empty" title="清空"
                    >清空</el-button
                  >
                  <el-button icon="Plus" plain @click="handleForm" title="保存">
                    保存
                  </el-button>
                </el-button-group>
              </el-header>
              <el-main :class="['device', state.deviceMode]">
                <el-form
                  :model="state.formConf.model"
                  class="drawing-board myForm"
                  :size="state.formConf.size"
                  :label-position="state.formConf.labelPosition"
                  :disabled="state.formConf.disabled"
                  :label-width="state.formConf.labelWidth + 'px'"
                  ><el-scrollbar>
                    <RenderPanel
                      :list="state.drawingList"
                      :animation="200"
                      group="componentsGroup"
                      @end="onMianDragEnd"
                      tag="el-row"
                      :conf="state.formConf"
                      :style="{
                        marginLeft: 0,
                        alignContent: 'start',
                        height: '100%',
                      }"
                      :gutter="state.formConf.gutter"
                    ></RenderPanel>
                  </el-scrollbar>
                  <div class="touchbar"></div>
                </el-form>
                <div v-show="!state.drawingList.length" class="empty-info">
                  从左侧拖入或点选组件进行表单设计
                </div>
              </el-main>
            </el-container>
          </el-main>
          <el-aside class="right-panel"
            ><el-scrollbar>
              <right-panel
                style="width: 100%"
                :active-data="state.activeData"
                :form-conf="state.formConf"
                :show-field="state.drawingList && state.drawingList.length"
                :could-change-require="!isProCondition(state.activeData)"
                :list="state.drawingList"
                @tag-change="tagChange"
                ><slot
                  name="right"
                  :active-data="state.activeData"
                ></slot></right-panel
            ></el-scrollbar>
          </el-aside>
        </el-container>
      </el-main>
    </el-container>
    <el-dialog v-model="state.isErrorShow" title="验证提示">
      <el-alert
        type="error"
        v-for="(item, index) in state.validResults"
        :key="index"
        :title="item"
        style="margin-bottom: 10px"
      ></el-alert>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.isErrorShow = false">知道了</el-button>
        </span>
      </template>
    </el-dialog>
    <PreviewPanel ref="previewPanelRef"></PreviewPanel>

    <!--表单配置详情-->
    <el-dialog
      :title="state.formTitle"
      v-model="state.formOpen"
      width="500px"
      append-to-body
    >
      <el-form
        ref="formRef"
        :model="state.form"
        :rules="state.rules"
        label-width="80px"
      >
        <el-form-item label="表单名称" prop="formName">
          <el-input
            v-model="state.form.formName"
            placeholder="请输入表单名称"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="state.form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
// import { saveAs } from 'file-saver'
// import beautifier from 'beautifier'
// import ClipboardJS from 'clipboard'
// impopathrt FormDrawer from './FormDrawer'

import configs from "./configs";
import { deepClone } from "./utils/index";
// import CodeTypeDialog from './CodeTypeDialog'

import {
  //getDrawingList,
  //saveDrawingList,
  // getIdGlobal,
  // saveIdGlobal,
  getFormConf,
} from "./utils/db";

import {
  inject,
  ref,
  reactive,
  getCurrentInstance,
  onMounted,
  computed,
  watch,
  nextTick,
  defineAsyncComponent,
  provide,
} from "vue";
import { getForm, addForm, updateForm } from "@/api/flowable/form";

import { debounce } from "../utils/index.js";
import { useRoute, useRouter } from "vue-router";

import store from "@/store";
import useTagsViewStore from "@/store/modules/tagsView";
const tagsView = useTagsViewStore(store);

const RenderPanel = defineAsyncComponent(() =>
  import("../Render/RenderPanel.vue")
);
const PreviewPanel = defineAsyncComponent(() => import("./Preview.vue"));
const RightPanel = defineAsyncComponent(() => import("./RightPanel/index.vue"));

const Draggable = defineAsyncComponent(() =>
  import("vuedraggable/src/vuedraggable")
);
const emits = defineEmits(["change"]);
const formConfInDB = getFormConf();
// const idGlobal = getIdGlobal();
const props = defineProps(["conf", "showHeader", "custom"]);

const { query, path } = useRoute();
const router = useRouter();

const { proxy } = getCurrentInstance();
///是否被外部使用
const isInUsed =
  // inject("isInUsed") ||
  function () {
    return false;
  };
const previewPanelRef = ref();
const formRef = ref();
//const storageList = getDrawingList()
//    const drawingList = [] // Array.isArray(storageList) && storageList.length ? storageList : drawingDefalut
const state = reactive({
  comTabs: [
    {
      label: "基础组件",
      name: "common",
      coms: [
        {
          title: "输入型组件",
          model: configs.inputComponents,
          color: "var(--el-color-primary)",
        },
        {
          title: "选择型组件",
          model: configs.selectComponents,
          color: "var(--el-color-primary)",
        },
        {
          title: "布局型组件",
          model: configs.layoutComponents,
          color: "var(--el-color-danger)",
        },
      ],
    },
    {
      label: "高级组件",
      name: "custom",
      coms: [
        {
          title: "扩展组件",
          model: configs.extComponents,
          color: "var(--el-color-primary)",
        },
        {
          title: "定制组件",
          model: configs.customComponents,
          color: "var(--el-color-primary)",
        },
      ],
    },
    {
      label: "模板案例",
      name: "template",
      coms: [
        {
          title: "组合型组件",
          model: configs.customGroupComponents,
          color: "var(--el-color-warning)",
        },
      ],
    },
  ],
  isErrorShow: false,
  validResults: [],
  // idGlobal,
  formConf: configs.formConf,
  customGroupComponents: configs.customGroupComponents,
  labelWidth: 100,
  drawingList: [],
  activeId: "",
  activeData: {},
  activeTabName: "common",

  flowConditions: [],
  tempActiveData: {},
  deviceMode: "pc",
  formTitle: "",
  formOpen: false,
  // 表单参数
  form: {
    id: null,
    formName: null,
    formContent: null,
    remark: null,
  },
  // 表单校验
  rules: {},
});

const msgSuccess = function (msg) {
  proxy.$message({ showClose: true, message: msg, type: "success" });
};

const msgError = function (msg) {
  proxy.$message({ showClose: true, message: msg, type: "error" });
};

const msgWarning = function (msg) {
  proxy.$message({ showClose: true, message: msg, type: "warning" });
};

const msgInfo = function (msg) {
  proxy.$message.info(msg);
};

const created = () => {
  if (typeof props.conf === "object" && props.conf !== null) {
    state.drawingList = props.conf.formItems || [];
    Object.assign(state.formConf, props.conf);
  } else {
    // const drawingListInDB =  getDrawingList()
    // const hasStorage = Array.isArray(drawingListInDB) && drawingListInDB.length > 0
    // state.drawingList = drawingDefalut // hasStorage ? drawingListInDB : drawingDefalut
    formConfInDB && (state.formConf = formConfInDB);
  }
  state.formConf.model = {};
  state.formConf.mode = "designer";
  // activeFormItem(state.drawingList[0])
};

const setMode = (mode) => {
  state.deviceMode = mode;
};
onMounted(() => {
  const formId = query && query.formId;
  if (formId) {
    getForm(formId).then((res) => {
      state.drawingList = JSON.parse(res.data.formContent).fields;
    });
  } else {
  }
  if (props.custom) state.comTabs = state.comTabs.concat(props.custom);
  //Object.assign(state.comTabs,props.custom)
});
watch(
  () => props.conf,
  (conf) => {
    if (typeof conf === "object" && conf !== null) {
      state.drawingList = conf.formItems || [];
      Object.assign(state.formConf, conf);
    }
  }
);

//--start-----------------------流程相关 --------------------
const getSetting = () => {
  return new Promise((resolve, reject) => {
    state.validResults = [];
    if (state.drawingList.length === 0) {
      state.validResults.push("表单不允许为空");
    }

    if (isEmptyRowContainer()) {
      state.validResults.push("您的行容器中没有组件");
    }
    if (state.validResults.length > 0) {
      state.isErrorShow = true;
      reject();
    }
    if (state.drawingList && state.drawingList.length > 0)
      resolve({
        ...state.formConf,
        formItems: JSON.parse(JSON.stringify(state.drawingList)),
      });

    resolve(false);
  });

  proxy.$modal.msg("验证表单设计");
};
const hasCondition = (formId, needIndex = false) => {
  let index = state.flowConditions.findIndex((d) => d.formId === formId);
  return needIndex ? index : index > -1;
};
//添加预置条件
const addPCondition = (data) => {
  if (data.formId === null || data.formId === undefined) return;
  if (!hasCondition(data.formId)) {
    state.flowConditions.unshift(data);
  }
  //updateFlow({ list: state.drawingList, conditions: state.flowConditions }) //(this.flowConditions)
};
//删除指定form
const delPCondition = (formId) => {
  if (formId === null || formId === undefined) return;
  let index = hasCondition(formId, true);
  let cons = state.flowConditions;
  index > -1 && cons.splice(index, 1);
};
//清除预置条件
const clearPCondition = () => {
  //state.flowConditions = []
};
//--end-----------------------流程相关 --------------------

//当list改变时
const handlerListChange = (val) => {
  clearPCondition();
  //是否可以用作流程条件
  const canUsedAsPCon = (conf, parent) => {
    const isRangeCmp = ["ai-date-duration", "ai-time-duration"].includes(
      conf.tag
    );
    if (isRangeCmp && !conf.showDuration) return false;
    if (parent && parent.rowType === "table") return false;
    if (!conf.proCondition || !conf.required) return false;
    if (conf.tag === "el-select" && conf.multiple) return false;
    return true;
  };
  //循环判断子组件是否可以作为流程条件（流程可使用的字段）
  const loop = (data, parent) => {
    if (!data) return;
    Array.isArray(data.children) &&
      data.children.forEach((child) => loop(child, data));
    if (Array.isArray(data)) {
      data.forEach(loop);
    } else {
      canUsedAsPCon(data, parent)
        ? addPCondition(data)
        : delPCondition(data.formId);
    }
  };
  loop(state.drawingList);
  //saveDrawingList(state.drawingList)

  emits("change", state.drawingList, state.flowConditions);
  // if (val.length === 0) this.idGlobal = 100;
};
/**
 * 判断是否是常用组件
 * 非常用组件即套餐组件  不能新填或删除子组件
 */
// isCommonCmp(name) {
//   return this.commonComponents.findIndex(t => t.label === name) > -1
// },
/**
 * 阻止表格中嵌套行容器
 * 定制组件不能添加子组件
 */
const shouldClone = (to, from, target, event, conf) => {
  // .drawing-layout-item —— 行容器的类名 device里面的组件才会带有
  // 直接拖拽的行容器 最外层含有.drawing-layout-item
  // 定制组件 内部含有.drawing-layout-item
  // const hasRow = target.classList.contains('.drawing-layout-item') || target.querySelector('.drawing-layout-item') !== null
  // const isRowContainer = ['布局容器', '表格/明细'].includes(target.innerText) //是阻止从左侧拖拽嵌套
  // const isCusFromLeft = target.classList.contains('custom-component')
  const targetConf = target._underlying_vm_;
  const isRowContainer = conf.cmpType === "common" && conf.rowType === "layout";
  if (isRowContainer) return true;
  if (conf.cmpType === "custom") return false;
  if (conf.rowType === "table") {
    if (targetConf.layout === "rowFormItem") return false;
    if (isFilledPCon([targetConf.formId])) return false;
  }
  return true;
};

let ttt = false;
//激活form item 存储当前元素数据和Id
const activeFormItem = (element) => {
  if (element) {
    state.activeData = element;
    state.formConf.activeId = element.formId;
  }
};
//组件拖放结束，激活新预算为当前元素
const onEnd = (obj, a) => {
  if (obj.from !== obj.to) {
    state.activeId = state.tempActiveData.formId;
    state.activeData = state.tempActiveData;
  }
};
//form内拖放结束
const onMianDragEnd = (obj, a) => {
  activeFormItem(state.drawingList[obj.newIndex]);
};
//getSameTagCmpNum
const getSameTagCmpNum = (tag) => {
  return state.drawingList.reduce((count, item) => {
    if (item.children) {
      return (
        count +
        item.children.reduce((c, t) => {
          return t.tag === tag ? c + 1 : c;
        }, 0)
      );
    }
    return item.tag === tag ? count + 1 : count;
  }, 0);
};
const createCmpLabel = (cmp) => {
  const len = getSameTagCmpNum(cmp.tag);
  return len ? cmp.label + len : cmp.label;
};
///新增组件
const addComponent = (item) => {
  const clone = cloneComponent(item);
  state.drawingList.push(clone);
  activeFormItem(clone);
};
//获取最大Id 新增组件需要考虑兼容， 不如直接时间简单高效
const getMaxId = () => {
  if (state.drawingList.length) {
    let maxId = 0;
    const loop = (data, parent) => {
      if (!data) return;
      Array.isArray(data.children) &&
        data.children.forEach((child) => loop(child, data));
      if (Array.isArray(data)) {
        data.forEach(loop);
      } else {
        maxId = Math.max(data.formId, maxId);
      }
    };
    loop(state.drawingList);

    return maxId;
  }
  return 0;
};
//创建一个id

const getNextId = () => {
  return new Date().getTime();
  const maxId = getMaxId() + 1;
  return maxId;
};
//克隆组件
const cloneComponent = (origin) => {
  const clone = JSON.parse(JSON.stringify(origin));
  clone.formId = `${getNextId()}`;
  // clone.span = formConf.span;
  if (!clone.layout) clone.layout = "colFormItem";
  if (clone.layout === "colFormItem") {
    clone.label = createCmpLabel(clone);
    clone.vModel = `field${clone.formId}`;
    clone.placeholder !== undefined && (clone.placeholder += clone.label);
    state.tempActiveData = clone;
  } else if (clone.layout === "rowFormItem") {
    if (clone.rowType === "table") {
      clone.vModel = `field${clone.formId}`;
    }
    // delete clone.label;
    clone.componentName = `row${clone.formId}`;
    clone.gutter = state.formConf.gutter;
    cloneChildrenOfRowFormItem(clone);
    state.tempActiveData = clone;
  }
  return state.tempActiveData;
};
//克隆rowformitem子组件
const cloneChildrenOfRowFormItem = (rowFormItem) => {
  if (rowFormItem.children && rowFormItem.children.length) {
    const children = rowFormItem.children;
    children.forEach((clone, index) => {
      clone.formId = rowFormItem.formId + index + 1;
      // clone.span = formConf.span;
      clone.__ID = clone.formId + new Date().getTime(); // 改变__ID后可以实现强制更新组件
      if (!clone.layout) clone.layout = "colFormItem";
      if (clone.layout === "colFormItem") {
        clone.vModel = `field${clone.formId}`;
        clone.placeholder !== undefined && (clone.placeholder += clone.label);
      } else if (clone.layout === "rowFormItem") {
        //delete clone.label
        clone.componentName = `row${clone.formId}`;
        clone.gutter = state.formConf.gutter;
        cloneChildrenOfRowFormItem(clone);
      }
    });
  }
};
//是否空的行容器
const isEmptyRowContainer = () => {
  const rowContainer = state.drawingList.find(
    (t) => t.layout === "rowFormItem"
  );
  if (rowContainer) {
    return rowContainer.children.length === 0;
  }
};

const preview = () => {
  var data = JSON.parse(JSON.stringify(state.drawingList));
  previewPanelRef.value?.open(data, state.formConf);
  // const routeData = this.$router.resolve({ name: 'jsxPreview', query: { formData: this.formData } })
  // window.open(routeData.href, '_blank')
};

const empty = () => {
  if (isFilledPCon(state.flowConditions.map((item) => item.formId))) {
    msgWarning("尚有组件已作为流程判断条件，无法删除");
    return;
  }
  proxy
    .$confirm("确定要清空所有组件吗？", "提示", { type: "warning" })
    .then(() => {
      state.drawingList = [];
      // this.idGlobal = 100;
      clearPCondition();
    });
};

/** 表单基本信息 */
const handleForm = () => {
  state.formData = {
    fields: deepClone(state.drawingList),
    ...state.formConf,
  };
  state.form.formContent = JSON.stringify(state.formData);
  state.formOpen = true;
  state.formTitle = "添加表单";
};
// 表单重置
const reset = () => {
  state.form = {
    id: null,
    formName: null,
    formContent: null,
    remark: null,
  };
};
// 取消按钮
const cancel = () => {
  state.formOpen = false;
  reset();
};
/** 保存表单信息 */
const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      if (state.form.id != null) {
        updateForm(state.form).then((response) => {
          msgSuccess("修改成功");
        });
      } else {
        addForm(state.form).then((response) => {
          msgSuccess("新增成功");
        });
      }
      state.drawingList = [];
      state.idGlobal = 100;
      state.open = false;
      // 关闭当前标签页并返回上个页面
      tagsView.delView(path);
      router.go(-1);
    }
  });
};

const createIdAndKey = (item) => {
  item.formId = getNextId();

  if (item.layout === "colFormItem") {
    item.vModel = `field${item.formId}`;
  } else if (item.layout === "rowFormItem") {
    item.componentName = `row${item.formId}`;
  }
  if (Array.isArray(item.children)) {
    item.children = item.children.map((childItem) => createIdAndKey(childItem));
  }
  return item;
};
//是否流程条件
const isFilledPCon = (formIds) => {
  return isInUsed(formIds);
};
const checkColItem = (cmp) => {
  if (!cmp) return false;
  const isPcon = !!state.flowConditions.find((t) => t.formId == cmp.formId);
  return isPcon && isFilledPCon([cmp.formId]);
};
// 判断是否已被流程图作为条件必填项了
const isProCondition = (cmp) => {
  if (Array.isArray(cmp.children) && cmp.children.length) {
    // 容器组件需要检查子元素
    if (cmp.rowType === "table") return false; // 表格的子元素不可能为流程条件
    let flag = false;
    const loop = (el) => {
      if (flag) return; // flag === true 代表找到了一个了 不需要再找下一个
      if (Array.isArray(el)) {
        el.some((e) => {
          if (e.children) loop(e.children);
          return checkColItem(e);
        }) && (flag = true);
      }
    };
    loop(cmp.children);
    return flag;
  } else {
    return checkColItem(cmp);
  }
};

const drawingItemCopy = (item, parent) => {
  let clone = deepClone(item);

  clone = createIdAndKey(clone);
  parent.push(clone);
  activeFormItem(clone);
};

//删除项目时判断是否已经被流程占用
const drawingItemDelete = (index, parent) => {
  // 首先判断是否是流程条件 再判断是否有节点使用过
  if (isProCondition(parent[index])) {
    msgWarning("该组件已作为流程判断条件，无法删除");
    return;
  }
  delPCondition(parent[index].formId);
  parent.splice(index, 1);
  nextTick(() => {
    const len = state.drawingList.length;
    if (len) {
      activeFormItem(state.drawingList[len - 1]);
    }
  });
};
const run = () => {
  state.operationType = "run";
};
// copy() {
//   this.showFileName = false
//   this.operationType = 'copy'
// },
//tag变化
const tagChange = (newTag) => {
  newTag = cloneComponent(newTag);
  newTag.vModel = state.activeData.vModel;
  newTag.formId = state.activeId;
  newTag.span = state.activeData.span;
  delete state.activeData.tag;
  delete state.activeData.tagIcon;
  //   delete state.activeData.document;
  Object.keys(newTag).forEach((key) => {
    if (
      state.activeData[key] !== undefined &&
      typeof state.activeData[key] === typeof newTag[key]
    ) {
      newTag[key] = state.activeData[key];
    }
  });
  state.activeData = newTag;
  updateDrawingList(newTag, state.drawingList);
};
const updateDrawingList = (newTag, list) => {
  const index = list.findIndex((item) => item.formId === state.activeId);
  if (index > -1) {
    list.splice(index, 1, newTag);
  } else {
    list.forEach((item) => {
      if (Array.isArray(item.children)) {
        updateDrawingList(newTag, item.children);
      }
    });
  }
};

provide("activeFormItem", activeFormItem);
provide("deleteItem", drawingItemDelete);
provide("copyItem", drawingItemCopy);
provide("addPCondition", addPCondition);
provide("delPCondition", delPCondition);
watch(
  () => state.drawingList,
  (val) => {
    if (!val) return;

    debounce(handlerListChange(), 400); // 使用了deep 所以刷新会比较频繁
  },
  {
    deep: true,
    immediate: true,
  }
);

created();
// 将这个方法暴露出去,这样父组件就可以使用了哈
defineExpose({
  getSetting,
});
</script>

<style lang="scss"  >
@use "./styles/index.scss";
</style>
<style lang="scss" scoped>
.device {
  > form {
    .el-row {
      padding-top: 20px;
    }
    margin: 0 auto;
    padding: 10px;
    height: calc(100% - 20px);
  }
}

.device.pc {
  padding: 0;
  form {
  }
}
.device.h5 {
  form {
    width: 390px;
    border-radius: 15px;
    box-shadow: 0 0 1px 10px #495060;
    .touchbar {
      margin: 0 auto;
      width: 50%;
      background-color: #ccc;
      height: 5px;
      bottom: 10px;
      position: relative;
      border-radius: 10px;
    }
  }
}
.components-body {
  :deep(.svg-icon) {
    width: 18px;
    height: 18px;
    // vertical-align: bottom;
    fill: currentColor;
    overflow: hidden;
    vertical-align: -0.15em;
    float: right;
  }
}

.center-panel {
}

.left-panel {
  border-right: 1px solid #f1e8e8;
  //	width: 260px!important;
}
.right-panel {
  width: 300px;
  padding-right: 5px;
  border-left: 1px solid #f1e8e8;
}
</style>