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
          size="small"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="租户名" prop="tenantName">
        <el-input
          v-model="queryParams.tenantName"
          placeholder="请输入租户名"
          clearable
          size="small"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="ElIconSearch"
          size="default"
          @click="handleQuery"
          >搜索
        </el-button>
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
          v-hasPermi="['sysTenants:edit']"
          >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          :icon="ElIconEdit"
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
          :icon="ElIconDelete"
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
          :icon="ElIconDownload"
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
            :icon="ElIconEdit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['sysTenants:edit']"
            >修改
          </el-button>
          <el-button
            size="default"
            type="primary"
            link
            :icon="ElIconDelete"
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
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
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

<script>
import {
  Search as ElIconSearch,
  Refresh as ElIconRefresh,
  Plus as ElIconPlus,
  Edit as ElIconEdit,
  Delete as ElIconDelete,
  Download as ElIconDownload,
} from "@element-plus/icons";
import {
  addSysTenants,
  delSysTenants,
  exportSysTenants,
  getSysTenants,
  listSysTenants,
  updateSysTenants,
  changeStatus,
} from "@/api/system/tenant";
import { markRaw } from "vue";

export default {
  name: "SysTenants",
  data() {
    return {
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
      // 岗位表格数据
      sysTenantsList: [],
      // 用户选项
      userOptions: [],
      selectedUsers: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      titleOptions: ["未选择", "已选择"],
      // 状态数据字典
      statusOptions: [
        { dictValue: "0", dictLabel: "启用" },
        { dictValue: "1", dictLabel: "停用" },
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tenantAlias: undefined,
        tenantName: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      ElIconSearch,
      ElIconRefresh,
      ElIconPlus,
      ElIconEdit,
      ElIconDelete,
      ElIconDownload,
    };
  },
  components: {
    ElIconSearch: markRaw(ElIconSearch),
    ElIconRefresh: markRaw(ElIconRefresh),
    ElIconPlus: markRaw(ElIconPlus),
    ElIconEdit: markRaw(ElIconEdit),
    ElIconDelete: markRaw(ElIconDelete),
    ElIconDownload: markRaw(ElIconDownload),
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询岗位列表 */
    getList() {
      this.loading = true;
      listSysTenants(this.queryParams).then((response) => {
        this.sysTenantsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    selectable(row, index) {
      if (row.id === "1") {
        return false;
      }
      return true;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    change() {
      for (let i = 0; i < this.selectedUsers.length; i++) {}
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        tenantName: undefined,
        tenantAlias: undefined,
        tenantStatus: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
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
      getSysTenants().then((response) => {
        this.open = true;
        this.title = "添加租户";
        this.userOptions = [];
        this.selectedUsers = [];
        let data = response.allUser;
        data.forEach((item) => {
          this.userOptions.push({
            label: item.userName,
            key: item.id,
            user: item.userName,
            disabled: item.disabled === 0,
          });
        });
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getSysTenants(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改租户";
        this.userOptions = [];
        this.selectedUsers = [];
        let data = response.allUser;
        data.forEach((item) => {
          this.userOptions.push({
            label: item.userName,
            key: item.id,
            user: item.userName,
            //disabled: item.disabled === 0
          });
        });
        let checked = response.checkedKeys;
        checked.forEach((item) => {
          this.selectedUsers.push(item);
        });
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.userIds = this.selectedUsers;
          if (this.form.id != undefined) {
            updateSysTenants(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addSysTenants(this.form).then((response) => {
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
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除租户编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delSysTenants(ids);
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
      this.$confirm("是否确认导出所有租户数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportSysTenants(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    handleStatusChange(row) {
      let text = row.tenantStatus === "0" ? "启用" : "停用";
      this.$confirm(
        "确认要" + text + "[" + row.tenantName + "]租户吗?",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return changeStatus(row.id, row.tenantStatus);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.tenantStatus = row.tenantStatus === "0" ? "1" : "0";
        });
    },
  },
};
</script>
