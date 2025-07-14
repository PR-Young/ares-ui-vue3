<!-- eslint-disable prettier/prettier -->
<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="名称" prop="flowName">
        <el-input
          v-model="queryParams.flowName"
          placeholder="请输入名称"
          clearable
          size="default"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始时间" prop="createTime">
        <el-date-picker
          clearable
          size="default"
          v-model="queryParams.createTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="选择时间"
        >
        </el-date-picker>
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
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          :icon="Upload"
          size="default"
          @click="handleImport"
          >导入</el-button
        >
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          :icon="Plus"
          size="default"
          @click="handleAdd"
          >新增</el-button
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
          v-hasPermi="['system:deployment:remove']"
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
          v-hasPermi="['system:deployment:export']"
          >导出</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      fit
      :data="definitionList"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="流程编码"
        align="center"
        prop="flowCode"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="流程类别"
        align="center"
        prop="category"
        :formatter="categoryFormat"
      />
      <el-table-column
        label="流程名称"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template v-slot="scope">
          <el-button type="primary" link @click="handleReadImage(scope.row.id)">
            <span>{{ scope.row.flowName }}</span>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="是否发布" align="center" width="90">
        <template v-slot="scope">
          <el-tag type="warning" v-if="scope.row.isPublish === 0"
            >未发布</el-tag
          >
          <el-tag type="success" v-if="scope.row.isPublish === 1"
            >已发布</el-tag
          >
          <el-tag type="info" v-if="scope.row.isPublish === 9">失效</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="流程版本" align="center" width="90">
        <template v-slot="scope">
          <el-tag size="default">v{{ scope.row.version }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="90">
        <template v-slot="scope">
          <el-tag type="success" v-if="scope.row.activityStatus === 1"
            >激活</el-tag
          >
          <el-tag type="warning" v-if="scope.row.activityStatus === 0"
            >挂起</el-tag
          >
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
            @click="handleLoadXml(scope.row)"
            >设计流程</el-button
          >
          <el-button
            size="default"
            type="primary"
            link
            :icon="Connection"
            @click="handleAddForm(scope.row)"
            v-if="scope.row.formId == null"
            >配置表单</el-button
          >
          <el-dropdown>
            <span class="el-dropdown-link">
              更多操作<el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </span>
            <template v-slot:dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  :icon="VideoPause"
                  @click="handleUpdatePublishState(scope.row)"
                  v-if="scope.row.isPublish === 0"
                >
                  发布
                </el-dropdown-item>
                <el-dropdown-item
                  :icon="VideoPlay"
                  @click="handleUpdatePublishState(scope.row)"
                  v-if="scope.row.isPublish === 1"
                >
                  取消发布
                </el-dropdown-item>
                <el-dropdown-item
                  :icon="VideoPause"
                  @click="handleUpdateSuspensionState(scope.row)"
                  v-if="scope.row.activityStatus === 1"
                >
                  挂起
                </el-dropdown-item>
                <el-dropdown-item
                  :icon="VideoPlay"
                  @click="handleUpdateSuspensionState(scope.row)"
                  v-if="scope.row.activityStatus === 0"
                >
                  激活
                </el-dropdown-item>
                <el-dropdown-item @click="handleDelete(scope.row)">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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

    <!-- 添加或修改流程定义对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form
        ref="addFormRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="流程编码" required prop="flowCode">
          <el-input v-model="form.flowCode" placeholder="请输入流程编码" />
        </el-form-item>
        <el-form-item label="流程名称" required prop="flowName">
          <el-input v-model="form.flowName" placeholder="请输入流程名称" />
        </el-form-item>
        <el-form-item label="流程类别" required prop="category">
          <el-select v-model="form.category" size="default">
            <el-option
              v-for="item in categorys"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="是否自定义表单" prop="formCustom">
          <el-select
            v-model="form.formCustom"
            size="default"
            @change="isCustom"
          >
            <el-option label="是" value="Y" />
            <el-option label="否" value="N" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.formCustom == 'Y'"
          label="表单"
          prop="formPath"
        >
          <el-input v-model="form.formPath" placeholder="请输入表单" />
        </el-form-item> -->
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- bpmn20.xml导入对话框 -->
    <el-dialog
      :title="upload.title"
      v-model="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xml"
        :headers="upload.headers"
        :action="
          upload.url + '?name=' + upload.name + '&category=' + upload.category
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
            流程名称：<el-input v-model="upload.name" /> 流程分类：<el-input
              v-model="upload.category"
            />
          </div>
        </template>
        <template>
          <div class="el-upload__tip" style="color: red">
            提示：仅允许导入“bpmn20.xml”格式文件！
          </div>
        </template>
      </el-upload>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 流程图 -->
    <el-dialog
      :title="readImage.title"
      v-model="readImage.open"
      width="70%"
      append-to-body
    >
      <img :src="xmlData" style="width: 100%" />
    </el-dialog>

    <!--表单配置详情-->
    <el-dialog
      :title="formTitle"
      v-model="formConfOpen"
      width="50%"
      append-to-body
    >
      <div class="test-form">
        <form-parser :conf="formConf" ref="formRef"></form-parser>
      </div>
    </el-dialog>

    <!--挂载表单-->
    <el-dialog
      :title="formDeployTitle"
      v-model="formDeployOpen"
      width="60%"
      append-to-body
    >
      <el-table
        ref="singleTable"
        :data="formList"
        border
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="表单编号" align="center" prop="id" />
        <el-table-column label="表单名称" align="center" prop="formName" />
        <el-table-column label="是否绑定" align="center" prop="formName">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.id === bindFormId"
              >是</el-tag
            >
            <el-tag type="info" v-if="scope.row.id !== bindFormId">否</el-tag>
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
              @click="submitFormDeploy(scope.row)"
              >确定</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <pagination
        layout="prev, pager, next"
        v-show="formTotal > 0"
        :total="formTotal"
        v-model:page="formQueryParams.pageNum"
        v-model:limit="formQueryParams.pageSize"
        @pagination="ListFormDeploy"
      />
    </el-dialog>
  </div>
</template>

<script setup name="AresFlow">
import {
  Search,
  Refresh,
  Upload,
  Plus,
  Delete,
  VideoPause,
  VideoPlay,
  Connection,
  Edit,
} from "@element-plus/icons-vue";
import {
  listDefinition,
  activeFlow,
  unActiveFlow,
  publishFlow,
  unPublishFlow,
  copyFlow,
  delDefinition,
  addDefinition,
  readXml,
} from "@/api/aresflow/definition";
import { getToken } from "@/utils/auth";
import {
  getForm,
  addDeployForm,
  listForm,
  getBindForm,
} from "@/api/aresflow/form";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import FormParser from "@/views/aiform/AiFormParser/index.vue";
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
// 流程定义表格数据
const definitionList = ref([]);
// 弹出层标题
const title = ref();
// 是否显示弹出层
const open = ref(false);
const formConfOpen = ref(false);
const formTitle = ref();
const formDeployOpen = ref(false);
const formDeployTitle = ref();
const formList = ref([]);
const formTotal = ref(0);
// 默认表单数据
const formConf = ref({});
const readImage = ref({
  open: false,
  src: "",
});
// bpmn.xml 导入
const upload = ref({
  // 是否显示弹出层（xml导入）
  open: false,
  // 弹出层标题（xml导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  name: null,
  category: null,
  // 设置上传的请求头部
  headers: { Authorization: "Bearer " + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/flowable/definition/import",
});
// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  flowName: null,
  createTime: null,
});
const formQueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
});
// 挂载表单到流程实例
const formDeployParam = reactive({
  formId: null,
  deployId: null,
});
// xml
const xmlData = ref();
// 表单参数
const form = ref({});
// 表单校验
const rules = ref({});
const categorys = ref([]);
const addFormRef = ref();
const bindFormId = ref();

