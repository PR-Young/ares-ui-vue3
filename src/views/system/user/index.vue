<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入部门名称"
            clearable
            size="default"
            :prefix-icon="Search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="deptTreeRef"
            default-expand-all
            @node-click="handleNodeClick"
            @node-contextmenu="openMenu"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          label-width="68px"
        >
          <el-form-item label="用户名称" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入用户名称"
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
              v-hasPermi="['user:edit']"
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
              v-hasPermi="['user:edit']"
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
              v-hasPermi="['user:delete']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              :icon="Upload"
              size="default"
              @click="handleImport"
              v-hasPermi="['user:import']"
              >导入</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              :icon="Download"
              size="default"
              @click="handleExport"
              >导出</el-button
            >
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="userList"
          border
          @selection-change="handleSelectionChange"
          @sort-change="sortChange"
        >
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column
            label="用户名称"
            align="center"
            prop="userName"
            fixed
            :show-overflow-tooltip="true"
            sortable="custom"
            width="200"
          />
          <el-table-column
            label="帐号"
            align="center"
            prop="account"
            :show-overflow-tooltip="true"
            sortable="custom"
          />
          <el-table-column
            label="电话"
            align="center"
            prop="phoneNumber"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="邮箱"
            align="center"
            prop="email"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="创建时间"
            align="center"
            prop="createTime"
            sortable="custom"
            width="160"
          >
            <template v-slot="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template v-slot="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
                @change="handleStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="300"
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
                v-hasPermi="['user:edit']"
                >修改</el-button
              >
              <el-button
                v-if="scope.row.id != 1"
                size="default"
                type="primary"
                link
                :icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['user:delete']"
                >删除</el-button
              >
              <el-button
                size="default"
                type="primary"
                link
                :icon="Key"
                @click="handleResetPwd(scope.row)"
                >重置</el-button
              >
              <el-button
                size="default"
                type="primary"
                link
                :icon="Bottom"
                @click="handleKickUser(scope.row)"
                >下线</el-button
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
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="addFormRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户帐号" prop="account">
              <el-input v-model="form.account" placeholder="请输入用户帐号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属部门" prop="deptId">
              <treeselect
                v-model="form.deptId"
                :options="deptOptions"
                placeholder="请选择归属部门"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phoneNumber">
              <el-input
                v-model="form.phoneNumber"
                placeholder="请输入手机号码"
                maxlength="11"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="form.email"
                placeholder="请输入邮箱"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名称" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入用户名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户密码" prop="password">
              <el-input
                v-model="form.password"
                placeholder="请输入用户密码"
                type="password"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位">
              <el-select v-model="form.postId" placeholder="请选择">
                <el-option
                  v-for="item in postOptions"
                  :key="item.id"
                  :label="item.postName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-select v-model="form.roleIds" multiple placeholder="请选择">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog
      :title="upload.title"
      v-model="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="uploadRef"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="
          upload.url +
          '?updateSupport=' +
          upload.updateSupport +
          '&deptId=' +
          queryParams.deptId
        "
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <el-icon><Upload /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <template v-slot:tip>
          <div class="el-upload__tip">
            <el-checkbox
              v-model="upload.updateSupport"
            />是否更新已经存在的用户数据
            <span style="color: red"
              >提示：仅允许导入“xls”或“xlsx”格式文件！</span
            >
            <el-link
              type="info"
              style="font-size: 12px"
              @click="downloadTemplate"
              >下载模板</el-link
            >
          </div>
        </template>
        <!-- <template v-slot:tip>
          <div class="el-upload__tip" style="color: red">
            提示：仅允许导入“xls”或“xlsx”格式文件！
          </div>
        </template> -->
      </el-upload>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <ul
      v-show="rightVisible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
    >
      <li @click="addDeptment">新增部门</li>
      <li @click="updateDeptment">修改部门</li>
      <li @click="deleteDept">删除部门</li>
      <li @click="refreshTree">刷新部门</li>
    </ul>

    <!-- 添加或修改部门对话框 -->
    <el-dialog
      :title="deptTitle"
      v-model="deptOpen"
      width="600px"
      append-to-body
    >
      <el-form ref="addDeptFormRef" :model="deptForm" label-width="80px">
        <el-row>
          <el-input v-model="deptForm.id" type="hidden" />
          <el-input v-model="deptForm.parentDeptId" type="hidden" />
          <el-col :span="24">
            <el-form-item label="上级部门" prop="parentDeptName">
              <el-input v-model="deptForm.parentDeptName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="部门编号" prop="code">
              <el-input v-model="deptForm.code" placeholder="请输入部门编号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="部门名称" prop="deptName">
              <el-input
                v-model="deptForm.deptName"
                placeholder="请输入部门名称"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitDeptForm">确 定</el-button>
          <el-button @click="deptCancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="User">
