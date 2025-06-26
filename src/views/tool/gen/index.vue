<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="表名称" prop="tableName">
        <el-input
          v-model="queryParams.tableName"
          placeholder="请输入表名称"
          clearable
          size="default"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="表描述" prop="tableComment">
        <el-input
          v-model="queryParams.tableComment"
          placeholder="请输入表描述"
          clearable
          size="default"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          size="default"
          style="width: 240px"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="数据源">
        <el-radio-group
          v-model="queryParams.flag"
          class="ml-4"
          @change="handleQuery"
        >
          <el-radio label="master">主库</el-radio>
          <el-radio label="slave">从库</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="Search"
          size="default"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button :icon="Refresh" size="default" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          :icon="Operation"
          size="default"
          @click="handleGenBasicInfo"
          >生成配置</el-button
        >
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="tableList">
      <el-table-column
        label="表名称"
        align="center"
        prop="TABLE_NAME"
        :show-overflow-tooltip="true"
        width="300"
      />
      <el-table-column
        label="表描述"
        align="center"
        prop="TABLE_COMMENT"
        :show-overflow-tooltip="true"
        width="300"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="CREATE_TIME"
        width="200"
      >
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.CREATE_TIME) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        prop="UPDATE_TIME"
        width="200"
      >
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.UPDATE_TIME) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template v-slot="scope">
          <el-button
            link
            size="default"
            type="primary"
            :icon="View"
            @click="handlePreview(scope.row)"
            >预览</el-button
          >
          <el-button
            link
            size="default"
            type="primary"
            :icon="Download"
            @click="handleGenTable(scope.row)"
            >生成代码</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 预览界面 -->
    <el-dialog
      :title="preview.title"
      v-model="preview.open"
      width="80%"
      top="5vh"
      append-to-body
    >
      <el-tabs v-model="preview.activeName">
        <el-tab-pane
          v-for="(value, key) in preview.data"
          :label="key.substring(0, key.indexOf('.ftl'))"
          :name="key.substring(0, key.indexOf('.ftl'))"
          :key="key"
        >
          <pre>{{ value }}</pre>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <import-table ref="importRef" @ok="handleQuery" />
  </div>
</template>

<script setup name="Gen">
import {
  Search,
  Refresh,
  View,
  Download,
  Operation,
} from "@element-plus/icons-vue";
import { listDbTable, previewTable, delTable } from "@/api/tool/gen";
import importTable from "./importTable.vue";
import { downLoadZip } from "@/utils/zipdownload";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
// 遮罩层
const loading = ref(true);
// 唯一标识符
const uniqueId = ref();
// 选中数组
const ids = ref([]);
// 选中表数组
const tableNames = ref([]);
// 非单个禁用
const single = ref(true);
// 非多个禁用
const multiple = ref(true);
// 总条数
const total = ref(0);
// 表数据
const tableList = ref([]);
// 日期范围
const dateRange = ref();
// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  tableName: undefined,
  tableComment: undefined,
  flag: "master",
});
// 预览参数
const preview = ref({
  open: false,
  title: "代码预览",
  data: {},
  activeName: "Entity.ftl",
});
const importRef = ref();

onMounted(() => {
  getList();
});
const activated = () => {
  const time = router.query.t;
  if (time != null && time != uniqueId.value) {
    uniqueId.value = time;
    resetQuery();
  }
};

/** 查询表集合 */
const getList = () => {
  loading.value = true;
  listDbTable(proxy.addDateRange(queryParams, dateRange.value)).then(
    (response) => {
      tableList.value = response.rows;
      total.value = response.total;
      loading.value = false;
    }
  );
};
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};
/** 生成代码操作 */
const handleGenTable = (row) => {
  const tableNames = row.TABLE_NAME;
  if (tableNames == "") {
    proxy.msgError("请选择要生成的数据");
    return;
  }
  downLoadZip(
    "ares/tool/gen/genCode/" + queryParams.flag + "/" + tableNames,
    "code"
  );
};
const handleGenBasicInfo = () => {
  router.push("/genbasicinfo/basicinfo");
};
/** 打开导入表弹窗 */
const openImportTable = () => {
  importRef.value.show();
};
/** 重置按钮操作 */
const resetQuery = () => {
  dateRange.value = [];
  proxy.resetForm("queryForm");
  handleQuery();
};
/** 预览按钮 */
const handlePreview = (row) => {
  previewTable(queryParams.flag, row.TABLE_NAME).then((response) => {
    preview.value.data = response.data;
    preview.value.open = true;
  });
};
// 多选框选中数据
const handleSelectionChange = (selection) => {
  ids.value = selection.map((item) => item.tableId);
  tableNames.value = selection.map((item) => item.tableName);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};
/** 修改按钮操作 */
const handleEditTable = (row) => {
  const tableId = row.tableId || ids.value[0];
  router.push({ path: "/genedit/edit", query: { tableId: tableId } });
};
/** 删除按钮操作 */
const handleDelete = (row) => {
  const tableIds = row.tableId || ids;
  proxy
    .$confirm('是否确认删除表编号为"' + tableIds + '"的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return delTable(tableIds);
    })
    .then(() => {
      getList();
      proxy.msgSuccess("删除成功");
    })
    .catch(function () {});
};
</script>