onMounted(() => {
  getList();
  proxy.getDicts("sys_process_category").then((res) => {
    categorys.value = res.data;
  });
});

const isCustom = () => {};

const categoryFormat = (row, column) => {
  return proxy.selectDictLabel(categorys.value, row.category);
};
/** 查询流程定义列表 */
const getList = () => {
  loading.value = true;
  listDefinition(queryParams).then((response) => {
    definitionList.value = response.data.list;
    total.value = response.data.total;
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
    id: null,
    flowName: null,
    category: null,
    flowCode: null,
    formPath: null,
    formCustom: null,
    listenerType: null,
    listenerPath: null,
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
/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  open.value = true;
  title.value = "添加流程定义";
};
/** 跳转到流程设计页面 */
const handleLoadXml = (row) => {
  router.push({
    path: "/aresflow/definition/model",
    query: { definitionId: row.id, disabled: false },
  });
};
/** 流程图查看 */
const handleReadImage = (id) => {
  readImage.value.title = "流程图";
  readImage.value.open = true;
  // readImage.src = import.meta.env.VITE_APP_BASE_API + "/flowable/definition/readImage/" + deploymentId;
  // 发送请求，获取xml
  readXml(id).then((res) => {
    xmlData.value = "data:image/png;base64," + res.data;
  });
};
/** 表单查看 */
const handleForm = (formId) => {
  getForm(formId).then((res) => {
    formTitle.value = "表单详情";
    formConfOpen.value = true;
    formConf.value = {
      id: formId,
      data: JSON.parse(res.data.formContent).fields,
      model: {
        //    "field2": "选项二", "field1": [ "2023-01-03", "2023-01-17" ], "field1673928917578": 49, "field1673928939297": 4, "field1673928918984": true, "field1673928936079": 16, "field1673928921016": 1, "field1673928930234": "gdfg郭德纲"
      },
      activity: {},
    };
  });
};
/** 挂载表单弹框 */
const handleAddForm = (row) => {
  formDeployParam.deployId = row.id;
  getBindForm(row.id).then((res) => {
    bindFormId.value = res.data.id;
  });
  ListFormDeploy();
};
/** 挂载表单列表 */
const ListFormDeploy = () => {
  listForm(formQueryParams).then((res) => {
    formList.value = res.rows;
    formTotal.value = res.total;
    formDeployOpen.value = true;
    formDeployTitle.value = "挂载表单";
  });
};
/** 挂载表单 */
const submitFormDeploy = (row) => {
  formDeployParam.formId = row.id;
  addDeployForm(formDeployParam).then((res) => {
    proxy.msgSuccess(res.msg);
    formDeployOpen.value = false;
    getList();
  });
};
const handleUpdatePublishState = (row) => {
  if (row.isPublish === 1) {
    unPublishFlow(row.id).then((res) => {
      proxy.msgSuccess(res.msg);
      getList();
    });
  } else {
    publishFlow(row.id).then((res) => {
      proxy.msgSuccess(res.msg);
      getList();
    });
  }
};
/** 挂起/激活流程 */
const handleUpdateSuspensionState = (row) => {
  if (row.activityStatus === 1) {
    unActiveFlow(row.id).then((res) => {
      proxy.msgSuccess(res.msg);
      getList();
    });
  } else {
    activeFlow(row.id).then((res) => {
      proxy.msgSuccess(res.msg);
      getList();
    });
  }
};

/** 提交按钮 */
const submitForm = () => {
  addFormRef.value.validate((valid) => {
    if (valid) {
      if (form.value.id != null) {
        updateDeployment(form.value).then((response) => {
          proxy.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addDefinition(form.value).then((response) => {
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
  const params = row.id || ids;
  proxy
    .$confirm('是否确认删除流程定义编号为"' + params + '"的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return delDefinition(params);
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
    .$confirm("是否确认导出所有流程定义数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return exportDeployment(queryParams);
    })
    .then((response) => {
      proxy.download(response.msg);
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
  proxy.$refs.upload.clearFiles();
  proxy.$message(response.msg);
  getList();
};
// 提交上传文件
const submitFileForm = () => {
  proxy.$refs.upload.submit();
};
</script>

<style>
header {
  background: #fff;
}
</style>
