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
      <!-- <right-toolbar
              :showSearch.sync="showSearch"
              @queryTable="getList"
            ></right-toolbar> -->
    </el-row>

    <el-table
      v-loading="loading"
      :data="finishedListData"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="任务编号"
        align="center"
        prop="taskId"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="流程名称"
        align="center"
        prop="flowName"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="任务节点" align="center" prop="nodeName" />
      <el-table-column label="流程发起人" align="center">
        <template v-slot="scope">
          <label>{{ scope.row.userName }} </label>
        </template>
      </el-table-column>
      <el-table-column
        label="接收时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template></el-table-column
      >
      <el-table-column
        label="审批时间"
        align="center"
        prop="finishTime"
        width="180"
      >
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.finishTime) }}</span>
        </template></el-table-column
      >
      <!-- <el-table-column
        label="耗时"
        align="center"
        prop="duration"
        width="180"
      /> -->
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
            :icon="Tickets"
            @click="handleFlowRecord(scope.row)"
            >流转记录</el-button
          >
          <el-button
            size="default"
            type="primary"
            link
            v-if="scope.row.nodeName != '结束'"
            :icon="Tickets"
            @click="handleRevoke(scope.row)"
            >撤回
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
  </div>
</template>

<script setup name="Finished">
import { Search, Refresh, Delete, Tickets } from "@element-plus/icons-vue";
import { finishedList, revokeProcess } from "@/api/aresflow/finished";
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
// 已办任务列表数据
const finishedListData = ref([]);
// 弹出层标题
const title = ref();
// 是否显示弹出层
const open = ref(false);
const src = ref();
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

onMounted(() => {
  getList();
});

/** 查询流程定义列表 */
const getList = () => {
  loading.value = true;
  finishedList(queryParams).then((response) => {
    finishedListData.value = response.data.list;
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
  single.value = selection.length !== 1;
  multiple.value = !selection.length;
};
/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  open.value = true;
  title.value = "添加流程定义";
};
/** 流程流转记录 */
const handleFlowRecord = (row) => {
  router.push({
    path: "/aresflow/task/record/index",
    query: {
      instanceId: row.instanceId,
      defId: row.definitionId,
      taskId: row.taskId,
      handleType: "finished",
    },
  });
};
/** 撤回任务 */
const handleRevoke = (row) => {
  const params = {
    instanceId: row.instanceId,
  };
  revokeProcess(params).then((res) => {
    proxy.msgSuccess(res.msg);
    getList();
  });
};
/** 删除按钮操作 */
const handleDelete = (row) => {
  const ids = row.id || ids.value;
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
