<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="queryParams.roleName"
          placeholder="请输入角色名称"
          clearable
          size="default"
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="权限字符" prop="roleKey">
              <el-input
                v-model="queryParams.roleKey"
                placeholder="请输入权限字符"
                clearable
                size="default"
                style="width: 240px"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="queryParams.status"
                placeholder="角色状态"
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
            </el-form-item>-->
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
          v-hasPermi="['role:edit']"
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
          v-hasPermi="['role:edit']"
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
          v-hasPermi="['role:delete']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          :icon="Download"
          size="default"
          @click="handleExport"
          v-hasPermi="['role:export']"
          >导出</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="roleList"
      border
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="角色名称"
        prop="roleName"
        :show-overflow-tooltip="true"
        sortable="custom"
        width="300"
      />
      <el-table-column
        label="描述"
        prop="description"
        :show-overflow-tooltip="true"
        width="300"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        sortable="custom"
        width="300"
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
            v-hasPermi="['role:edit']"
            >修改</el-button
          >
          <el-button
            size="default"
            type="primary"
            link
            :icon="CircleCheck"
            @click="handleDataScope(scope.row)"
            >数据权限</el-button
          >
          <el-button
            size="default"
            type="primary"
            link
            :icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['role:delete']"
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

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="addFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree
            :data="menuOptions"
            show-checkbox
            ref="menuRef"
            node-key="id"
            empty-text="加载中，请稍后"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 分配角色数据权限对话框 -->
    <el-dialog
      :title="title"
      v-model="openDataScope"
      width="800px"
      append-to-body
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.roleName" :disabled="true" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" :disabled="true" />
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
          <el-button type="primary" @click="submitDataScope">确 定</el-button>
          <el-button @click="cancelDataScope">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Role">
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  Download,
  CircleCheck,
} from "@element-plus/icons-vue";
import {
  listRole,
  getRole,
  delRole,
  addRole,
  updateRole,
  exportRole,
  dataScope,
  changeRoleStatus,
  roleUserselect,
} from "@/api/system/role";
import {
  treeselect as menuTreeselect,
  roleMenuTreeselect,
} from "@/api/system/menu";
import {
  treeselect as deptTreeselect,
  roleDeptTreeselect,
} from "@/api/system/dept";
import { getCurrentInstance, onMounted, reactive, ref, nextTick } from "vue";
import { useRouter } from "vue-router";

const { proxy } = getCurrentInstance();
const addFormRef = ref();
const router = useRouter();
const menumRef = ref();
const deptRef = ref();
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
// 角色表格数据
const roleList = ref([]);
// 弹出层标题
const title = ref();
// 是否显示弹出层
const open = ref(false);
// 是否显示弹出层（数据权限）
const openDataScope = ref(false);
// 日期范围
const dateRange = ref([]);
// 状态数据字典
const statusOptions = ref([]);
// 数据范围选项
const dataScopeOptions = ref([
  {
    value: "1",
    label: "全部数据权限",
  },
  {
    value: "2",
    label: "自定数据权限",
  },
  {
    value: "3",
    label: "本部门数据权限",
  },
  {
    value: "4",
    label: "本部门及以下数据权限",
  },
  {
    value: "5",
    label: "仅本人数据权限",
  },
]);
// 菜单列表
const menuOptions = ref([]);
const userOptions = ref([]);
const selectedUsers = ref([]);
const titleOptions = ref(["未选择", "已选择"]);
// 部门列表
const deptOptions = ref([]);
// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  roleName: undefined,
  roleKey: undefined,
  status: undefined,
  sortColumn: undefined,
  sortAsc: undefined,
});
// 表单参数
const form = ref({});
const defaultProps = ref({
  children: "children",
  label: "label",
});
// 表单校验
const rules = ref({
  roleName: [{ required: true, message: "角色名称不能为空", trigger: "blur" }],
});

onMounted(() => {
  getList();
  // proxy.getDicts("sys_normal_disable").then(response => {
  //   statusOptions = response.data;
  // });
});

