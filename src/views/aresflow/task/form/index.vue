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
          plain
          :icon="Plus"
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
          :icon="Edit"
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
          :icon="Delete"
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
          :icon="Download"
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
            :icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['sysForm:edit']"
            >修改</el-button
          >
          <el-button
            size="default"
            type="primary"
            link
            :icon="Delete"
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
      <el-form ref="addFormRef" :model="form" :rules="rules" label-width="80px">
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

<script setup name="Form">
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  Download,
  View,
} from "@element-plus/icons-vue";
import {
  listForm,
  getForm,
  delForm,
  addForm,
  updateForm,
  exportForm,
} from "@/api/aresflow/form";
import Editor from "@/components/Editor/index.vue";
import FormParser from "@/views/aiform/AiFormParser/index.vue";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
// 遮罩层
const loading = ref(true);
// 选中数组
const ids = ref([]);
// 非单个禁用
const single = ref(true);
// 非多个禁用
const multiple = ref(true);
// 显示搜索条件
const showSearch = ref(true);
// 总条数
const total = ref(0);
// 流程表单表格数据
const formList = ref([]);
// 弹出层标题
const title = ref();
// 默认表单数据
const formConf = ref({});
const formConfOpen = ref(false);
const formTitle = ref();
// 是否显示弹出层
const open = ref(false);
// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  formName: null,
  formContent: null,
});
// 表单参数
const form = ref({});
// 表单校验
const rules = ref({});
const addFormRef = ref();

onMounted(() => {
  getList();
});
/** 查询流程表单列表 */
const getList = () => {
  loading.value = true;
  listForm(queryParams).then((response) => {
    formList.value = response.rows;
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
    formId: null,
    formName: null,
    formContent: null,
    createTime: null,
    updateTime: null,
    createBy: null,
    updateBy: null,
    remark: null,
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
  single.value = selection.length !== 1;
  multiple.value = !selection.length;
};
/** 表单配置信息 */
const handleDetail = (row) => {
  formConfOpen.value = true;
  formTitle.value = "流程表单配置详细";
  formConf.value = {
    id: row.id,
    data: JSON.parse(row.formContent).fields,
    model: {
      //    "field2"="选项二"; "field1"=[ "2023-01-03"; "2023-01-17" ]; "field1673928917578"=49; "field1673928939297"=4; "field1673928918984"=true; "field1673928936079"=16; "field1673928921016"=1; "field1673928930234"="gdfg郭德纲"
    },
    activity: {},
  };
};
/** 新增按钮操作 */
const handleAdd = () => {
  // reset();
  // open = true;
  // title = "添加流程表单";
  router.push({
    path: "/aiform/build/index",
    query: { formId: null },
  });
};
/** 修改按钮操作 */
const handleUpdate = (row) => {
  router.push({
    path: "/aiform/build/index",
    query: { formId: row.id },
  });
};
/** 提交按钮 */
const submitForm = () => {
  addFormRef.value.validate((valid) => {
    if (valid) {
      if (form.value.formId != null) {
        updateForm(form.value).then((response) => {
          proxy.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addForm(form.value).then((response) => {
          proxy.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
};
/** 删除按钮操作 */
const handleDelete = (row) => {
  const formIds = row.id || ids.value;
  proxy
    .$confirm('是否确认删除流程表单编号为"' + formIds + '"的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return delForm(formIds);
    })
    .then(() => {
      getList();
      proxy.msgSuccess("删除成功");
    });
};
/** 导出按钮操作 */
const handleExport = () => {
  const queryParams = queryParams;
  proxy
    .$confirm("是否确认导出所有流程表单数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return exportForm(queryParams);
    })
    .then((response) => {
      proxy.download(response.msg);
    });
};
</script>

<style lang="scss" scoped>
.test-form {
  margin: 15px auto;
  width: 800px;
  padding: 15px;
}
</style>
