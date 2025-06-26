<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="任务名称" prop="jobName">
        <el-input
          v-model="queryParams.jobName"
          placeholder="请输入任务名称"
          clearable
          size="default"
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任务组名" prop="jobGroup">
        <el-select
          v-model="queryParams.jobGroup"
          placeholder="请任务组名"
          clearable
          size="default"
          style="width: 240px"
        >
          <el-option
            v-for="dict in jobGroupOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="执行状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择执行状态"
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
      <el-form-item label="执行时间">
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
          v-hasPermi="['quartz:logDelete']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          :icon="Delete"
          size="default"
          @click="handleClean"
          v-hasPermi="['quartz:logDelete']"
          >清空</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          :icon="Download"
          size="default"
          @click="handleExport"
          v-hasPermi="['quartz:logExport']"
          >导出</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="jobLogList"
      border
      stripe
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="任务名称"
        align="center"
        prop="jobName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="任务组名"
        align="center"
        prop="jobGroup"
        :formatter="jobGroupFormat"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="调用目标字符串"
        align="center"
        prop="invokeTarget"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="日志信息"
        align="center"
        prop="jobMessage"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="执行状态"
        align="center"
        prop="status"
        :formatter="statusFormat"
      />
      <el-table-column
        label="执行时间"
        align="center"
        prop="startTime"
        sortable="custom"
        width="180"
      >
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.startTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template v-slot="scope">
          <el-button
            size="default"
            type="primary"
            link
            :icon="View"
            @click="handleView(scope.row)"
            >详细</el-button
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

    <!-- 调度日志详细 -->
    <el-dialog title="调度日志详细" v-model="open" width="700px" append-to-body>
      <el-form
        ref="addFormRef"
        :model="form"
        label-width="100px"
        size="default"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="日志序号：">{{ form.jobLogId }}</el-form-item>
            <el-form-item label="任务名称：">{{ form.jobName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务分组：">{{ form.jobGroup }}</el-form-item>
            <el-form-item label="执行时间：">{{
              form.createTime
            }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="调用方法：">{{
              form.invokeTarget
            }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="日志信息：">{{
              form.jobMessage
            }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="执行状态：">
              <div v-if="form.status == 0">正常</div>
              <div v-else-if="form.status == 1">失败</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="异常信息：" v-if="form.status == 1">{{
              form.exceptionInfo
            }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="open = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="JobLog">
import {
  Search,
  Refresh,
  Delete,
  Download,
  View,
} from "@element-plus/icons-vue";
import {
  listJobLog,
  delJobLog,
  exportJobLog,
  cleanJobLog,
} from "@/api/monitor/jobLog";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

const { proxy } = getCurrentInstance();
const addFormRef = ref();
const router = useRouter();

// 遮罩层
const loading = ref(true);
// 选中数组
const ids = ref([]);
// 非多个禁用
const multiple = ref(true);
// 总条数
const total = ref(0);
// 调度日志表格数据
const jobLogList = ref([]);
// 是否显示弹出层
const open = ref(false);
// 日期范围
const dateRange = ref("");
// 表单参数
const form = ref({});
// 执行状态字典
const statusOptions = ref([
  { dictValue: 0, dictLabel: "成功" },
  { dictValue: 1, dictLabel: "失败" },
]);
// 查询参数
// 任务组名字典
const jobGroupOptions = ref([
  { dictValue: "DEFAULT", dictLabel: "默认组" },
  { dictValue: "SYSTEM", dictLabel: "系统组" },
]);
// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  jobName: undefined,
  jobGroup: undefined,
  status: undefined,
  sortColumn: undefined,
  sortAsc: undefined,
});

onMounted(() => {
  getList();
  // proxy.getDicts("sys_job_status").then(response => {
  //   statusOptions = response.data;
  // });
  // proxy.getDicts("sys_job_group").then(response => {
  //   jobGroupOptions = response.data;
  // });
});

const sortChange = (data) => {
  const { prop, order } = data;
  queryParams.sortColumn = prop;
  queryParams.sortAsc = order === null ? "descending" : order;
  getList();
};
/** 查询调度日志列表 */
const getList = () => {
  loading.value = true;
  listJobLog(proxy.addDateRange(queryParams, dateRange.value)).then(
    (response) => {
      jobLogList.value = response.rows;
      total.value = response.total;
      loading.value = false;
    }
  );
};
// 执行状态字典翻译
const statusFormat = (row, column) => {
  return proxy.selectDictLabel(statusOptions.value, row.status);
};
// 任务组名字典翻译
const jobGroupFormat = (row, column) => {
  return proxy.selectDictLabel(jobGroupOptions.value, row.jobGroup);
};
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};
/** 重置按钮操作 */
const resetQuery = () => {
  dateRange.value = "";
  proxy.resetForm("queryForm");
  handleQuery();
};
// 多选框选中数据
const handleSelectionChange = (selection) => {
  ids.value = selection.map((item) => item.id);
  multiple.value = !selection.length;
};
/** 详细按钮操作 */
const handleView = (row) => {
  open.value = true;
  form.value = row;
};
/** 删除按钮操作 */
const handleDelete = (row) => {
  const jobLogIds = ids;
  proxy
    .$confirm(
      '是否确认删除调度日志编号为"' + jobLogIds.value + '"的数据项?',
      "警告",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    )
    .then(function () {
      return delJobLog(jobLogIds);
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
    .$confirm("是否确认清空所有调度日志数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return cleanJobLog();
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
    .$confirm("是否确认导出所有调度日志数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return exportJobLog(queryParams);
    })
    .then((response) => {
      proxy.download(response.msg);
    })
    .catch(function () {});
};
</script>