const sortChange = (data) => {
  const { prop, order } = data;
  queryParams.sortColumn = prop;
  queryParams.sortAsc = order === null ? "descending" : order;
  getList();
};
/** 查询角色列表 */
const getList = () => {
  loading.value = true;
  listRole(proxy.addDateRange(queryParams, dateRange.value)).then(
    (response) => {
      roleList.value = response.rows;
      total.value = response.total;
      loading.value = false;
    }
  );
};
/** 查询菜单树结构 */
const getMenuTreeselect = () => {
  menuTreeselect().then((response) => {
    menuOptions.value = response.data;
  });
};
/** 查询部门树结构 */
const getDeptTreeselect = () => {
  deptTreeselect().then((response) => {
    deptOptions.value = response.data;
  });
};
// 所有菜单节点数据
const getMenuAllCheckedKeys = () => {
  // 目前被选中的菜单节点
  let checkedKeys = menumRef.value.getHalfCheckedKeys();
  // 半选中的菜单节点
  let halfCheckedKeys = menumRef.value.getCheckedKeys();
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
};
// 所有部门节点数据
const getDeptAllCheckedKeys = () => {
  // 目前被选中的部门节点
  let checkedKeys = deptRef.value.getHalfCheckedKeys();
  // 半选中的部门节点
  let halfCheckedKeys = deptRef.value.getCheckedKeys();
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
};
/** 根据角色ID查询菜单树结构 */
const getRoleMenuTreeselect = (roleId) => {
  roleMenuTreeselect(roleId).then((response) => {
    menuOptions.value = response.menus;
    menumRef.value.setCheckedKeys(response.checkedKeys);
  });
};
/** 根据角色ID查询部门树结构 */
const getRoleDeptTreeselect = (roleId) => {
  roleDeptTreeselect(roleId).then((response) => {
    deptOptions.value = response.depts;
    deptRef.value.setCheckedKeys(response.checkedKeys);
  });
};
const getRoleUserselect = (roleId) => {
  userOptions.value = [];
  selectedUsers.value = [];
  roleUserselect(roleId).then((response) => {
    let data = response.allUser;
    data.forEach((item) => {
      userOptions.value.push({
        label: item.userName,
        key: item.id,
        user: item.userName,
      });
    });
    let checked = response.checkedKeys;
    checked.forEach((item) => {
      selectedUsers.value.push(item.id);
    });
  });
};
const change = () => {
  for (let i = 0; i < selectedUsers.value.length; i++) {
    console.log(selectedUsers.value[i]);
  }
};
// 角色状态修改
const handleStatusChange = (row) => {
  let text = row.status === "0" ? "启用" : "停用";
  proxy
    .$confirm('确认要"' + text + '""' + row.roleName + '"角色吗?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return changeRoleStatus(row.roleId, row.status);
    })
    .then(() => {
      proxy.msgSuccess(text + "成功");
    })
    .catch(function () {
      row.status = row.status === "0" ? "1" : "0";
    });
};
// 取消按钮
const cancel = () => {
  open.value = false;
  reset();
};
// 取消按钮（数据权限）
const cancelDataScope = () => {
  openDataScope.value = false;
  reset();
};
// 表单重置
const reset = () => {
  if (menumRef.value != undefined) {
    menumRef.value.setCheckedKeys([]);
  }
  form.value = {
    id: undefined,
    roleName: undefined,
    description: undefined,
    menuIds: [],
    userIds: [],
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
  dateRange.value = [];
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
  getMenuTreeselect();
  open.value = true;
  title.value = "添加角色";
};
/** 修改按钮操作 */
const handleUpdate = async (row) => {
  reset();
  const roleId = row.id || ids;
  await nextTick(() => {
    getRoleMenuTreeselect(roleId);
  });
  getRole(roleId).then((response) => {
    form.value = response.data;
    open.value = true;
    title.value = "修改角色";
  });
};
/** 分配数据权限操作 */
const handleDataScope = async (row) => {
  reset();
  // await nextTick(() => {
  //   getRoleDeptTreeselect(row.id);
  // });
  await nextTick(() => {
    getRoleUserselect(row.id);
  });
  getRole(row.id).then((response) => {
    form.value = response.data;
    openDataScope.value = true;
    title.value = "分配数据权限";
  });
};
/** 提交按钮 */
const submitForm = () => {
  addFormRef.value.validate((valid) => {
    if (valid) {
      if (form.value.id != undefined) {
        form.value.menuIds = getMenuAllCheckedKeys();
        updateRole(form).then((response) => {
          if (response.code === 200) {
            proxy.msgSuccess("修改成功");
            open.value = false;
            getList();
          } else {
            proxy.msgError(response.msg);
          }
        });
      } else {
        form.value.menuIds = getMenuAllCheckedKeys();
        addRole(form).then((response) => {
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
/** 提交按钮（数据权限） */
const submitDataScope = () => {
  if (form.value.id != undefined) {
    form.value.userIds = selectedUsers;
    dataScope(form).then((response) => {
      if (response.code === 200) {
        proxy.msgSuccess("修改成功");
        openDataScope.value = false;
        getList();
      } else {
        proxy.msgError(response.msg);
      }
    });
  }
};
/** 删除按钮操作 */
const handleDelete = (row) => {
  const roleIds = row.roleId || ids;
  proxy
    .$confirm("是否确认删除角色?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return delRole(roleIds);
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
    .$confirm("是否确认导出所有角色数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return exportRole(queryParams);
    })
    .then((response) => {
      proxy.download(response.msg);
    })
    .catch(function () {});
};
</script>
