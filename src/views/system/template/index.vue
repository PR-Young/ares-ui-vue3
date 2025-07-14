<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="模版名称" prop="subject">
        <el-input
          v-model="queryParams.subject"
          placeholder="请输入模版名称"
          clearable
          size="default"
          style="width: 240px"
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
          v-hasPermi="['sysTemplate:edit']"
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
          v-hasPermi="['sysTemplate:edit']"
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
          v-hasPermi="['sysTemplate:delete']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          :icon="Download"
          size="default"
          @click="handleExport"
          v-hasPermi="['sysTemplate:export']"
          >导出</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      border
      :data="templateList"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="模版名称"
        align="center"
        prop="name"
        fixed
        width="200"
      />
      <el-table-column
        label="模版标题"
        align="center"
        prop="subject"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="模版内容"
        align="center"
        prop="text"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="模版html"
        align="center"
        prop="html"
        width="300"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="模版参数" align="center" prop="param" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        sortable="custom"
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
        fixed="right"
      >
        <template v-slot="scope">
          <el-button
            size="default"
            type="primary"
            link
            :icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['sysTemplate:edit']"
            >修改</el-button
          >
          <el-button
            size="default"
            type="primary"
            link
            :icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['sysTemplate:delete']"
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
        <el-form-item label="模版名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入模版名称" />
        </el-form-item>
        <el-form-item label="模版标题" prop="subject">
          <el-input v-model="form.subject" placeholder="请输入模版标题" />
        </el-form-item>
        <el-form-item label="模版内容" prop="text">
          <el-input
            v-model="form.text"
            type="textarea"
            placeholder="请输入模版内容"
          />
        </el-form-item>
        <el-form-item label="模版html" prop="html">
          <el-input
            v-model="form.html"
            type="textarea"
            placeholder="请输入模版内容"
          />
        </el-form-item>
        <el-form-item label="模版参数" prop="param">
          <el-input
            v-model="form.param"
            type="textarea"
            placeholder="请输入模版参数"
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

<script setup name="Template">
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  Download,
} from "@element-plus/icons-vue";
import {
  listTemplate,
  getTemplate,
  delTemplate,
  addTemplate,
  updateTemplate,
  exportTemplate,
} from "@/api/system/template";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

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
const templateList = ref([]);
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
  name: undefined,
  sortColumn: undefined,
  sortAsc: undefined,
});
// 表单参数
const form = ref({});
// 表单校验
const rules = ref({
  name: [{ required: true, message: "模版名称不能为空", trigger: "blur" }],
  subject: [{ required: true, message: "模版标题不能为空", trigger: "blur" }],
  html: [{ required: true, message: "模版内容不能为空", trigger: "blur" }],
});

onMounted(() => {
  getList();
});

const sortChange = (data) => {
  const { prop, order } = data;
  queryParams.sortColumn = prop;
  queryParams.sortAsc = order === null ? "descending" : order;
  getList();
};
/** 查询参数列表 */
const getList = () => {
  loading.value = true;
  listTemplate(proxy.addDateRange(queryParams, dateRange.value)).then(
    (response) => {
      templateList.value = response.rows;
      total.value = response.total;
      loading.value = false;
    }
  );
};
// 取消按钮
const cancel = () => {
  open.value = false;
  reset();
};
// 表单重置
const reset = () => {
  form.value = {
    name: undefined,
    subject: undefined,
    text: undefined,
    html: undefined,
    param: undefined,
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
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};
/** 修改按钮操作 */
const handleUpdate = (row) => {
  reset();
  const templateId = row.id || ids;
  getTemplate(templateId).then((response) => {
    form.value = response.data;
    open.value = true;
    title.value = "修改参数";
  });
};
/** 提交按钮 */
const submitForm = () => {
  addFormRef.value.validate((valid) => {
    if (valid) {
      if (form.value.id != undefined) {
        updateTemplate(form.value).then((response) => {
          if (response.code === 200) {
            proxy.msgSuccess("修改成功");
            open.value = false;
            getList();
          } else {
            proxy.msgError(response.msg);
          }
        });
      } else {
        addTemplate(form.value).then((response) => {
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
  const templateIds = row.id || ids;
  proxy
    .$confirm('是否确认删除参数编号为"' + templateIds + '"的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return delTemplate(templateIds);
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
      return exportTemplate(queryParams);
    })
    .then((response) => {
      proxy.download(response.msg);
    })
    .catch(function () {});
};
</script>
