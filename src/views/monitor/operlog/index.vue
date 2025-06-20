<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="系统模块" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入系统模块"
          clearable
          style="width: 240px"
          size="default"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作人员" prop="operName">
        <el-input
          v-model="queryParams.operName"
          placeholder="请输入操作人员"
          clearable
          style="width: 240px"
          size="default"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="businessType">
        <el-select
          v-model="queryParams.businessType"
          placeholder="操作类型"
          clearable
          size="default"
          style="width: 240px"
        >
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="操作状态"
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
      <el-form-item label="操作时间">
        <el-date-picker
          v-model="dateRange"
          size="default"
          style="width: 240px"
          value-format="yyyy-MM-dd"
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
          v-hasPermi="['monitor:operlog:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          :icon="Delete"
          size="default"
          @click="handleClean"
          v-hasPermi="['monitor:operlog:remove']"
          >清空</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          :icon="Download"
          size="default"
          @click="handleExport"
          v-hasPermi="['system:config:export']"
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
      <el-table-column label="日志编号" align="center" prop="operId" />
      <el-table-column label="系统模块" align="center" prop="title" />
      <el-table-column
        label="操作类型"
        align="center"
        prop="businessType"
        :formatter="typeFormat"
      />
      <el-table-column label="请求方式" align="center" prop="requestMethod" />
      <el-table-column label="操作人员" align="center" prop="operName" />
      <el-table-column
        label="主机"
        align="center"
        prop="operIp"
        width="130"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="操作地点" align="center" prop="operLocation" />
      <el-table-column
        label="操作状态"
        align="center"
        prop="status"
        :formatter="statusFormat"
      />
      <el-table-column
        label="操作日期"
        align="center"
        prop="operTime"
        width="180"
      >
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.operTime) }}</span>
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
            @click="handleView(scope.row, scope.index)"
            v-hasPermi="['monitor:operlog:query']"
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

    <!-- 操作日志详细 -->
    <el-dialog title="操作日志详细" v-model="open" width="700px" append-to-body>
      <el-form
        ref="addFormRef"
        :model="form"
        label-width="100px"
        size="default"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作模块："
              >{{ form.title }} / {{ typeFormat(form) }}</el-form-item
            >
            <el-form-item label="登录信息："
              >{{ form.operName }} / {{ form.operIp }} /
              {{ form.operLocation }}</el-form-item
            >
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求地址：">{{ form.operUrl }}</el-form-item>
            <el-form-item label="请求方式：">{{
              form.requestMethod
            }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作方法：">{{ form.method }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="请求参数：">{{ form.operParam }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="返回参数：">{{
              form.jsonResult
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作状态：">
              <div v-if="form.status === 0">正常</div>
              <div v-else-if="form.status === 1">失败</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作时间：">{{
              parseTime(form.operTime)
            }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="异常信息：" v-if="form.status === 1">{{
              form.errorMsg
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

<script setup name="Operlog">
import {
  Search,
  Refresh,
  Delete,
  Download,
  View,
} from "@element-plus/icons-vue";
import {
  list,
  delOperlog,
  cleanOperlog,
  exportOperlog,
} from "@/api/monitor/operlog";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";

const { proxy } = getCurrentInstance();
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
// 是否显示弹出层
const open = ref(false);
// 类型数据字典
const typeOptions = ref([]);
// 类型数据字典
const statusOptions = ref([]);
// 日期范围
const dateRange = ref([]);
// 表单参数
const form = ref({});
// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  title: undefined,
  operName: undefined,
  businessType: undefined,
  status: undefined,
});

onMounted(() => {
  getList();
  proxy.getDicts("sys_oper_type").then((response) => {
    typeOptions.value = response.data;
  });
  proxy.getDicts("sys_common_status").then((response) => {
    statusOptions.value = response.data;
  });
});

/** 查询登录日志 */
const getList = () => {
  loading.value = true;
  list(proxy.addDateRange(queryParams, dateRange)).then((response) => {
    dataList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
};
// 操作日志状态字典翻译
const statusFormat = (row, column) => {
  return proxy.selectDictLabel(statusOptions.value, row.status);
};
// 操作日志类型字典翻译
const typeFormat = (row, column) => {
  return proxy.selectDictLabel(typeOptions.value, row.businessType);
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
  ids.value = selection.map((item) => item.operId);
  multiple.value = !selection.length;
};
/** 详细按钮操作 */
const handleView = (row) => {
  open.value = true;
  form.value = row;
};
/** 删除按钮操作 */
const handleDelete = (row) => {
  const operIds = row.operId || ids;
  proxy
    .$confirm('是否确认删除日志编号为"' + operIds + '"的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return delOperlog(operIds);
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
    .$confirm("是否确认清空所有操作日志数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return cleanOperlog();
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
      return exportOperlog(queryParams);
    })
    .then((response) => {
      proxy.download(response.msg);
    })
    .catch(function () {});
};
</script>
