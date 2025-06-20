<template>
  <el-card>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="basic">
        <basic-info-form ref="basicInfoRef" :info="info" />
      </el-tab-pane>
      <el-tab-pane label="字段信息" name="cloum">
        <el-table
          ref="dragTableRef"
          :data="cloumns"
          row-key="columnId"
          :max-height="tableHeight"
        >
          <el-table-column
            label="序号"
            type="index"
            min-width="5%"
            class-name="allowDrag"
          />
          <el-table-column
            label="字段列名"
            prop="columnName"
            min-width="10%"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="字段描述" min-width="10%">
            <template v-slot="scope">
              <el-input v-model="scope.row.columnComment"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="物理类型"
            prop="columnType"
            min-width="10%"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="Java类型" min-width="11%">
            <template v-slot="scope">
              <el-select v-model="scope.row.javaType">
                <el-option label="Long" value="Long" />
                <el-option label="String" value="String" />
                <el-option label="Integer" value="Integer" />
                <el-option label="Double" value="Double" />
                <el-option label="BigDecimal" value="BigDecimal" />
                <el-option label="Date" value="Date" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="java属性" min-width="10%">
            <template v-slot="scope">
              <el-input v-model="scope.row.javaField"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="插入" min-width="5%">
            <template v-slot="scope">
              <el-checkbox
                true-label="1"
                v-model="scope.row.isInsert"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="编辑" min-width="5%">
            <template v-slot="scope">
              <el-checkbox
                true-label="1"
                v-model="scope.row.isEdit"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="列表" min-width="5%">
            <template v-slot="scope">
              <el-checkbox
                true-label="1"
                v-model="scope.row.isList"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="查询" min-width="5%">
            <template v-slot="scope">
              <el-checkbox
                true-label="1"
                v-model="scope.row.isQuery"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="查询方式" min-width="10%">
            <template v-slot="scope">
              <el-select v-model="scope.row.queryType">
                <el-option label="=" value="EQ" />
                <el-option label="!=" value="NE" />
                <el-option label=">" value="GT" />
                <el-option label=">=" value="GTE" />
                <el-option label="<" value="LT" />
                <el-option label="<=" value="LTE" />
                <el-option label="LIKE" value="LIKE" />
                <el-option label="BETWEEN" value="BETWEEN" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="必填" min-width="5%">
            <template v-slot="scope">
              <el-checkbox
                true-label="1"
                v-model="scope.row.isRequired"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="显示类型" min-width="12%">
            <template v-slot="scope">
              <el-select v-model="scope.row.htmlType">
                <el-option label="文本框" value="input" />
                <el-option label="文本域" value="textarea" />
                <el-option label="下拉框" value="select" />
                <el-option label="单选框" value="radio" />
                <el-option label="复选框" value="checkbox" />
                <el-option label="日期控件" value="datetime" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="字典类型" min-width="12%">
            <template v-slot="scope">
              <el-select
                v-model="scope.row.dictType"
                clearable
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="dict in dictOptions"
                  :key="dict.dictType"
                  :label="dict.dictName"
                  :value="dict.dictType"
                >
                  <span style="float: left">{{ dict.dictName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{
                    dict.dictType
                  }}</span>
                </el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="生成信息" name="genInfo">
        <gen-info-form ref="genInfoRef" :info="info" />
      </el-tab-pane>
    </el-tabs>
    <el-form label-width="100px">
      <el-form-item
        style="text-align: center; margin-left: -100px; margin-top: 10px"
      >
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="close()">返回</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup name="GenEdit">
import { getGenTable, updateGenTable } from "@/api/tool/gen";
import { optionselect as getDictOptionselect } from "@/api/system/dict/type";
import basicInfoForm from "./basicInfoForm.vue";
import genInfoForm from "./genInfoForm.vue";
import Sortable from "sortablejs";
import store from "@/store";
import useTagsViewStore from "@/store/modules/tagsView";
import { onMounted, ref, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";

const { proxy } = getCurrentInstance();
const router = useRouter();
const tagsView = useTagsViewStore(store);

// 选中选项卡的 name
const activeName = ref("cloum");
// 表格的高度
const tableHeight = document.documentElement.scrollHeight - 245 + "px";
// 表列信息
const cloumns = ref([]);
// 字典信息
const dictOptions = ref([]);
// 表详细信息
const info = ref({});
const basicInfoRef = ref();
const genInfoRef = ref();
const dragTableRef = ref();

const { tableId } = router.query;
if (tableId) {
  // 获取表详细信息
  getGenTable(tableId).then((res) => {
    cloumns.value = res.data.rows;
    info.value = res.data.info;
  });
  /** 查询字典下拉列表 */
  getDictOptionselect().then((response) => {
    dictOptions.value = response.data;
  });
}

/** 提交按钮 */
const submitForm = () => {
  const basicForm = basicInfoRef.value.$refs.basicInfoForm;
  const genForm = genInfoRef.value.$refs.genInfoForm;
  Promise.all([basicForm, genForm].map(getFormPromise)).then((res) => {
    const validateResult = res.every((item) => !!item);
    if (validateResult) {
      const genTable = Object.assign({}, basicForm.model, genForm.model);
      genTable.columns = cloumns;
      genTable.params = {
        treeCode: genTable.treeCode,
        treeName: genTable.treeName,
        treeParentCode: genTable.treeParentCode,
      };
      updateGenTable(genTable).then((res) => {
        proxy.msgSuccess(res.msg);
        if (res.code === 200) {
          close();
        }
      });
    } else {
      proxy.msgError("表单校验未通过，请重新检查提交内容");
    }
  });
};
const getFormPromise = (form) => {
  return new Promise((resolve) => {
    form.validate((res) => {
      resolve(res);
    });
  });
};
/** 关闭按钮 */
const close = () => {
  tagsView.delView(router.currentRoute);
  router.push({ path: "/tool/gen", query: { t: Date.now() } });
};

onMounted(() => {
  const el = dragTableRef.value.$el.querySelectorAll(
    ".el-table__body-wrapper > table > tbody"
  )[0];
  const sortable = Sortable.create(el, {
    handle: ".allowDrag",
    onEnd: (evt) => {
      const targetRow = cloumns.value.splice(evt.oldIndex, 1)[0];
      cloumns.value.splice(evt.newIndex, 0, targetRow);
      for (let index in cloumns) {
        cloumns[index].sort = parseInt(index) + 1;
      }
    },
  });
});
</script>
