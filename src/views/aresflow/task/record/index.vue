<template>
  <div class="app-container">
    <el-card class="box-card">
      <template v-slot:header>
        <div class="clearfix">
          <span class="el-icon-document">基础信息</span>
          <el-button style="float: right" type="primary" @click="goBack"
            >返回</el-button
          >
        </div>
      </template>

      <!--流程处理表单模块-->
      <el-col :span="16" :offset="4" v-if="variableOpen">
        <div>
          <form-parser :conf="variablesData" ref="formHandleRef"></form-parser>
        </div>
        <div
          style="margin-left: 20%; margin-bottom: 20px; font-size: 14px"
          v-if="handleType === 'handle'"
        >
          <el-button
            :icon="Edit"
            type="success"
            size="default"
            @click="handleComplete"
            >审批</el-button
          >
          <!-- <el-button
                  icon="el-icon-edit-outline"
                  type="primary"
                  size="default"
                  @click="handleDelegate"
                  >委派</el-button
                >
                <el-button
                  icon="el-icon-edit-outline"
                  type="primary"
                  size="default"
                  @click="handleAssign"
                  >转办</el-button
                >
                <el-button
                  icon="el-icon-edit-outline"
                  type="primary"
                  size="default"
                  @click="handleDelegate"
                  >签收</el-button
                > -->
          <el-button
            :icon="RefreshLeft"
            type="warning"
            size="default"
            @click="handleReturn"
            >退回</el-button
          >
          <el-button
            :icon="CircleClose"
            type="danger"
            size="default"
            @click="handleReject"
            >驳回到上一节点</el-button
          >
          <el-button
            :icon="CircleClose"
            type="danger"
            size="default"
            @click="handleRejectNew"
            >驳回</el-button
          >
        </div>
      </el-col>

      <!--初始化流程加载表单信息-->
      <el-col :span="16" :offset="4" v-if="formConfOpen">
        <div class="test-form">
          <form-parser :conf="formConf" ref="formRef"></form-parser>
          <div style="text-align: center" v-if="handleType === 'start'">
            <el-button type="primary" @click="submitForm">提交</el-button>
          </div>
        </div>
      </el-col>
    </el-card>

    <!--流程流转记录-->
    <el-card class="box-card" v-if="flowRecordList">
      <template v-slot:header>
        <div class="clearfix">
          <span class="el-icon-notebook-1">审批记录</span>
        </div>
      </template>
      <el-col :span="16" :offset="4">
        <div class="block">
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in flowRecordList"
              :key="index"
              :icon="setIcon(item.finishTime)"
              :color="setColor(item.finishTime)"
            >
              <p style="font-weight: 700">{{ item.taskName }}</p>
              <el-card :body-style="{ padding: '10px' }">
                <label
                  v-if="item.assigneeName"
                  style="font-weight: normal; margin-right: 30px"
                  >实际办理： {{ item.assigneeName }}
                  <el-tag type="info" size="default">{{
                    item.deptName
                  }}</el-tag></label
                >
                <label
                  v-if="item.candidate"
                  style="font-weight: normal; margin-right: 30px"
                  >候选办理： {{ item.candidate }}</label
                >
                <label style="font-weight: normal">接收时间： </label
                ><label style="color: #8a909c; font-weight: normal">{{
                  item.createTime
                }}</label>
                <label
                  v-if="item.finishTime"
                  style="margin-left: 30px; font-weight: normal"
                  >办结时间： </label
                ><label style="color: #8a909c; font-weight: normal">{{
                  item.finishTime
                }}</label>
                <label
                  v-if="item.duration"
                  style="margin-left: 30px; font-weight: normal"
                  >耗时： </label
                ><label style="color: #8a909c; font-weight: normal">{{
                  item.duration
                }}</label>

                <p v-if="item.comment">
                  <el-tag type="success" v-if="item.comment.type === '1'">
                    {{ item.comment.comment }}</el-tag
                  >
                  <el-tag type="warning" v-if="item.comment.type === '2'">
                    {{ item.comment.comment }}</el-tag
                  >
                  <el-tag type="danger" v-if="item.comment.type === '3'">
                    {{ item.comment.comment }}</el-tag
                  >
                </p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-col>
    </el-card>
    <el-card class="box-card">
      <template v-slot:header>
        <div class="clearfix">
          <span class="el-icon-picture-outline">流程图</span>
        </div>
      </template>
      <img :src="xmlData" style="width: 100%" />
    </el-card>

    <!--审批正常流程-->
    <el-dialog
      :title="completeTitle"
      v-model="completeOpen"
      width="60%"
      append-to-body
    >
      <el-row
        ><el-col>
          <el-input
            type="textarea"
            v-model="taskForm.message"
            placeholder="请输入处理意见"
          />
        </el-col>
      </el-row>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-row>
            <el-col style="margin-top: 5px">
              <el-button @click="completeOpen = false">取 消</el-button>
              <el-button type="primary" @click="taskComplete">确 定</el-button>
            </el-col>
          </el-row>
        </span>
      </template>
    </el-dialog>

    <!--退回流程-->
    <el-dialog
      :title="returnTitle"
      v-model="returnOpen"
      width="40%"
      append-to-body
    >
      <el-form ref="taskFormReturnRef" :model="taskForm" label-width="80px">
        <el-form-item label="退回节点" prop="targetKey">
          <el-radio-group v-model="taskForm.targetKey">
            <el-radio-button
              v-for="item in returnTaskList"
              :key="item.id"
              :label="item.id"
              >{{ item.name }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="退回意见"
          prop="comment"
          :rules="[{ required: true, message: '请输入意见', trigger: 'blur' }]"
        >
          <el-input
            style="width: 100%"
            type="textarea"
            v-model="taskForm.comment"
            placeholder="请输入意见"
          />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="returnOpen = false">取 消</el-button>
          <el-button type="primary" @click="taskReturn">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!--驳回流程-->
    <el-dialog
      :title="rejectTitle"
      v-model="rejectOpen"
      width="40%"
      append-to-body
    >
      <el-form ref="taskFormRejectRef" :model="taskForm" label-width="80px">
        <el-form-item
          label="驳回意见"
          prop="comment"
          :rules="[{ required: true, message: '请输入意见', trigger: 'blur' }]"
        >
          <el-input
            style="width: 100%"
            type="textarea"
            v-model="taskForm.comment"
            placeholder="请输入意见"
          />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="rejectOpen = false">取 消</el-button>
          <el-button type="primary" @click="taskReject">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Record">
import { Edit, RefreshLeft, CircleClose } from "@element-plus/icons-vue";
import { flowRecord } from "@/api/aresflow/finished";
import { readXml } from "@/api/aresflow/definition";
import {
  complete,
  rejectTask,
  returnList,
  returnTask,
  delegate,
} from "@/api/aresflow/todo";
import FormParser from "@/views/aiform/AiFormParser/index.vue";
import store from "@/store";
import useTagsViewStore from "@/store/modules/tagsView";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { startFlow, getFlowChart } from "@/api/aresflow/process";
const { proxy } = getCurrentInstance();
const router = useRouter();
const tagsView = useTagsViewStore(store);

// 模型xml数据
const xmlData = ref();
const taskList = ref([]);
// 部门名称
const deptName = ref();
// 部门树选项
const deptOptions = ref();
// 用户表格数据
const userList = ref();
const total = ref(0);
const defaultProps = ref({
  children: "children",
  label: "label",
});
// 查询参数
const queryParams = reactive({
  deptId: undefined,
});
// 遮罩层
const loading = ref(true);
// 流程流转数据
const flowRecordList = ref([]);
const formConfCopy = ref({});
const src = ref();
// 表单校验
const rules = ref({});
// 流程变量数据
const variablesForm = ref({});
const taskForm = ref({
  returnTaskShow: false, // 是否展示回退表单
  delegateTaskShow: false, // 是否展示回退表单
  defaultTaskShow: true, // 默认处理
  sendUserShow: false, // 审批用户
  multiple: false,
  message: "", // 意见内容
  instanceId: "", // 流程实例编号
  flowCode: "",
  taskId: "", // 流程任务编号
  defId: "", // 流程编号
  targetKey: "",
  variable: null,
});
// 流程候选人
const userDataList = ref([]);
const assignee = ref();
// 默认表单数据
const formConf = ref({});
// 是否加载默认表单数据
const formConfOpen = ref(false);
// 流程变量数据
const variables = ref([]);
// 流程变量数据
const variablesData = ref({});
// 是否加载流程变量数据
const variableOpen = ref(false);
// 回退列表数据
const returnTaskList = ref([]);
const finished = ref("false");
const handleType = ref();
const completeTitle = ref();
const completeOpen = ref(false);
const returnTitle = ref();
const returnOpen = ref(false);
const rejectOpen = ref(false);
const rejectTitle = ref();
const userData = ref([]);
const rejectOpenNew = ref(false);
const fields = ref([]);
const formCreateData = ref();
const taskFormRejectRef = ref();
const taskFormReturnRef = ref();
const formRef = ref();
const taskFormDelegateRef = ref();
const dateRange = ref();

onMounted(() => {
  debugger;
  const query = router.currentRoute._value.query;
  handleType.value = query && query.handleType;
  taskForm.value.defId = query && query.defId;
  taskForm.value.flowCode = query && query.flowCode;
  if (handleType.value == "start") {
    console.log("start");
    getFlowRecordInit(taskForm.value.defId);
    getModelDetail(taskForm.value.defId);
  } else if (handleType.value == "detail") {
    console.log("detail");
    taskForm.value.instanceId = query && query.instanceId;
    taskForm.value.taskId = query && query.taskId;
    getFlowRecordList(taskForm.value.instanceId, taskForm.value.defId);
    getFlowChartImg(taskForm.value.instanceId);
  } else if (handleType.value == "handle") {
    console.log("handle");
    taskForm.value.instanceId = query && query.instanceId;
    taskForm.value.taskId = query && query.taskId;
    processVariables(
      taskForm.value.taskId,
      taskForm.value.instanceId,
      taskForm.value.defId
    );
    getFlowChartImg(taskForm.value.instanceId);
  } else if (handleType.value == "finished") {
    taskForm.value.taskId = query && query.taskId;
    taskForm.value.instanceId = query && query.instanceId;
    getFlowChartImg(taskForm.value.instanceId);
    processVariables(
      taskForm.value.taskId,
      taskForm.value.instanceId,
      taskForm.value.defId
    );
  }
});
/** xml 文件 */
const getModelDetail = (id) => {
  // 发送请求，获取xml
  readXml(id).then((res) => {
    xmlData.value = "data:image/png;base64," + res.data;
  });
};

const getFlowChartImg = (id) => {
  // 发送请求，获取xml
  getFlowChart(id).then((res) => {
    xmlData.value = "data:image/png;base64," + res.data;
  });
};

const setIcon = (val) => {
  if (val) {
    return "el-icon-check";
  } else {
    return "el-icon-time";
  }
};
const setColor = (val) => {
  if (val) {
    return "#2bc418";
  } else {
    return "#b3bdbb";
  }
};
/** 流程流转记录 */
const getFlowRecordInit = (deployId) => {
  const params = { procInsId: null, deployId: deployId };
  flowRecord(params)
    .then((res) => {
      flowRecordList.value = res.data.flowList;
      // 流程过程中不存在初始化表单 直接读取的流程变量中存储的表单值
      if (res.data.formData) {
        formConfOpen.value = true;
        fields.value = res.data.formData.fields;

        formConf.value = {
          id: null,
          data: res.data.formData.fields,
          model: res.data.formData.formData || {},
          activity: {},
        };
      }
    })
    .catch((res) => {
      console.log(res);
      goBack();
    });
};
/** 流程流转记录 */
const getFlowRecordList = (procInsId, deployId) => {
  const params = { procInsId: procInsId, deployId: deployId };
  flowRecord(params)
    .then((res) => {
      flowRecordList.value = res.data.flowList;
      // 流程过程中不存在初始化表单 直接读取的流程变量中存储的表单值
      if (res.data.formData) {
        formConfOpen.value = true;
        fields.value = res.data.formData.fields;

        formConf.value = {
          id: null,
          data: res.data.formData.fields,
          model: res.data.formData.formData.data || {},
          activity: {},
        };
      }
    })
    .catch((res) => {
      console.log(res);
      goBack();
    });
};
/** 获取流程变量内容 */
const processVariables = (taskId, procInsId, deployId) => {
  const params = { procInsId: procInsId, deployId: deployId };
  if (taskId) {
    // 提交流程申请时填写的表单存入了流程变量中后续任务处理时需要展示
    flowRecord(params).then((res) => {
      // 流程过程中不存在初始化表单 直接读取的流程变量中存储的表单值
      if (res.data.formData) {
        fields.value = res.data.formData.fields;

        variablesData.value = {
          id: null,
          data: res.data.formData.fields,
          model: res.data.formData.formData.data || {},
          activity: {},
        };
      }

      variableOpen.value = true;
    });
  }
};
/** 审批任务选择 */
const handleComplete = () => {
  completeOpen.value = true;
  completeTitle.value = "审批流程";
};
/** 审批任务 */
const taskComplete = () => {
  taskForm.value.message = "同意";
  complete(taskForm.value).then((response) => {
    proxy.msgSuccess(response.msg);
    goBack();
    completeOpen.value = false;
  });
};
/** 委派任务 */
const handleDelegate = () => {
  taskForm.value.delegateTaskShow = true;
  taskForm.value.defaultTaskShow = false;
};
const handleAssign = () => {};
/** 返回页面 */
const goBack = () => {
  // 关闭当前标签页并返回上个页面
  tagsView.delView(router);
  router.go(-1);
};
/** 申请流程表单数据提交 */
const submitForm = (data) => {
  formRef.value.submitForm((model) => {
    console.log(model);
    const variables = {
      flowCode: taskForm.value.flowCode,
      fields: fields,
      data: model,
    };
    const formData = model;

    variables.variables = formData;
    // 启动流程并将表单数据加入流程变量
    startFlow(JSON.stringify(variables)).then((res) => {
      proxy.msgSuccess(res.msg);
      goBack();
    });
  });
};
/** 驳回任务 */
const handleReject = () => {
  rejectOpen.value = true;
  rejectTitle.value = "驳回流程";
};
/** 驳回任务 */
const taskReject = () => {
  taskFormRejectRef.value.validate((valid) => {
    if (valid) {
      rejectTask(taskForm).then((res) => {
        proxy.msgSuccess(res.msg);
        goBack();
        rejectOpen.value = false;
      });
    }
  });
};

/** 可退回任务列表 */
const handleReturn = () => {
  returnOpen.value = true;
  returnTitle.value = "退回流程";
  returnList(taskForm).then((res) => {
    returnTaskList.value = res.data;
    taskForm.value.values = null;
  });
};
/** 提交退回任务 */
const taskReturn = () => {
  taskFormReturnRef.value.validate((valid) => {
    if (valid) {
      returnTask(taskForm).then((res) => {
        proxy.msgSuccess(res.msg);
        goBack();
        returnOpen.value = false;
      });
    }
  });
};
/** 取消回退任务按钮 */
const cancelTask = () => {
  taskForm.value.returnTaskShow = false;
  taskForm.value.defaultTaskShow = true;
  taskForm.value.sendUserShow = true;
  returnTaskList.value = [];
};
/** 委派任务 */
const submitDelegateTask = () => {
  taskFormDelegateRef.value.validate((valid) => {
    if (valid) {
      delegate(taskForm).then((response) => {
        proxy.msgSuccess(response.msg);
        goBack();
      });
    }
  });
};
/** 取消回退任务按钮 */
const cancelDelegateTask = () => {
  taskForm.value.delegateTaskShow = false;
  taskForm.value.defaultTaskShow = true;
  taskForm.value.sendUserShow = true;
  returnTaskList.value = [];
};
</script>

<style lang="scss" scoped>
.test-form {
  margin: 15px auto;
  width: 800px;
  padding: 15px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.box-card {
  width: 100%;
  margin-bottom: 20px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
