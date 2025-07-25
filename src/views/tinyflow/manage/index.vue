<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="流程名称" prop="workflowName">
        <el-input
          v-model="queryParams.workflowName"
          placeholder="请输入流程名称"
          clearable
          size="default"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="Search"
          size="default"
          @click="handleQuery"
          >搜索
        </el-button>
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
          v-hasPermi="['sysWorkflows:edit']"
          >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          :icon="Edit"
          size="default"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['sysWorkflows:edit']"
          >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          :icon="Delete"
          size="default"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['sysWorkflows:delete']"
          >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          :icon="Download"
          size="default"
          @click="handleExport"
          v-hasPermi="['sysWorkflows:export']"
          >导出
        </el-button>
      </el-col>
    </el-row>

    <el-table
      border
      v-loading="loading"
      :data="sysWorkflowsList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="appId" align="center" prop="appId" />
      <el-table-column label="流程名称" align="center" prop="workflowName" />
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
            type="text"
            icon=""
            @click="handleBuild(scope.row)"
            >流程设计
          </el-button>
          <el-button
            size="default"
            type="text"
            :icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['sysWorkflows:edit']"
            >修改
          </el-button>
          <el-button
            size="default"
            type="text"
            :icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['sysWorkflows:delete']"
            >删除
          </el-button>
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

    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="addFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="AppID" prop="appId">
          <el-input v-model="form.appId" placeholder="请输入AppID" />
        </el-form-item>
        <el-form-item label="流程名称" prop="workflowName">
          <el-input v-model="form.workflowName" placeholder="请输入流程名称" />
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

<script setup name="SysWorkflows">
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  Download,
} from "@element-plus/icons-vue";
import {
  addSysWorkflows,
  delSysWorkflows,
  exportSysWorkflows,
  getSysWorkflows,
  listSysWorkflows,
  updateSysWorkflows,
} from "@/api/ai/workflow";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

const { proxy } = getCurrentInstance();
const addFormRef = ref();
const router = useRouter();

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
// 岗位表格数据
const sysWorkflowsList = ref([]);
// 弹出层标题
const title = ref();
// 是否显示弹出层
const open = ref(false);
// 状态数据字典
const statusOptions = ref([]);
// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  workflowName: undefined,
});
// 表单参数
const form = ref({});
// 表单校验
const rules = ref({});

onMounted(() => {
  getList();
});

/** 查询岗位列表 */
const getList = () => {
  loading.value = true;
  listSysWorkflows(queryParams).then((response) => {
    sysWorkflowsList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
};
// 取消按钮
const cancel = () => {
  open.value = false;
  reset();
};
// 表单重置
const reset = () => {
  form.value = {
    id: undefined,
    appId: undefined,
    graph: undefined,
    workflowName: undefined,
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
  proxy.resetForm("queryForm");
  handleQuery();
};
// 多选框选中数据
const handleSelectionChange = (selection) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};
/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  open.value = true;
  title.value = "添加流程";
};
/** 修改按钮操作 */
const handleUpdate = (row) => {
  reset();
  const id = row.id || ids;
  getSysWorkflows(id).then((response) => {
    form.value = response.data;
    open.value = true;
    title.value = "修改流程";
  });
};
/** 提交按钮 */
const submitForm = () => {
  addFormRef.value.validate((valid) => {
    if (valid) {
      if (form.value.id != undefined) {
        updateSysWorkflows(form.value).then((response) => {
          if (response.code === 200) {
            proxy.msgSuccess("修改成功");
            open.value = false;
            getList();
          } else {
            proxy.msgError(response.msg);
          }
        });
      } else {
        addSysWorkflows(form.value).then((response) => {
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
  const ids = row.id || ids;
  proxy
    .$confirm('是否确认删除编号为"' + ids + '"的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return delSysWorkflows(ids);
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
    .$confirm("是否确认导出所有数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return exportSysWorkflows(queryParams);
    })
    .then((response) => {
      proxy.download(response.msg);
    })
    .catch(function () {});
};

const handleBuild = (row) => {
  router.push({
    path: "/tinyflow/build",
    params: {
      data: row,
    },
  });
};
</script>
