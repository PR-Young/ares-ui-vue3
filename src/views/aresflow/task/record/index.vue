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
          <el-button
            :icon="CircleClose"
            type="warning"
            size="default"
            @click="handleReject"
            >退回</el-button
          >
          <el-button
            :icon="Edit"
            type="primary"
            size="default"
            @click="handleTransfer"
            >转办</el-button
          >
          <el-button
            :icon="Edit"
            type="primary"
            size="default"
            @click="handleDepute"
            >委派</el-button
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
    <el-card class="box-card" v-if="handleHistoryData">
      <template v-slot:header>
        <div class="clearfix">
          <span class="el-icon-notebook-1">审批记录</span>
        </div>
      </template>
      <el-col :span="16" :offset="4">
        <div class="block">
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in handleHistoryData"
              :key="index"
              :icon="setIcon(item.flowStatus)"
              :color="setColor(item.flowStatus)"
            >
              <p style="font-weight: 700">
                {{ item.nodeName }}
                <el-tag
                  type="primary"
                  v-if="item.flowStatus == 0"
                  size="default"
                  >待提交</el-tag
                >
                <el-tag
                  type="primary"
                  v-if="item.flowStatus == 1"
                  size="default"
                  >审批中</el-tag
                >
                <el-tag
                  type="primary"
                  v-if="item.flowStatus == 2"
                  size="default"
                  >审批通过</el-tag
                >
                <el-tag
                  type="primary"
                  v-if="item.flowStatus == 3"
                  size="default"
                  >自动通过</el-tag
                >
                <el-tag type="info" v-if="item.flowStatus == 4" size="default"
                  >终止</el-tag
                >
                <el-tag type="info" v-if="item.flowStatus == 5" size="default"
                  >作废</el-tag
                >
                <el-tag
                  type="warning"
                  v-if="item.flowStatus == 6"
                  size="default"
                  >撤销</el-tag
                >
                <el-tag
                  type="warning"
                  v-if="item.flowStatus == 7"
                  size="default"
                  >取回</el-tag
                >
                <el-tag
                  type="success"
                  v-if="item.flowStatus == 8"
                  size="default"
                  >已完成</el-tag
                >
                <el-tag type="danger" v-if="item.flowStatus == 9" size="default"
                  >已退回</el-tag
                >
                <el-tag type="info" v-if="item.flowStatus == 10" size="default"
                  >失效</el-tag
                >
              </p>
              <el-card
                style="margin-top: 2px"
                :body-style="{ padding: '10px' }"
              >
                <label
                  v-if="item.approver"
                  style="font-weight: normal; margin-right: 30px"
                  >实际办理： {{ item.approver }}
                </label>
                <label
                  v-if="item.collaborator"
                  style="font-weight: normal; margin-right: 30px"
                  >候选办理： {{ item.collaborator }}</label
                >
                <label style="font-weight: normal">接收时间： </label
                ><label style="color: #8a909c; font-weight: normal">
                  {{ parseTime(item.createTime) }}</label
                >
                <label
                  v-if="item.updateTime"
                  style="margin-left: 30px; font-weight: normal"
                  >办结时间： </label
                ><label style="color: #8a909c; font-weight: normal">{{
                  parseTime(item.updateTime)
                }}</label>
                <label
                  v-if="item.duration"
                  style="margin-left: 30px; font-weight: normal"
                  >耗时： </label
                ><label style="color: #8a909c; font-weight: normal"
                  >{{ item.duration }}秒</label
                >

                <p v-if="item.message">
                  <label style="margin-left: 30px; font-weight: normal"
                    >审批意见：
                  </label>
                  <el-tag type="success" v-if="item.flowStatus === '2'">
                    {{ item.message }}</el-tag
                  >
                  <el-tag type="warning" v-if="item.flowStatus === '1'">
                    {{ item.message }}</el-tag
                  >
                  <el-tag type="danger" v-if="item.flowStatus === '9'">
                    {{ item.message }}</el-tag
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
      <img v-if="handleType == 'start'" :src="xmlData" style="width: 100%" />
      <iframe
        v-if="handleType != 'start'"
        :src="xmlData"
        style="width: 100%; height: 300px; border: 0"
      />
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

    <!--转办流程-->
    <el-dialog
      :title="transferTitle"
      v-model="transferOpen"
      width="40%"
      append-to-body
    >
      <el-form ref="taskFormTransferRef" :model="taskForm" label-width="80px">
        <el-form-item
          label="处理人"
          prop="params.addHandlers"
          :rules="[
            { required: true, message: '请选择处理人', trigger: 'blur' },
          ]"
        >
          <el-select v-model="taskForm.params.addHandlers" clearable multiple>
            <el-option
              v-for="item in userDataList"
              :key="item.id"
              :label="item.userName"
              :value="item.id"
              :disabled="item.id === userStore.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="审批意见"
          prop="message"
          :rules="[
            { required: true, message: '请输入审批意见', trigger: 'blur' },
          ]"
        >
          <el-input
            style="width: 100%"
            type="textarea"
            v-model="taskForm.message"
            placeholder="请输入审批意见"
          />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="transferOpen = false">取 消</el-button>
          <el-button type="primary" @click="taskTransfer">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!--退回流程-->
    <el-dialog
      :title="rejectTitle"
      v-model="rejectOpen"
      width="40%"
      append-to-body
    >
      <el-form ref="taskFormRejectRef" :model="taskForm" label-width="80px">
        <el-form-item
          label="退回意见"
          prop="message"
          :rules="[{ required: true, message: '请输入意见', trigger: 'blur' }]"
        >
          <el-input
            style="width: 100%"
            type="textarea"
            v-model="taskForm.message"
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

    <!--委派流程-->
    <el-dialog
      :title="deputeTitle"
      v-model="deputeOpen"
      width="40%"
      append-to-body
    >
      <el-form ref="taskFormDeputeRef" :model="taskForm" label-width="80px">
        <el-form-item
          label="处理人"
          prop="params.addHandlers"
          :rules="[
            { required: true, message: '请选择处理人', trigger: 'blur' },
          ]"
        >
          <el-select v-model="taskForm.params.addHandlers" clearable multiple>
            <el-option
              v-for="item in userDataList"
              :key="item.id"
              :label="item.userName"
              :value="item.id"
              :disabled="item.id === userStore.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="审批意见"
          prop="message"
          :rules="[
            { required: true, message: '请输入审批意见', trigger: 'blur' },
          ]"
        >
          <el-input
            style="width: 100%"
            type="textarea"
            v-model="taskForm.message"
            placeholder="请输入审批意见"
          />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="deputeOpen = false">取 消</el-button>
          <el-button type="primary" @click="taskDepute">确 定</el-button>
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
  transferTask,
  depute,
} from "@/api/aresflow/todo";
import FormParser from "@/views/aiform/AiFormParser/index.vue";
import store from "@/store";
import useTagsViewStore from "@/store/modules/tagsView";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { startFlow, getFlowChart } from "@/api/aresflow/process";
import useUserStore from "@/store/modules/user";
import { listUser } from "@/api/system/user";
const { proxy } = getCurrentInstance();
const router = useRouter();
const tagsView = useTagsViewStore(store);
const userStore = useUserStore(store);

