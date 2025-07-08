<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="租户别称" prop="tenantAlias">
        <el-input
          v-model="queryParams.tenantAlias"
          placeholder="请输入租户别称"
          clearable
          size="default"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="租户名" prop="tenantName">
        <el-input
          v-model="queryParams.tenantName"
          placeholder="请输入租户名"
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
          v-hasPermi="['sysTenants:edit']"
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
          v-hasPermi="['sysTenants:edit']"
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
          v-hasPermi="['sysTenants:delete']"
          >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          :icon="Download"
          size="default"
          @click="handleExport"
          v-hasPermi="['sysTenants:export']"
          >导出
        </el-button>
      </el-col>
    </el-row>

    <el-table
      border
      v-loading="loading"
      :data="sysTenantsList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
        :selectable="selectable"
      />
      <el-table-column label="租户名" align="center" prop="tenantName" />
      <el-table-column label="租户别称" align="center" prop="tenantAlias" />
      <el-table-column label="状态" align="center">
        <template v-slot="scope">
          <el-switch
            v-model="scope.row.tenantStatus"
            :active-value="'0'"
            :inactive-value="'1'"
            @change="handleStatusChange(scope.row)"
            :disabled="scope.row.id == '1'"
          ></el-switch>
        </template>
      </el-table-column>
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
            v-hasPermi="['sysTenants:edit']"
            >修改
          </el-button>
          <el-button
            size="default"
            type="primary"
            link
            :icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['sysTenants:delete']"
            :disabled="scope.row.id == '1'"
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
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="addFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="租户名" prop="tenantName">
          <el-input v-model="form.tenantName" placeholder="请输入租户名" />
        </el-form-item>
        <el-form-item label="租户别称" prop="tenantAlias">
          <el-input v-model="form.tenantAlias" placeholder="请输入租户别称" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.tenantStatus">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户">
          <el-transfer
            filterable
            :titles="titleOptions"
            filter-placeholder
            :data="userOptions"
            v-model="selectedUsers"
            @right-check-change="change"
          ></el-transfer>
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

<script setup name="SysTenants">
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  Download,
} from "@element-plus/icons-vue";
import {
  addSysTenants,
  delSysTenants,
  exportSysTenants,
  getSysTenants,
  listSysTenants,
  updateSysTenants,
  changeStatus,
} from "@/api/system/tenant";
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
// 岗位表格数据
const sysTenantsList = ref([]);
// 用户选项
const userOptions = ref([]);
const selectedUsers = ref([]);
// 弹出层标题
const title = ref();
// 是否显示弹出层
const open = ref(false);
const titleOptions = ref(["未选择", "已选择"]);
// 状态数据字典
const statusOptions = ref([
  { dictValue: "0", dictLabel: "启用" },
  { dictValue: "1", dictLabel: "停用" },
]);
// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  tenantAlias: undefined,
  tenantName: undefined,
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
  listSysTenants(queryParams).then((response) => {
    sysTenantsList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
};
const selectable = (row, index) => {
  if (row.id === "1") {
    return false;
  }
  return true;
};
// 取消按钮
const cancel = () => {
  open.value = false;
  reset();
};
const change = () => {
  for (let i = 0; i < selectedUsers.value.length; i++) {
    console.log(selectedUsers.value[i]);
  }
};
// 表单重置
const reset = () => {
  form.value = {
    id: undefined,
    tenantName: undefined,
    tenantAlias: undefined,
    tenantStatus: undefined,
  };
  proxy.resetForm("form");
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
  getSysTenants().then((response) => {
    open.value = true;
    title.value = "添加租户";
    userOptions.value = [];
    selectedUsers.value = [];
    let data = response.allUser;
    data.forEach((item) => {
      userOptions.value.push({
        label: item.userName,
        key: item.id,
        user: item.userName,
        disabled: item.disabled === 0,
      });
    });
  });
};
/** 修改按钮操作 */
const handleUpdate = (row) => {
  reset();
  const id = row.id || ids;
  getSysTenants(id).then((response) => {
    form.value = response.data;
    open.value = true;
    title.value = "修改租户";
    userOptions.value = [];
    selectedUsers.value = [];
    let data = response.allUser;
    data.forEach((item) => {
      userOptions.value.push({
        label: item.userName,
        key: item.id,
        user: item.userName,
        //disabled: item.disabled === 0
      });
    });
    let checked = response.checkedKeys;
    checked.forEach((item) => {
      selectedUsers.value.push(item);
    });
  });
};
/** 提交按钮 */
const submitForm = () => {
  addFormRef.value.validate((valid) => {
    if (valid) {
      form.value.userIds = selectedUsers;
      if (form.value.id != undefined) {
        updateSysTenants(form.value).then((response) => {
          if (response.code === 200) {
            proxy.msgSuccess("修改成功");
            open.value = false;
            getList();
          } else {
            proxy.msgError(response.msg);
          }
        });
      } else {
        addSysTenants(form.value).then((response) => {
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
    .$confirm('是否确认删除租户编号为"' + ids + '"的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return delSysTenants(ids);
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
    .$confirm("是否确认导出所有租户数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return exportSysTenants(queryParams);
    })
    .then((response) => {
      proxy.download(response.msg);
    })
    .catch(function () {});
};
const handleStatusChange = (row) => {
  let text = row.tenantStatus === "0" ? "启用" : "停用";
  proxy
    .$confirm("确认要" + text + "[" + row.tenantName + "]租户吗?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return changeStatus(row.id, row.tenantStatus);
    })
    .then(() => {
      proxy.msgSuccess(text + "成功");
    })
    .catch(function () {
      row.tenantStatus = row.tenantStatus === "0" ? "1" : "0";
    });
};
</script>
