<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          label-width="68px"
        >
          <el-form-item label="模型名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入模型名称"
              clearable
              size="default"
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
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

        <el-row class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              :icon="ElIconPlus"
              size="default"
              @click="handleAdd"
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
              >删除</el-button
            >
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="modelList"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column
            label="模型名称"
            align="center"
            prop="name"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="KEY"
            align="center"
            prop="key"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="版本"
            align="center"
            prop="version"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="部署ID"
            align="center"
            prop="deploymentId"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="创建时间" align="center" prop="createTime">
            <template v-slot="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="280"
            class-name="small-padding fixed-width"
          >
            <template v-slot="scope">
              <el-button
                size="default"
                type="primary"
                link
                :icon="ElIconSOperation"
                @click="handleDraw(scope.row)"
                >流程定义</el-button
              >
              <el-button
                size="default"
                type="primary"
                link
                :icon="ElIconUpload"
                @click="handleDeploy(scope.row)"
                >部署</el-button
              >
              <el-button
                size="default"
                type="primary"
                link
                :icon="ElIconEdit"
                @click="handleUpdate(scope.row)"
                >修改</el-button
              >
              <el-button
                size="default"
                type="primary"
                link
                :icon="ElIconDelete"
                @click="handleDelete(scope.row)"
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
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :header="title" v-model="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="模型名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入模型名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="KEY" prop="key">
              <el-input
                v-model="form.key"
                placeholder="请输入KEY"
                maxlength="11"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="描述" prop="desc">
              <el-input
                v-model="form.desc"
                placeholder="请输入描述"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类" prop="category">
              <el-input v-model="form.category" placeholder="请输入分类" />
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

    <el-dialog
      id="flowEditor"
      header="流程定义"
      v-model="show"
      fullscreen
      top="2"
    >
      <iframe
        v-bind:src="actUrl"
        id="editor"
        style="width: 100%; height: 850px"
      ></iframe>
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
  Operation as ElIconSOperation,
  Upload as ElIconUpload,
} from "@element-plus/icons";
import {
  list,
  getWorkflow,
  addWorkflow,
  updateWorkflow,
  delWorkflow,
  deployWorkflow,
} from "@/api/workflow/workflow";

export default {
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
      // 用户表格数据
      modelList: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      show: false,
      actUrl: "http://localhost/static/modeler.html?modelId=",
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: "模型名称不能为空", trigger: "blur" },
        ],
        key: [{ required: true, message: "KEY不能为空", trigger: "blur" }],
      },
      ElIconSearch,
      ElIconRefresh,
      ElIconPlus,
      ElIconEdit,
      ElIconDelete,
      ElIconSOperation,
      ElIconUpload,
    };
  },
  name: "Workflow",
  created() {
    this.getList();
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      list(this.queryParams).then((response) => {
        this.modelList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
        name: undefined,
        key: undefined,
        desc: undefined,
        category: undefined,
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
      this.open = true;
      this.title = "添加模型";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const modelId = row.id || this.ids;
      getWorkflow(modelId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改模型";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateWorkflow(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addWorkflow(this.form).then((response) => {
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
      const modelIds = row.id || this.ids;
      this.$confirm('是否确认删除模型为"' + modelIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delWorkflow(modelIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    handleDraw(row) {
      this.show = true;
      this.actUrl = "http://localhost/static/modeler.html?modelId=" + row.id;
    },
    handleDeploy(row) {
      this.$confirm("您确定要部署该模型吗？", "确认部署", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return deployWorkflow(row.id);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
  },
};
</script>