import {
  Upload,
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  Download,
  Key,
  Bottom,
} from "@element-plus/icons-vue";
import {
  listUser,
  getUser,
  delUser,
  addUser,
  updateUser,
  exportUser,
  resetUserPwd,
  changeUserStatus,
  importTemplate,
  kickUser,
} from "@/api/system/user";
import { getToken } from "@/utils/auth";
import {
  getTreeselect,
  delDept,
  addDept,
  updateDept,
  getDept,
} from "@/api/system/dept";
import Treeselect from "vue3-treeselect";
import "vue3-treeselect/dist/vue3-treeselect.css";
import { getCurrentInstance, onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";

const { proxy } = getCurrentInstance();
const addFormRef = ref();
const addDeptFormRef = ref();
const router = useRouter();

const selectedTreeNode = ref();
const selectedParentNode = ref();
const deptOpen = ref(false);
const deptTitle = ref();
const deptForm = ref({});
const rightVisible = ref(false);
const left = ref(0);
const top = ref(0);
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
// 用户表格数据
const userList = ref([]);
// 弹出层标题
const title = ref();
// 部门树选项
const deptOptions = ref([]);
// 是否显示弹出层
const open = ref(false);
// 部门名称
const deptName = ref();
// 默认密码
const initPassword = ref("123456");
// 日期范围
const dateRange = ref([]);
// 状态数据字典
const statusOptions = ref([]);
// 性别状态字典
const sexOptions = ref([]);
// 岗位选项
const postOptions = ref([]);
// 角色选项
const roleOptions = ref([]);
// 表单参数
const form = ref({});
const defaultProps = ref({
  children: "children",
  label: "label",
});
// 用户导入参数
const upload = ref({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: { Authorization: "Bearer " + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/ares/system/user/importData",
});
// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  userName: undefined,
  phonenumber: undefined,
  status: undefined,
  deptId: "1",
  sortColumn: undefined,
  sortAsc: undefined,
});
// 表单校验
const rules = ref({
  userName: [{ required: true, message: "用户名称不能为空", trigger: "blur" }],
  account: [{ required: true, message: "用户帐号不能为空", trigger: "blur" }],
  deptId: [{ required: true, message: "归属部门不能为空", trigger: "blur" }],
  password: [{ required: true, message: "用户密码不能为空", trigger: "blur" }],
  // email: [
  //   { required: true, message: "邮箱地址不能为空", trigger: "blur"};
  //   {
  //     type: "email",
  //     message: "'请输入正确的邮箱地址",
  //     trigger: ["blur", "change"]
  //   }
  // ],
  // phoneNumber: [
  //   { required: true, message: "手机号码不能为空", trigger: "blur"};
  //   {
  //     pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
  //     message: "请输入正确的手机号码",
  //     trigger: "blur"
  //   }
  // ]
});
const deptTreeRef = ref();
const uploadRef = ref();

watch(deptTreeRef, (val) => {
  deptTreeRef.value.filter(val);
});

