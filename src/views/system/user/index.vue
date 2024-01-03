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
            :prefix-icon="ElIconSearch"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
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
              :icon="ElIconSearch"
              size="default"
              @click="handleQuery"
              >搜索</el-button
            >
            <el-button :icon="ElIconRefresh" size="default" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              :icon="ElIconPlus"
              size="default"
              @click="handleAdd"
              v-hasPermi="['user:edit']"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              :icon="ElIconEdit"
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
              :icon="ElIconDelete"
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
              :icon="ElIconUpload"
              size="default"
              @click="handleImport"
              v-hasPermi="['user:import']"
              >导入</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              :icon="ElIconDownload"
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
                :icon="ElIconEdit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['user:edit']"
                >修改</el-button
              >
              <el-button
                v-if="scope.row.id != 1"
                size="default"
                type="primary"
                link
                :icon="ElIconDelete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['user:delete']"
                >删除</el-button
              >
              <el-button
                size="default"
                type="primary"
                link
                :icon="ElIconKey"
                @click="handleResetPwd(scope.row)"
                >重置</el-button
              >
              <el-button
                size="default"
                type="primary"
                link
                :icon="ElIconBottom"
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
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
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
        ref="upload"
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
        <el-icon><el-icon-upload /></el-icon>
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
            <el-link type="info" style="font-size: 12px" @click="importTemplate"
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
      <li @click="addDept">新增部门</li>
      <li @click="updateDept">修改部门</li>
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
      <el-form ref="form" :model="deptForm" label-width="80px">
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

<script>
import {
  Upload as ElIconUpload,
  Search as ElIconSearch,
  Refresh as ElIconRefresh,
  Plus as ElIconPlus,
  Edit as ElIconEdit,
  Delete as ElIconDelete,
  Download as ElIconDownload,
  Key as ElIconKey,
  Bottom as ElIconBottom,
} from "@element-plus/icons";
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
  treeselect,
  delDept,
  addDept,
  updateDept,
  getDept,
} from "@/api/system/dept";
import Treeselect from "vue3-treeselect";
import "vue3-treeselect/dist/vue3-treeselect.css";
import { markRaw } from "vue";

