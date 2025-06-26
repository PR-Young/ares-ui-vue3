<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="登录地址" prop="ipaddr">
        <el-input
          v-model="queryParams.ipaddr"
          placeholder="请输入登录地址"
          clearable
          style="width: 240px"
          size="default"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户名称" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名称"
          clearable
          style="width: 240px"
          size="default"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="登录状态"
          clearable
          size="default"
          style="width: 240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="登录时间">
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
          type="danger"
          :icon="Delete"
          size="default"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['sysLoginInfo:delete']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          :icon="Delete"
          size="default"
          @click="handleClean"
          v-hasPermi="['sysLoginInfo:delete']"
          >清空</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          :icon="Download"
          size="default"
          @click="handleExport"
          v-hasPermi="['sysLoginInfo:export']"
          >导出</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="dataList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="访问编号" align="center" prop="id" />
      <el-table-column label="用户名称" align="center" prop="userName" />
      <el-table-column
        label="登录地址"
        align="center"
        prop="ipAddr"
        width="130"
        :show-overflow-tooltip="true"
      />
      <!-- <el-table-column label="登录地点" align="center" prop="loginLocation" /> -->
      <el-table-column label="浏览器" align="center" prop="browser" />
      <el-table-column label="操作系统" align="center" prop="os" />
      <el-table-column
        label="登录状态"
        align="center"
        prop="status"
        :formatter="statusFormat"
      />
      <!-- <el-table-column label="操作信息" align="center" prop="msg" /> -->
      <el-table-column
        label="登录日期"
        align="center"
        prop="loginTime"
        width="180"
      >
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.loginTime) }}</span>
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
  </div>
</template>

<script setup name="Logininfor">
import { Search, Refresh, Delete, Download } from "@element-plus/icons-vue";
import {
  list,
  delLogininfor,
  cleanLogininfor,
  exportLogininfor,
} from "@/api/monitor/logininfor";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";

const { proxy } = getCurrentInstance();
const addFormRef = ref();
// 遮罩层
const loading = ref(true);
// 选中数组
const ids = ref([]);
// 非多个禁用
const multiple = ref(true);
// 总条数
const total = ref(0);
// 表格数据
const dataList = ref([]);
// 状态数据字典
const statusOptions = ref([]);
// 日期范围
const dateRange = ref([]);
// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  ipaddr: undefined,
  userName: undefined,
  status: undefined,
});

onMounted(() => {
  getList();
  proxy.getDicts("sys_common_status").then((response) => {
    statusOptions.value = response.data;
  });
});

/** 查询登录日志列表 */
const getList = () => {
  loading.value = true;
  list(proxy.addDateRange(queryParams, dateRange.value)).then((response) => {
    dataList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
};
// 登录状态字典翻译
const statusFormat = (row, column) => {
  return proxy.selectDictLabel(statusOptions.value, row.status);
};
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};
/** 重置按钮操作 */
const resetQuery = () => {
  dateRange.value = [];
  proxy.resetForm("queryForm");
  handleQuery();
};
// 多选框选中数据
const handleSelectionChange = (selection) => {
  ids.value = selection.map((item) => item.id);
  multiple.value = !selection.length;
};
/** 删除按钮操作 */
const handleDelete = (row) => {
  const infoIds = row.id || ids;
  proxy
    .$confirm('是否确认删除访问编号为"' + infoIds + '"的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return delLogininfor(infoIds);
    })
    .then(() => {
      getList();
      proxy.msgSuccess("删除成功");
    })
    .catch(function () {});
};
/** 清空按钮操作 */
const handleClean = () => {
  proxy
    .$confirm("是否确认清空所有登录日志数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return cleanLogininfor();
    })
    .then(() => {
      getList();
      proxy.msgSuccess("清空成功");
    })
    .catch(function () {});
};
/** 导出按钮操作 */
const handleExport = () => {
  const queryParams = queryParams;
  proxy
    .$confirm("是否确认导出所有操作日志数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return exportLogininfor(queryParams);
    })
    .then((response) => {
      proxy.download(response.msg);
    })
    .catch(function () {});
};
</script>