// 模型xml数据
const xmlData = ref();

// 流程流转数据
const flowRecordList = ref([]);

const taskForm = ref({
  message: "", // 意见内容
  instanceId: "", // 流程实例编号
  flowCode: "",
  taskId: "", // 流程任务编号
  defId: "", // 流程编号
  targetKey: "",
  variable: null,
  params: {
    addHandlers: [],
  },
});
// 流程候选人
const userDataList = ref([]);
// 默认表单数据
const formConf = ref();
// 是否加载默认表单数据
const formConfOpen = ref(false);
// 流程变量数据
const variables = ref([]);
// 流程变量数据
const variablesData = ref({});
// 是否加载流程变量数据
const variableOpen = ref(false);

const handleType = ref();
const completeTitle = ref();
const completeOpen = ref(false);
const transferTitle = ref();
const transferOpen = ref(false);
const rejectOpen = ref(false);
const rejectTitle = ref();

const fields = ref([]);

const taskFormRejectRef = ref();
const taskFormTransferRef = ref();
const formRef = ref();
const taskFormDeputeRef = ref();

const deputeTitle = ref();
const deputeOpen = ref(false);

const handleHistoryData = ref();

onMounted(() => {
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
  // xmlData.value =
  //   import.meta.env.VITE_APP_BASE_API +
  //   "/warm-flow-ui/index.html?id=" +
  //   id +
  //   "&type=FlowChart";
};

const getFlowChartImg = (id) => {
  xmlData.value =
    import.meta.env.VITE_APP_BASE_API +
    "/ares/warm-flow-ui/index.html?id=" +
    id +
    "&type=FlowChart&showGrid=true";
};

const setIcon = (val) => {
  if (val == 2) {
    return "Check";
  } else {
    return "Timer";
  }
};
const setColor = (val) => {
  if (val == 2) {
    return "#2bc418";
  } else {
    return "#b3bdbb";
  }
};

// 表单重置
const reset = (formRef) => {
  taskForm.value = {
    message: "", // 意见内容
    instanceId: "", // 流程实例编号
    flowCode: "",
    taskId: "", // 流程任务编号
    defId: "", // 流程编号
    targetKey: "",
    variable: null,
    params: {
      addHandlers: [],
    },
  };
  proxy.resetForm(formRef);
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
      if (res.data.hisTasks) {
        handleHistoryData.value = res.data.hisTasks;
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
        variableOpen.value = true;
        fields.value = res.data.formData.fields;

        variablesData.value = {
          id: null,
          data: res.data.formData.fields,
          model: res.data.formData.formData.data || {},
          activity: {},
        };
      }

      if (res.data.hisTasks) {
        handleHistoryData.value = res.data.hisTasks;
      }
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
  if (taskForm.value.message == undefined || taskForm.value.message == "") {
    taskForm.value.message = "同意";
  }
  complete(taskForm.value).then((response) => {
    proxy.msgSuccess(response.msg);
    goBack();
    completeOpen.value = false;
  });
};
/** 委派任务 */
const handleDepute = () => {
  deputeOpen.value = true;
  deputeTitle.value = "委派任务";
  reset("taskFormDeputeRef");
  const param = {
    deptId: userStore.deptId,
  };
  listUser(param).then((res) => {
    userDataList.value = res.rows;
  });
};
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
      proxy.msgSuccess("成功");
      goBack();
    });
  });
};
/** 退回任务 */
const handleReject = () => {
  rejectOpen.value = true;
  rejectTitle.value = "退回流程";
  reset("taskFormRejectRef");
};
/** 退回任务 */
const taskReject = () => {
  taskFormRejectRef.value.validate((valid) => {
    if (valid) {
      rejectTask(taskForm.value).then((res) => {
        proxy.msgSuccess(res.msg);
        goBack();
        rejectOpen.value = false;
      });
    }
  });
};

/** 转办任务 */
const handleTransfer = () => {
  transferOpen.value = true;
  transferTitle.value = "转办流程";
  reset("taskFormTransferRef");
  const param = {
    deptId: userStore.deptId,
  };
  listUser(param).then((res) => {
    userDataList.value = res.rows;
  });
};
/** 提交转办任务 */
const taskTransfer = () => {
  taskFormTransferRef.value.validate((valid) => {
    if (valid) {
      transferTask(taskForm.value).then((res) => {
        proxy.msgSuccess(res.msg);
        goBack();
        transferOpen.value = false;
      });
    }
  });
};

/** 委派任务 */
const taskDepute = () => {
  taskFormDeputeRef.value.validate((valid) => {
    if (valid) {
      depute(taskForm.value).then((response) => {
        proxy.msgSuccess(response.msg);
        goBack();
        deputeOpen.value = false;
      });
    }
  });
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