export default {
  data() {
    return {
      selectedTreeNode: undefined,
      selectedParentNode: undefined,
      deptOpen: false,
      deptTitle: "",
      deptForm: {},
      rightVisible: false,
      left: 0,
      top: 0,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: "123456",
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 性别状态字典
      sexOptions: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 用户导入参数
      upload: {
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
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: "1",
        sortColumn: undefined,
        sortAsc: undefined,
      },
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
        ],
        account: [
          { required: true, message: "用户帐号不能为空", trigger: "blur" },
        ],
        deptId: [
          { required: true, message: "归属部门不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" },
        ],
        // email: [
        //   { required: true, message: "邮箱地址不能为空", trigger: "blur" },
        //   {
        //     type: "email",
        //     message: "'请输入正确的邮箱地址",
        //     trigger: ["blur", "change"]
        //   }
        // ],
        // phoneNumber: [
        //   { required: true, message: "手机号码不能为空", trigger: "blur" },
        //   {
        //     pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        //     message: "请输入正确的手机号码",
        //     trigger: "blur"
        //   }
        // ]
      },
      ElIconSearch,
      ElIconRefresh,
      ElIconPlus,
      ElIconEdit,
      ElIconDelete,
      ElIconUpload,
      ElIconDownload,
      ElIconKey,
      ElIconBottom,
    };
  },
  components: {
    Treeselect: markRaw(Treeselect),
    ElIconUpload: markRaw(ElIconUpload),
    ElIconSearch: markRaw(ElIconSearch),
    ElIconRefresh: markRaw(ElIconRefresh),
    ElIconPlus: markRaw(ElIconPlus),
    ElIconEdit: markRaw(ElIconEdit),
    ElIconDelete: markRaw(ElIconDelete),
    ElIconDownload: markRaw(ElIconDownload),
    ElIconKey: markRaw(ElIconKey),
    ElIconBottom: markRaw(ElIconBottom),
  },
  name: "User",
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    },
    rightVisible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    },
  },
  created() {
    this.getList();
    this.getTreeselect();
  },
  methods: {
    sortChange(data) {
      const { prop, order } = data;
      this.queryParams.sortColumn = prop;
      this.queryParams.sortAsc = order === null ? "descending" : order;
      this.getList();
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.getList();
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
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
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getTreeselect();
      getUser().then((response) => {
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.open = true;
        this.title = "添加用户";
        this.form.password = this.initPassword;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      const userId = row.id || this.ids;
      getUser(userId).then((response) => {
        this.form = response.data;
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.form.roleIds = response.roleIds;
        this.open = true;
        this.title = "修改用户";
      });
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$confirm("是否重置密码", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          resetUserPwd(row.id, value).then((response) => {
            if (response.code === 200) {
              this.msgSuccess("修改成功，新密码是：123456");
            } else {
              this.msgError(response.msg);
            }
          });
        })
        .catch(() => {});
    },
    handleStatusChange(row) {
      let text = row.status === 1 ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.userName + '"吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          updateUser(row).then((response) => {
            if (response.code === 200) {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          });
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.status = row.status === 1 ? 1 : 0;
        });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateUser(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addUser(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.id || this.ids;
      if (row.id == "1" || this.ids.includes("1")) {
        this.msgError("管理员帐号不能删除！");
        return;
      }
      this.$confirm('是否确认删除用户为"' + userIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delUser(userIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有用户数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportUser(queryParams);
        })
        .then((response) => {
          this.download(response, "用户信息");
        })
        .catch(function () {});
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then((response) => {
        this.download(response, "用户导入模版");
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },

    openMenu(event, data, node, element) {
      const menuMinWidth = 105;
      const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
      const offsetWidth = this.$el.offsetWidth; // container width
      const maxLeft = offsetWidth - menuMinWidth; // left boundary
      const left = event.clientX - offsetLeft; // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft;
      } else {
        this.left = left;
      }
      this.top = event.clientY - 80; // fix 位置bug
      this.selectedTreeNode = data;
      this.selectedParentNode = node.parent.data;
      this.rightVisible = true;
    },
    closeMenu() {
      this.rightVisible = false;
    },
    // 取消按钮
    deptCancel() {
      this.deptOpen = false;
      this.deptReset();
    },
    // 表单重置
    deptReset() {
      this.deptForm = {
        id: undefined,
        parentDeptId: undefined,
        parentDeptName: undefined,
        code: undefined,
        deptName: undefined,
      };
      this.resetForm("form");
    },
    addDept() {
      this.deptReset();
      this.deptForm.parentDeptId = this.selectedTreeNode.id;
      this.deptForm.parentDeptName = this.selectedTreeNode.label;
      this.deptOpen = true;
      this.deptTitle = "添加部门";
    },
    updateDept() {
      this.deptReset();
      const id = this.selectedTreeNode.id;
      getDept(id).then((response) => {
        this.deptForm = response.data;
        this.deptOpen = true;
        this.deptTitle = "修改部门";
      });
    },
    submitDeptForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.deptForm.id != undefined) {
            updateDept(this.deptForm).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.deptOpen = false;
                this.getTreeselect();
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addDept(this.deptForm).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.deptOpen = false;
                this.getTreeselect();
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    deleteDept() {
      const id = this.selectedTreeNode.id;
      if (id === "1") {
        this.msgError("根节点不能删除！");
        return;
      }
      this.$confirm("是否确认删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delDept(id);
        })
        .then(() => {
          this.getList();
          this.getTreeselect();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    refreshTree() {
      this.getTreeselect();
    },
    handleKickUser(row) {
      const userName = row.userName;
      this.$confirm('是否让用户"' + userName + '"下线?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return kickUser(row.account);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("下线成功");
        })
        .catch(function () {});
    },
  },
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
