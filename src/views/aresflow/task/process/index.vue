<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          size="default"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始时间" prop="deployTime">
        <el-date-picker
          clearable
          size="default"
          v-model="queryParams.deployTime"
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
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          :icon="Plus"
          size="default"
          @click="handleAdd"
          v-hasPermi="['system:deployment:add']"
          >新增流程</el-button
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
      <!-- <right-toolbar
              :showSearch.sync="showSearch"
              @queryTable="getList"
            ></right-toolbar> -->
    </el-row>

    <el-table
      v-loading="loading"
      :data="myProcessListData"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="流程编号"
        align="center"
        prop="instanceId"
        width="200px"
        fixed
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="业务编号"
        align="center"
        prop="businessId"
        width="200px"
        fixed
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="流程名称"
        align="center"
        prop="flowName"
        width="200px"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="流程类别"
        align="center"
        prop="category"
        width="100px"
        :formatter="categoryFormat"
      />
      <el-table-column label="流程版本" align="center" width="80px">
        <template v-slot="scope">
          <el-tag size="default">v{{ scope.row.version }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="提交时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流程状态" align="center" width="100">
        <template v-slot="scope">
          <el-tag type="primary" v-if="scope.row.flowStatus == 0" size="default"
            >待提交</el-tag
          >
          <el-tag type="primary" v-if="scope.row.flowStatus == 1" size="default"
            >审批中</el-tag
          >
          <el-tag type="primary" v-if="scope.row.flowStatus == 2" size="default"
            >审批通过</el-tag
          >
          <el-tag type="primary" v-if="scope.row.flowStatus == 3" size="default"
            >自动通过</el-tag
          >
          <el-tag type="info" v-if="scope.row.flowStatus == 4" size="default"
            >终止</el-tag
          >
          <el-tag type="info" v-if="scope.row.flowStatus == 5" size="default"
            >作废</el-tag
          >
          <el-tag type="warning" v-if="scope.row.flowStatus == 6" size="default"
            >撤销</el-tag
          >
          <el-tag type="warning" v-if="scope.row.flowStatus == 7" size="default"
            >取回</el-tag
          >
          <el-tag type="success" v-if="scope.row.flowStatus == 8" size="default"
            >已完成</el-tag
          >
          <el-tag type="danger" v-if="scope.row.flowStatus == 9" size="default"
            >已退回</el-tag
          >
          <el-tag type="info" v-if="scope.row.flowStatus == 10" size="default"
            >失效</el-tag
          >
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="耗时"
        align="center"
        prop="duration"
        width="180"
      /> -->
      <el-table-column
        label="当前节点"
        align="center"
        prop="nodeName"
        width="200px"
      />
      <el-table-column label="办理" align="center" width="200px">
        <template v-slot="scope">
          <el-tag
            v-for="(item, index) in scope.row.permissionFlag.split(',')"
            :key="index"
            type="info"
            size="default"
          >
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        fixed="right"
        width="100"
      >
        <template v-slot="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              更多操作<el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </span>
            <template v-slot:dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleFlowRecord(scope.row)">
                  <el-icon><Tickets /></el-icon>
                  详情
                </el-dropdown-item>
                <el-dropdown-item
                  @click="handleStop(scope.row)"
                  v-if="scope.row.flowStatus == 1"
                >
                  <el-icon><CircleClose /></el-icon>
                  取消申请
                </el-dropdown-item>
                <el-dropdown-item
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:deployment:remove']"
                >
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

    <!-- 发起流程 -->
    <el-dialog :title="title" v-model="open" width="60%" append-to-body>
      <el-table
        v-loading="processLoading"
        fit
        :data="definitionListData"
        border
      >
        <el-table-column label="流程名称" align="center" prop="flowName" />
        <el-table-column label="流程版本" align="center">
          <template v-slot="scope">
            <el-tag size="default">v{{ scope.row.version }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="流程分类"
          align="center"
          prop="category"
          :formatter="categoryFormat"
        />
        <el-table-column
          label="操作"
          align="center"
          width="300"
          class-name="small-padding fixed-width"
        >
          <template v-slot="scope">
            <el-button
              size="default"
              type="primary"
              link
              :icon="EditOutline"
              @click="handleStartProcess(scope.row)"
              >发起流程</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="processTotal > 0"
        :total="processTotal"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="listDefinition"
      />
    </el-dialog>
  </div>
</template>

<script setup name="Process">
import {
  ArrowDown,
  Search,
  Refresh,
  Plus,
  Delete,
  Download,
  Tickets,
  CircleClose,
  Edit,
} from "@element-plus/icons-vue";
import {
  myProcessList,
  stopProcess,
  activeFlowList,
} from "@/api/aresflow/process";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();

// 遮罩层
const loading = ref(true);
const processLoading = ref(true);
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
const processTotal = ref(0);
// 我发起的流程列表数据
const myProcessListData = ref([]);
// 弹出层标题
const title = ref();
// 是否显示弹出层
const open = ref(false);
const src = ref();
const definitionListData = ref([]);
// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  name: null,
  category: null,
  key: null,
  tenantId: null,
  deployTime: null,
  derivedFrom: null,
  derivedFromRoot: null,
  parentDeploymentId: null,
  engineVersion: null,
});
// 表单参数
const form = ref({});
// 表单校验
const rules = ref({});
const categorys = ref([]);

onMounted(() => {
  proxy.getDicts("sys_process_category").then((res) => {
    categorys.value = res.data;
  });
  getList();
});

const categoryFormat = (row, column) => {
  return proxy.selectDictLabel(categorys.value, row.category);
};
/** 查询流程定义列表 */
const getList = () => {
  loading.value = true;
  myProcessList(queryParams).then((response) => {
    myProcessListData.value = response.data.list;
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
    id: null,
    name: null,
    category: null,
    key: null,
    tenantId: null,
    deployTime: null,
    derivedFrom: null,
    derivedFromRoot: null,
    parentDeploymentId: null,
    engineVersion: null,
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
  ids.value = selection.map((item) => item.procInsId);
  single.value = selection.length !== 1;
  multiple.value = !selection.length;
};
/** 新增按钮操作 */
const handleAdd = () => {
  open.value = true;
  title.value = "发起流程";
  listDefinition();
};
const listDefinition = () => {
  activeFlowList(queryParams).then((response) => {
    definitionListData.value = response.data;
    processTotal.value = response.total;
    processLoading.value = false;
  });
};
/**  发起流程申请 */
const handleStartProcess = (row) => {
  router.push({
    path: "/aresflow/task/record/index",
    query: {
      flowCode: row.flowCode,
      defId: row.id,
      handleType: "start",
    },
  });
};
/**  取消流程申请 */
const handleStop = (row) => {
  const params = {
    taskId: row.taskId,
  };
  stopProcess(params).then((res) => {
    proxy.msgSuccess(res.msg);
    getList();
  });
};
/** 流程流转记录 */
const handleFlowRecord = (row) => {
  router.push({
    path: "/aresflow/task/record/index",
    query: {
      instanceId: row.instanceId,
      defId: row.definitionId,
      taskId: row.taskId,
      handleType: "detail",
    },
  });
};

/** 删除按钮操作 */
const handleDelete = (row) => {
  const ids = row.procInsId || ids.value;
  proxy
    .$confirm('是否确认删除流程定义编号为"' + ids + '"的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return delDeployment(ids);
    })
    .then(() => {
      getList();
      proxy.msgSuccess("删除成功");
    });
};
</script>
