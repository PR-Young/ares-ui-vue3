<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="参数名称" prop="configName">
        <el-input
          v-model="queryParams.configName"
          placeholder="请输入参数名称"
          clearable
          size="default"
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="参数键名" prop="configKey">
        <el-input
          v-model="queryParams.configKey"
          placeholder="请输入参数键名"
          clearable
          size="default"
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="系统内置" prop="configType">
        <el-select
          v-model="queryParams.configType"
          placeholder="系统内置"
          clearable
          size="default"
        >
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
          :icon="Plus"
          size="default"
          @click="handleAdd"
          v-hasPermi="['system:config:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          :icon="Edit"
          size="default"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:config:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          :icon="Delete"
          size="default"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:config:remove']"
          >删除</el-button
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
      :data="configList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="参数主键" align="center" prop="configId" />
      <el-table-column
        label="参数名称"
        align="center"
        prop="configName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="参数键名"
        align="center"
        prop="configKey"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="参数键值" align="center" prop="configValue" />
      <el-table-column
        label="系统内置"
        align="center"
        prop="configType"
        :formatter="typeFormat"
      />
      <el-table-column
        label="备注"
        align="center"
        prop="remark"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
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
            :icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:config:edit']"
            >修改</el-button
          >
          <el-button
            size="default"
            type="primary"
            link
            :icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:config:remove']"
            >删除</el-button
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="addFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="参数名称" prop="configName">
          <el-input v-model="form.configName" placeholder="请输入参数名称" />
        </el-form-item>
        <el-form-item label="参数键名" prop="configKey">
          <el-input v-model="form.configKey" placeholder="请输入参数键名" />
        </el-form-item>
        <el-form-item label="参数键值" prop="configValue">
          <el-input v-model="form.configValue" placeholder="请输入参数键值" />
        </el-form-item>
        <el-form-item label="系统内置" prop="configType">
          <el-radio-group v-model="form.configType">
            <el-radio
              v-for="dict in typeOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          />
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

<script setup name="Config">
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  Download,
} from "@element-plus/icons-vue";
import {
  listConfig,
  getConfig,
  delConfig,
  addConfig,
  updateConfig,
  exportConfig,
} from "@/api/system/config";
import { getCurrentInstance, ref, reactive, onMounted } from "vue";

const { proxy } = getCurrentInstance();
const addFormRef = ref();
// 遮罩层
const loading = ref(true);
// 选中数组
const ids = ref([]);
// 非单个禁用
const single = ref(true);
// 非多个禁用
const multiple = ref(true);
// 总条数
const total = ref(0);
// 参数表格数据
const configList = ref([]);
// 弹出层标题
const title = ref();
// 是否显示弹出层
const open = ref(false);
// 类型数据字典
const typeOptions = ref([]);
// 日期范围
const dateRange = ref([]);
// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  configName: undefined,
  configKey: undefined,
  configType: undefined,
});
// 表单参数
const form = ref({});
// 表单校验
const rules = ref({
  configName: [
    { required: true, message: "参数名称不能为空", trigger: "blur" },
  ],
  configKey: [{ required: true, message: "参数键名不能为空", trigger: "blur" }],
  configValue: [
    { required: true, message: "参数键值不能为空", trigger: "blur" },
  ],
});

onMounted(() => {
  getList();
  proxy.getDicts("sys_yes_no").then((response) => {
    typeOptions.value = response.data;
  });
});

/** 查询参数列表 */
const getList = () => {
  loading.value = true;
  listConfig(proxy.addDateRange(queryParams, dateRange.value)).then(
    (response) => {
      configList.value = response.rows;
      total.value = response.total;
      loading.value = false;
    }
  );
};
// 参数系统内置字典翻译
const typeFormat = (row, column) => {
  return proxy.selectDictLabel(typeOptions.value, row.configType);
};
// 取消按钮
const cancel = () => {
  open.value = false;
  reset();
};
// 表单重置
const reset = () => {
  form.value = {
    configId: undefined,
    configName: undefined,
    configKey: undefined,
    configValue: undefined,
    configType: "Y",
    remark: undefined,
  };
  proxy.resetForm("addFormRef");
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
/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  open.value = true;
  title.value = "添加参数";
};
// 多选框选中数据
const handleSelectionChange = (selection) => {
  ids.value = selection.map((item) => item.configId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};
/** 修改按钮操作 */
const handleUpdate = (row) => {
  reset();
  const configId = row.configId || ids;
  getConfig(configId).then((response) => {
    form.value = response.data;
    open.value = true;
    title.value = "修改参数";
  });
};
/** 提交按钮 */
const submitForm = () => {
  addFormRef.value.validate((valid) => {
    if (valid) {
      if (form.value.configId != undefined) {
        updateConfig(form.value).then((response) => {
          if (response.code === 200) {
            proxy.msgSuccess("修改成功");
            open.value = false;
            getList();
          } else {
            proxy.msgError(response.msg);
          }
        });
      } else {
        addConfig(form.value).then((response) => {
          if (response.code === 200) {
            proxy.msgSuccess("新增成功");
            open.value = false;
            getList();
          } else {
            proxy.msgError(response.msg);
          }
        });
      }
    }
  });
};
/** 删除按钮操作 */
const handleDelete = (row) => {
  const configIds = row.configId || ids;
  proxy
    .$confirm('是否确认删除参数编号为"' + configIds + '"的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return delConfig(configIds);
    })
    .then(() => {
      getList();
      proxy.msgSuccess("删除成功");
    })
    .catch(function () {});
};
/** 导出按钮操作 */
const handleExport = () => {
  const queryParams = queryParams;
  proxy
    .$confirm("是否确认导出所有参数数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return exportConfig(queryParams);
    })
    .then((response) => {
      proxy.download(response.msg);
    })
    .catch(function () {});
};
</script>