watch(rightVisible, (value) => {
  if (value) {
    document.body.addEventListener("click", closeMenu);
  } else {
    document.body.removeEventListener("click", closeMenu);
  }
});
onMounted(() => {
  getList();
  getTreeselectData();
});

const sortChange = (data) => {
  const { prop, order } = data;
  queryParams.sortColumn = prop;
  queryParams.sortAsc = order === null ? "descending" : order;
  getList();
};
/** 查询用户列表 */
const getList = () => {
  loading.value = true;
  listUser(proxy.addDateRange(queryParams, dateRange.value)).then(
    (response) => {
      userList.value = response.rows;
      total.value = response.total;
      loading.value = false;
    }
  );
};
/** 查询部门下拉树结构 */
const getTreeselectData = () => {
  getTreeselect().then((response) => {
    deptOptions.value = response.data;
  });
};
// 筛选节点
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};
// 节点单击事件
const handleNodeClick = (data) => {
  queryParams.deptId = data.id;
  getList();
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
    deptId: undefined,
    userName: undefined,
    account: undefined,
    password: undefined,
    phonenumber: undefined,
    email: undefined,
    postId: undefined,
    roleIds: [],
  };
  proxy.resetForm("addFormRef");
};
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.page = 1;
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
  getTreeselectData();
  getUser().then((response) => {
    postOptions.value = response.posts;
    roleOptions.value = response.roles;
    open.value = true;
    title.value = "添加用户";
    form.value.password = initPassword;
  });
};
/** 修改按钮操作 */
const handleUpdate = (row) => {
  reset();
  getTreeselectData();
  const userId = row.id || ids;
  getUser(userId).then((response) => {
    form.value = response.data;
    postOptions.value = response.posts;
    roleOptions.value = response.roles;
    form.value.roleIds = response.roleIds;
    open.value = true;
    title.value = "修改用户";
  });
};
/** 重置密码按钮操作 */
const handleResetPwd = (row) => {
  proxy
    .$confirm("是否重置密码", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    })
    .then(({ value }) => {
      resetUserPwd(row.id, value).then((response) => {
        if (response.code === 200) {
          proxy.msgSuccess("修改成功，新密码是：123456");
        } else {
          proxy.msgError(response.msg);
        }
      });
    })
    .catch(() => {});
};
const handleStatusChange = (row) => {
  let text = row.status === 1 ? "启用" : "停用";
  proxy
    .$confirm('确认要"' + text + '""' + row.userName + '"吗?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      updateUser(row).then((response) => {
        if (response.code === 200) {
          proxy.msgSuccess("修改成功");
          open.value = false;
          getList();
        } else {
          proxy.msgError(response.msg);
        }
      });
    })
    .then(() => {
      proxy.msgSuccess(text + "成功");
    })
    .catch(function () {
      row.status = row.status === 1 ? 1 : 0;
    });
};
/** 提交按钮 */
const submitForm = () => {
  addFormRef.value.validate((valid) => {
    if (valid) {
      if (form.value.id != undefined) {
        updateUser(form.value).then((response) => {
          if (response.code === 200) {
            proxy.msgSuccess("修改成功");
            open.value = false;
            getList();
          } else {
            proxy.msgError(response.msg);
          }
        });
      } else {
        addUser(form.value).then((response) => {
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
  const userIds = row.id || ids;
  if (row.id == "1" || ids.value.includes("1")) {
    proxy.msgError("管理员帐号不能删除！");
    return;
  }
  proxy
    .$confirm('是否确认删除用户为"' + userIds + '"的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return delUser(userIds);
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
    .$confirm("是否确认导出所有用户数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return exportUser(queryParams);
    })
    .then((response) => {
      proxy.download(response, "用户信息");
    })
    .catch(function () {});
};
/** 导入按钮操作 */
const handleImport = () => {
  upload.value.title = "用户导入";
  upload.value.open = true;
};
/** 下载模板操作 */
const downloadTemplate = () => {
  importTemplate().then((response) => {
    proxy.download(response, "用户导入模版");
  });
};
// 文件上传中处理
const handleFileUploadProgress = (event, file, fileList) => {
  upload.value.isUploading = true;
};
// 文件上传成功处理
const handleFileSuccess = (response, file, fileList) => {
  upload.value.open = false;
  upload.value.isUploading = false;
  uploadRef.value.clearFiles();
  proxy.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
  getList();
};
// 提交上传文件
const submitFileForm = () => {
  uploadRef.value.submit();
};

const openMenu = (event, data, node, element) => {
  const menuMinWidth = 105;
  const offsetLeft = deptTreeRef.value.$el.getBoundingClientRect().left; // container margin left
  const offsetWidth = deptTreeRef.value.$el.offsetWidth; // container width
  const maxLeft = offsetWidth - menuMinWidth; // left boundary
  const left = event.clientX - offsetLeft; // 15: margin right

  if (left > maxLeft) {
    left.valueOf = maxLeft;
  } else {
    left.valueOf = left;
  }
  top.value = event.clientY - 80; // fix 位置bug
  selectedTreeNode.value = data;
  selectedParentNode.value = node.parent.data;
  rightVisible.value = true;
};
const closeMenu = () => {
  rightVisible.value = false;
};
// 取消按钮
const deptCancel = () => {
  deptOpen.value = false;
  deptReset();
};
// 表单重置
const deptReset = () => {
  deptForm.value = {
    id: undefined,
    parentDeptId: undefined,
    parentDeptName: undefined,
    code: undefined,
    deptName: undefined,
  };
  proxy.resetForm("addDeptFormRef");
};
const addDeptment = () => {
  deptReset();
  deptForm.value.parentDeptId = selectedTreeNode.value.id;
  deptForm.value.parentDeptName = selectedTreeNode.value.label;
  deptOpen.value = true;
  deptTitle.value = "添加部门";
};
const updateDeptment = () => {
  deptReset();
  const id = selectedTreeNode.value.id;
  getDept(id).then((response) => {
    deptForm.value = response.data;
    deptOpen.value = true;
    deptTitle.value = "修改部门";
  });
};
const submitDeptForm = () => {
  addDeptFormRef.value.validate((valid) => {
    if (valid) {
      if (deptForm.value.id != undefined) {
        updateDept(deptForm).then((response) => {
          if (response.code === 200) {
            proxy.msgSuccess("修改成功");
            deptOpen.value = false;
            getTreeselectData();
            getList();
          } else {
            proxy.msgError(response.msg);
          }
        });
      } else {
        addDept(deptForm).then((response) => {
          if (response.code === 200) {
            proxy.msgSuccess("新增成功");
            deptOpen.value = false;
            getTreeselectData();
            getList();
          } else {
            proxy.msgError(response.msg);
          }
        });
      }
    }
  });
};
const deleteDept = () => {
  const id = selectedTreeNode.value.id;
  if (id === "1") {
    proxy.msgError("根节点不能删除！");
    return;
  }
  proxy
    .$confirm("是否确认删除?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return delDept(id);
    })
    .then(() => {
      getList();
      getTreeselectData();
      proxy.msgSuccess("删除成功");
    })
    .catch(function () {});
};
const refreshTree = () => {
  getTreeselectData();
};
const handleKickUser = (row) => {
  const userName = row.userName;
  proxy
    .$confirm('是否让用户"' + userName + '"下线?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return kickUser(row.account);
    })
    .then(() => {
      getList();
      proxy.msgSuccess("下线成功");
    })
    .catch(function () {});
};
</script>

<style>
.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
}
.contextmenu li {
  margin: 0;
  padding: 7px 16px;
  cursor: pointer;
}
.contextmenu li:hover {
  background: #eee;
}
</style>
