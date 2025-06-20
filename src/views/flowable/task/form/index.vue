<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="表单名称" prop="formName">
        <el-input
          v-model="queryParams.formName"
          placeholder="请输入表单名称"
          clearable
          size="default"
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          :icon="ElIconPlus"
          size="default"
          @click="handleAdd"
          v-hasPermi="['sysForm:edit']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          :icon="ElIconEdit"
          size="default"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['sysForm:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          :icon="ElIconDelete"
          size="default"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['sysForm:delete']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          :icon="ElIconDownload"
          size="default"
          @click="handleExport"
          v-hasPermi="['sysForm:export']"
          >导出</el-button
        >
      </el-col>
      <!-- <right-toolbar
              :showSearch.sync="showSearch"
              @queryTable="getList"
            ></right-toolbar> -->
    </el-row>

    <el-table
      v-loading="loading"
      :data="formList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="表单主键" align="center" prop="id" />
      <el-table-column label="表单名称" align="center" prop="formName" />
      <el-table-column label="备注" align="center" prop="remark" />
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
            @click="handleDetail(scope.row)"
            >详情</el-button
          >
          <el-button
            size="default"
            type="primary"
            link
            :icon="ElIconEdit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['sysForm:edit']"
            >修改</el-button
          >
          <el-button
            size="default"
            type="primary"
            link
            :icon="ElIconDelete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['sysForm:delete']"
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

    <!-- 添加或修改流程表单对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="表单名称" prop="formName">
          <el-input v-model="form.formName" placeholder="请输入表单名称" />
        </el-form-item>
        <el-form-item label="表单内容">
          <editor v-model="form.formContent" :min-height="192" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!--表单配置详情-->
    <el-dialog
      :title="formTitle"
      v-model="formConfOpen"
      width="60%"
      append-to-body
    >
      <div class="test-form">
        <form-parser :conf="formConf" ref="formRef"></form-parser>
      </div>
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
  View,
} from "@element-plus/icons";
import {
  listForm,
  getForm,
  delForm,
  addForm,
  updateForm,
  exportForm,
} from "@/api/flowable/form";
import Editor from "@/components/Editor/index.vue";
import FormParser from "@/views/aiform/AiFormParser/index.vue";
import { markRaw } from "vue";
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
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 流程表单表格数据
      formList: [],
      // 弹出层标题
      title: "",
      // 默认表单数据
      formConf: {},
      formConfOpen: false,
      formTitle: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        const pageNum=ref(1)
        const pageSize=ref(10)
        formName: null,
        formContent: null,
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
      ElIconView,
    };
  },
  name: "Form",
  components: {
    Editor,
    ElIconSearch: markRaw(ElIconSearch),
    ElIconRefresh: markRaw(ElIconRefresh),
    ElIconPlus: markRaw(ElIconPlus),
    ElIconEdit: markRaw(ElIconEdit),
    ElIconDelete: markRaw(ElIconDelete),
    ElIconDownload: markRaw(ElIconDownload),
    ElIconView: markRaw(ElIconView),
    FormParser,
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询流程表单列表 */
    getList() {
      this.loading = true;
      listForm(this.queryParams).then((response) => {
        this.formList = response.rows;
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
        formId: null,
        formName: null,
        formContent: null,
        createTime: null,
        updateTime: null,
        createBy: null,
        updateBy: null,
        remark: null,
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
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 表单配置信息 */
    handleDetail(row) {
      this.formConfOpen = true;
      this.formTitle = "流程表单配置详细";
      this.formConf = {
        id: row.id,
        data: JSON.parse(row.formContent).fields,
        model: {
          //    "field2": "选项二", "field1": [ "2023-01-03", "2023-01-17" ], "field1673928917578": 49, "field1673928939297": 4, "field1673928918984": true, "field1673928936079": 16, "field1673928921016": 1, "field1673928930234": "gdfg郭德纲"
        },
        activity: {},
      };
    },
    /** 新增按钮操作 */
    handleAdd() {
      // this.reset();
      // this.open = true;
      // this.title = "添加流程表单";
      this.$router.push({
        path: "/aiform/build/index",
        query: { formId: null },
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      // this.reset();
      // const formId = row.formId || this.ids
      // getForm(formId).then(response => {
      //   this.form = response.data;
      //   this.open = true;
      //   this.title = "修改流程表单";
      // });
      this.$router.push({
        path: "/aiform/build/index",
        query: { formId: row.id },
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.formId != null) {
            updateForm(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addForm(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const formIds = row.id || this.ids;
      this.$confirm(
        '是否确认删除流程表单编号为"' + formIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delForm(formIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有流程表单数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportForm(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.test-form {
  margin: 15px auto;
  width: 800px;
  padding: 15px;
}
</style>
