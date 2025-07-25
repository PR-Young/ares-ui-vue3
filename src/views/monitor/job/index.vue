<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="任务名称" prop="jobName">
        <el-input
          v-model="queryParams.jobName"
          placeholder="请输入任务名称"
          clearable
          size="default"
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任务组名" prop="jobGroup">
        <el-select
          v-model="queryParams.jobGroup"
          placeholder="请选择任务组名"
          clearable
          size="default"
          style="width: 240px"
        >
          <el-option
            v-for="dict in jobGroupOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择任务状态"
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
          v-hasPermi="['quartz:edit']"
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
          v-hasPermi="['quartz:edit']"
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
          v-hasPermi="['quartz:delete']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          :icon="Download"
          size="default"
          @click="handleExport"
          v-hasPermi="['quartz:export']"
          >导出</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          :icon="Operation"
          size="default"
          @click="handleJobLog"
          v-hasPermi="['quartz:logList']"
          >日志</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="jobList"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="任务名称"
        align="center"
        prop="jobName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="任务组名"
        align="center"
        prop="jobGroup"
        :formatter="jobGroupFormat"
      />
      <el-table-column
        label="调用目标字符串"
        align="center"
        prop="invokeTarget"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="cron执行表达式"
        align="center"
        prop="cronExpression"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="状态" align="center">
        <template v-slot="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="0"
            :inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
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
            v-hasPermi="['quartz:edit']"
            >修改</el-button
          >
          <el-button
            size="default"
            type="primary"
            link
            :icon="CaretRight"
            @click="handleRun(scope.row)"
            >执行一次</el-button
          >
          <el-button
            size="default"
            type="primary"
            link
            :icon="View"
            @click="handleView(scope.row)"
            >详细</el-button
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

    <!-- 添加或修改定时任务对话框 -->
    <el-dialog :title="title" v-model="open" width="700px" append-to-body>
      <el-form
        ref="addFormRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务名称" prop="jobName">
              <el-input v-model="form.jobName" placeholder="请输入任务名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务分组" prop="jobGroup">
              <el-select v-model="form.jobGroup" placeholder="请选择">
                <el-option
                  v-for="dict in jobGroupOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="描述" prop="description">
              <el-input v-model="form.description" placeholder />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="invokeTarget">
              <template v-slot:label>
                <span>
                  调用方法
                  <el-tooltip placement="top">
                    <template v-slot:content>
                      <div>
                        Class类调用示例：com.system.springbootv1.jobs.TestJob.test()
                        <!-- <br />参数说明：支持字符串，布尔类型，长整型，浮点型，整型 -->
                      </div>
                    </template>
                    <el-icon><el-icon-question /></el-icon>
                  </el-tooltip>
                </span>
              </template>
              <el-input
                v-model="form.invokeTarget"
                placeholder="请输入调用目标字符串"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="cron表达式" prop="cronExpression">
              <el-input
                v-model="form.cronExpression"
                placeholder="请输入cron执行表达式"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否并发" prop="conCurrent">
              <el-radio-group v-model="form.conCurrent" size="default">
                <el-radio-button label="0">允许</el-radio-button>
                <el-radio-button label="1">禁止</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
                  <el-form-item label="错误策略" prop="misfirePolicy">
                    <el-radio-group v-model="form.misfirePolicy" size="default">
                      <el-radio-button label="1">立即执行</el-radio-button>
                      <el-radio-button label="2">执行一次</el-radio-button>
                      <el-radio-button label="3">放弃执行</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </el-col>-->
          <el-col :span="24">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                  >{{ dict.dictLabel }}</el-radio
                >
              </el-radio-group>
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

    <!-- 任务日志详细 -->
    <el-dialog title="任务详细" v-model="openView" width="700px" append-to-body>
      <el-form
        ref="addFormRef"
        :model="form"
        label-width="120px"
        size="default"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务编号：">{{ form.id }}</el-form-item>
            <el-form-item label="任务名称：">{{ form.jobName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务分组：">{{
              jobGroupFormat(form)
            }}</el-form-item>
            <el-form-item label="创建时间：">{{
              form.createTime
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务描述：">{{
              form.description
            }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="调用目标方法：">{{
              form.invokeTarget
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否并发：">
              <div v-if="form.conCurrent == '0'">允许</div>
              <div v-else-if="form.conCurrent == '1'">禁止</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务状态：">
              <div v-if="form.status == 0">启用</div>
              <div v-else-if="form.status == 1">停用</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="openView = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Job">
import {
  QuestionFilled,
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  Download,
  Operation,
  CaretRight,
  View,
} from "@element-plus/icons-vue";
import {
  listJob,
  getJob,
  delJob,
  addJob,
  updateJob,
  exportJob,
  runJob,
  changeJobStatus,
} from "@/api/monitor/job";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

const { proxy } = getCurrentInstance();
const addFormRef = ref();
const router = useRouter();

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
// 定时任务表格数据
const jobList = ref([]);
// 弹出层标题
const title = ref();
// 是否显示弹出层
const open = ref(false);
// 是否显示详细弹出层
const openView = ref(false);
// 任务组名字典
const jobGroupOptions = ref([]);
// 状态字典
const statusOptions = ref([
  { dictValue: 0, dictLabel: "启用" },
  { dictValue: 1, dictLabel: "停用" },
]);
// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  jobName: undefined,
  jobGroup: undefined,
  status: undefined,
});
// 表单参数
const form = ref({});
// 表单校验
const rules = ref({
  jobName: [{ required: true, message: "任务名称不能为空", trigger: "blur" }],
  invokeTarget: [
    {
      required: true,
      message: "调用目标字符串不能为空",
      trigger: "blur",
    },
  ],
  cronExpression: [
    {
      required: true,
      message: "cron执行表达式不能为空",
      trigger: "blur",
    },
  ],
});

onMounted(() => {
  getList();
  proxy.getDicts("sys_job_group").then((response) => {
    jobGroupOptions.value = response.data;
  });
  // proxy.getDicts("sys_job_status").then(response => {
  //   statusOptions = response.data;
  // });
});

/** 查询定时任务列表 */
const getList = () => {
  loading.value = true;
  listJob(queryParams).then((response) => {
    jobList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
};
// 任务组名字典翻译
const jobGroupFormat = (row, column) => {
  return proxy.selectDictLabel(jobGroupOptions.value, row.jobGroup);
};
// 状态字典翻译
const statusFormat = (row, column) => {
  return proxy.selectDictLabel(statusOptions.value, row.status);
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
    jobName: undefined,
    jobGroup: undefined,
    invokeTarget: undefined,
    cronExpression: undefined,
    misfirePolicy: 1,
    concurrent: "1",
    status: 0,
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
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};
// 任务状态修改
const handleStatusChange = (row) => {
  let text = row.status === 0 ? "启用" : "停用";
  proxy
    .$confirm('确认要"' + text + '""' + row.jobName + '"任务吗?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return changeJobStatus(row.id, row.status);
    })
    .then(() => {
      proxy.msgSuccess(text + "成功");
    })
    .catch(function () {
      row.status = row.status === 0 ? 1 : 0;
    });
};
/* 立即执行一次 */
const handleRun = (row) => {
  proxy
    .$confirm('确认要立即执行一次"' + row.jobName + '"任务吗?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return runJob(row.id, row.jobGroup);
    })
    .then(function () {
      proxy.msgSuccess("执行成功");
    })
    .catch(function () {});
};
/** 任务详细信息 */
const handleView = (row) => {
  getJob(row.id).then((response) => {
    form.value = response.data;
    openView.value = true;
  });
};
/** 任务日志列表查询 */
const handleJobLog = () => {
  router.push("/joblog/log");
};
/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  open.value = true;
  title.value = "添加任务";
};
/** 修改按钮操作 */
const handleUpdate = (row) => {
  reset();
  const jobId = row.id || ids;
  getJob(jobId).then((response) => {
    form.value = response.data;
    open.value = true;
    title.value = "修改任务";
  });
};
/** 提交按钮 */
const submitForm = () => {
  addFormRef.value.validate((valid) => {
    if (valid) {
      if (form.value.id != undefined) {
        updateJob(form.value).then((response) => {
          if (response.code === 200) {
            proxy.msgSuccess("修改成功");
            open.value = false;
            getList();
          } else {
            proxy.msgError(response.msg);
          }
        });
      } else {
        addJob(form.value).then((response) => {
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
  const jobIds = row.id || ids;
  proxy
    .$confirm('是否确认删除定时任务编号为"' + jobIds + '"的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return delJob(jobIds);
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
    .$confirm("是否确认导出所有定时任务数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return exportJob(queryParams);
    })
    .then((response) => {
      proxy.download(response.msg);
    })
    .catch(function () {});
};
</script>
