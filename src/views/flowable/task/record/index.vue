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
          v-if="finished === 'true'"
        >
          <el-button
            :icon="ElIconEditOutline"
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
            :icon="ElIconRefreshLeft"
            type="warning"
            size="default"
            @click="handleReturn"
            >退回</el-button
          >
          <el-button
            :icon="ElIconCircleClose"
            type="danger"
            size="default"
            @click="handleReject"
            >驳回到上一节点</el-button
          >
          <el-button
            :icon="ElIconCircleClose"
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
      <flow :xmlData="xmlData" :taskData="taskList"></flow>
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
            v-model="taskForm.comment"
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
      <el-form ref="taskForm" :model="taskForm" label-width="80px">
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
      <el-form ref="taskForm" :model="taskForm" label-width="80px">
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

    <!--驳回流程new-->
    <el-dialog
      :title="rejectTitle"
      v-model="rejectOpenNew"
      width="40%"
      append-to-body
    >
      <el-form ref="taskForm" :model="taskForm" label-width="80px">
        <el-form-item
          label="意见"
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
          <el-button @click="rejectOpenNew = false">取 消</el-button>
          <el-button type="primary" @click="taskRejectNew">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  Edit as ElIconEditOutline,
  RefreshLeft as ElIconRefreshLeft,
  CircleClose as ElIconCircleClose,
} from "@element-plus/icons";
import { flowRecord } from "@/api/flowable/finished";
import {
  definitionStart,
  getProcessVariables,
  readXml,
  getFlowViewer,
} from "@/api/flowable/definition";
import {
  complete,
  rejectTask,
  returnList,
  returnTask,
  getNextFlowNode,
  delegate,
  getFormData,
  rejectTaskNew,
} from "@/api/flowable/todo";
import flow from "@/views/flowable/task/record/flow.vue";
import { getTreeselect as deptTreeselect } from "@/api/system/dept";
import "vue3-treeselect/dist/vue3-treeselect.css";
import Treeselect from "vue3-treeselect";
import { listUser } from "@/api/system/user";
import FormParser from "@/views/aiform/AiFormParser/index.vue";
import store from "@/store";
import useTagsViewStore from "@/store/modules/tagsView";
import { markRaw } from "vue";
const tagsView = useTagsViewStore(store);

export default {
  data() {
    return {
      // 模型xml数据
      xmlData: "",
      taskList: [],
      // 部门名称
      deptName: undefined,
      // 部门树选项
      deptOptions: undefined,
      // 用户表格数据
      userList: null,
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 查询参数
      queryParams: {
        deptId: undefined,
      },
      // 遮罩层
      loading: true,
      // 流程流转数据
      flowRecordList: [],
      formConfCopy: {},
      src: null,
      // 表单校验
      rules: {},
      // 流程变量数据
      variablesForm: {},
      taskForm: {
        returnTaskShow: false, // 是否展示回退表单
        delegateTaskShow: false, // 是否展示回退表单
        defaultTaskShow: true, // 默认处理
        sendUserShow: false, // 审批用户
        multiple: false,
        comment: "", // 意见内容
        procInsId: "", // 流程实例编号
        instanceId: "", // 流程实例编号
        deployId: "", // 流程定义编号
        taskId: "", // 流程任务编号
        procDefId: "", // 流程编号
        vars: "",
        targetKey: "",
      },
      // 流程候选人
      userDataList: [],
      assignee: null,
      // 默认表单数据
      formConf: {},
      // 是否加载默认表单数据
      formConfOpen: false,
      // 流程变量数据
      variables: [],
      // 流程变量数据
      variablesData: {},
      // 是否加载流程变量数据
      variableOpen: false,
      // 回退列表数据
      returnTaskList: [],
      finished: "false",
      handleType: null,
      completeTitle: null,
      completeOpen: false,
      returnTitle: null,
      returnOpen: false,
      rejectOpen: false,
      rejectTitle: null,
      userData: [],
      rejectOpenNew: false,
      fields: [],
      formCreateData: null,
      ElIconEditOutline,
      ElIconRefreshLeft,
      ElIconCircleClose,
    };
  },
  name: "Record",
  components: {
    flow,
    Treeselect,
    ElIconEditOutline: markRaw(ElIconEditOutline),
    ElIconRefreshLeft: markRaw(ElIconRefreshLeft),
    ElIconCircleClose: markRaw(ElIconCircleClose),
    FormParser,
  },
  props: {},
  created() {
    this.taskForm.deployId = this.$route.query && this.$route.query.deployId;
    this.taskForm.taskId = this.$route.query && this.$route.query.taskId;
    this.taskForm.procInsId = this.$route.query && this.$route.query.procInsId;
    this.taskForm.instanceId = this.$route.query && this.$route.query.procInsId;
    // 初始化表单
    this.taskForm.procDefId = this.$route.query && this.$route.query.procDefId;
    // 回显流程记录
    this.getFlowViewer(this.taskForm.procInsId);
    this.getModelDetail(this.taskForm.deployId);
    // 流程任务重获取变量表单
    if (this.taskForm.taskId) {
      this.processVariables(this.taskForm.taskId);
      this.getNextFlowNode(this.taskForm.taskId);
      this.taskForm.deployId = null;
    }
    this.getFlowRecordList(this.taskForm.procInsId, this.taskForm.deployId);
    this.finished = this.$route.query && this.$route.query.finished;
    this.handleType = this.$route.query && this.$route.query.handleType;
  },
  mounted() {
    //表单数据回填，模拟异步请求场景
    // setTimeout(() => {
    //   // 请求回来的表单数据
    //   if (this.taskForm.instanceId) {
    //     getFormData(this.taskForm.instanceId).then((res) => {
    //       const data = JSON.parse(res.data.formData);
    //       // 回填数据
    //       this.fillFormData(this.formConf, data);
    //     });
    //     // 更新表单
    //     this.key = +new Date().getTime();
    //   }
    // }, 500);
  },
  methods: {
    /** 查询部门下拉树结构 */
    getTreeselect() {
      deptTreeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    /** 查询用户列表 */
    getList() {
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.userList = response.rows;
          this.total = response.total;
        }
      );
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.getList();
    },
    /** xml 文件 */
    getModelDetail(deployId) {
      // 发送请求，获取xml
      readXml(deployId).then((res) => {
        this.xmlData = res.data;
      });
    },
    getFlowViewer(procInsId) {
      getFlowViewer(procInsId).then((res) => {
        this.taskList = res.data;
      });
    },
    setIcon(val) {
      if (val) {
        return "el-icon-check";
      } else {
        return "el-icon-time";
      }
    },
    setColor(val) {
      if (val) {
        return "#2bc418";
      } else {
        return "#b3bdbb";
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.userData = selection;
      const val = selection.map((item) => item.id)[0];
      if (val instanceof Array) {
        this.taskForm.values = {
          approval: val.join(","),
        };
      } else {
        this.taskForm.values = {
          approval: val,
        };
      }
    },
    // 关闭标签
    handleClose(tag) {
      this.userData.splice(this.userData.indexOf(tag), 1);
    },
    /** 流程变量赋值 */
    handleCheckChange(val) {
      if (val instanceof Array) {
        this.taskForm.values = {
          approval: val.join(","),
        };
      } else {
        this.taskForm.values = {
          approval: val,
        };
      }
    },
    /** 流程流转记录 */
    getFlowRecordList(procInsId, deployId) {
      const params = { procInsId: procInsId, deployId: deployId };
      flowRecord(params)
        .then((res) => {
          this.flowRecordList = res.data.flowList;
          // 流程过程中不存在初始化表单 直接读取的流程变量中存储的表单值
          if (res.data.formData) {
            this.formConfOpen = true;
            this.fields = res.data.formData.fields;

            this.formConf = {
              id: null,
              data: res.data.formData.fields,
              model: res.data.formData.formData || {},
              activity: {},
            };
          }
        })
        .catch((res) => {
          console.log(res);
          this.goBack();
        });
    },
    fillFormData(form, data) {
      form.model = data.data;
      // form.model.forEach((item) => {
      //   const val = data[item.__vModel__];
      //   if (val) {
      //     item.__config__.defaultValue = val;
      //   }
      // });
    },
    /** 获取流程变量内容 */
    processVariables(taskId) {
      if (taskId) {
        // 提交流程申请时填写的表单存入了流程变量中后续任务处理时需要展示
        getProcessVariables(taskId).then((res) => {
          this.variablesData = {
            id: null,
            data: res.data.fields,
            model: res.data.data,
            activity: {},
          };

          this.variableOpen = true;
        });
      }
    },
    /** 根据当前任务或者流程设计配置的下一步节点 */
    getNextFlowNode(taskId) {
      // 根据当前任务或者流程设计配置的下一步节点 todo 暂时未涉及到考虑网关、表达式和多节点情况
      const params = { taskId: taskId };
      getNextFlowNode(params).then((res) => {
        const data = res.data;
        if (data) {
          if (data.type === "assignee") {
            this.userDataList = res.data.userList;
          } else if (data.type === "candidateUsers") {
            this.userDataList = res.data.userList;
            this.taskForm.multiple = true;
          } else if (data.type === "candidateGroups") {
            res.data.roleList.forEach((role) => {
              role.userId = role.roleId;
              role.nickName = role.roleName;
            });
            this.userDataList = res.data.roleList;
            this.taskForm.multiple = false;
          } else if (data.type === "multiInstance") {
            this.userDataList = res.data.userList;
            this.taskForm.multiple = true;
          }
          this.taskForm.sendUserShow = true;
        }
      });
    },
    /** 审批任务选择 */
    handleComplete() {
      this.completeOpen = true;
      this.completeTitle = "审批流程";
      this.getTreeselect();
    },
    /** 审批任务 */
    taskComplete() {
      // if (!this.taskForm.comment) {
      //   this.msgError("请输入审批意见");
      //   return;
      // }
      this.taskForm.values = { approve: "同意" };
      complete(this.taskForm).then((response) => {
        this.msgSuccess(response.msg);
        this.goBack();
        this.completeOpen = false;
      });
    },
    /** 委派任务 */
    handleDelegate() {
      this.taskForm.delegateTaskShow = true;
      this.taskForm.defaultTaskShow = false;
    },
    handleAssign() {},
    /** 返回页面 */
    goBack() {
      // 关闭当前标签页并返回上个页面
      tagsView.delView(this.$route);
      this.$router.go(-1);
    },
    /** 接收子组件传的值 */
    getData(data) {
      if (data) {
        const variables = [];
        data.fields.forEach((item) => {
          let variableData = {};
          variableData.label = item.__config__.label;
          // 表单值为多个选项时
          if (item.__config__.defaultValue instanceof Array) {
            const array = [];
            item.__config__.defaultValue.forEach((val) => {
              array.push(val);
            });
            variableData.val = array;
          } else {
            variableData.val = item.__config__.defaultValue;
          }
          variables.push(variableData);
        });
        this.variables = variables;
      }
    },
    /** 申请流程表单数据提交 */
    submitForm(data) {
      this.$refs["formRef"].submitForm((model) => {
        console.log(model);
        const variables = {
          fields: this.fields,
          INITIATOR: "",
          data: model,
          ...model,
        };
        const formData = model;
        if (this.taskForm.procDefId) {
          variables.variables = formData;
          // 启动流程并将表单数据加入流程变量
          definitionStart(
            this.taskForm.procDefId,
            JSON.stringify(variables)
          ).then((res) => {
            this.msgSuccess(res.msg);
            this.goBack();
          });
        }
      });
    },
    /** 驳回任务 */
    handleReject() {
      this.rejectOpen = true;
      this.rejectTitle = "驳回流程";
    },
    /** 驳回任务 */
    taskReject() {
      this.$refs["taskForm"].validate((valid) => {
        if (valid) {
          rejectTask(this.taskForm).then((res) => {
            this.msgSuccess(res.msg);
            this.goBack();
            this.rejectOpen = false;
          });
        }
      });
    },
    /** 驳回任务new */
    handleRejectNew() {
      this.rejectOpenNew = true;
      this.rejectTitle = "驳回流程";
    },
    /** 驳回任务 */
    taskRejectNew() {
      this.$refs["taskForm"].validate((valid) => {
        if (valid) {
          this.taskForm.values = { approve: "拒绝" };
          rejectTaskNew(this.taskForm).then((res) => {
            this.msgSuccess(res.msg);
            this.goBack();
            this.rejectOpenNew = false;
          });
        }
      });
    },
    /** 可退回任务列表 */
    handleReturn() {
      this.returnOpen = true;
      this.returnTitle = "退回流程";
      returnList(this.taskForm).then((res) => {
        this.returnTaskList = res.data;
        this.taskForm.values = null;
      });
    },
    /** 提交退回任务 */
    taskReturn() {
      this.$refs["taskForm"].validate((valid) => {
        if (valid) {
          returnTask(this.taskForm).then((res) => {
            this.msgSuccess(res.msg);
            this.goBack();
            this.returnOpen = false;
          });
        }
      });
    },
    /** 取消回退任务按钮 */
    cancelTask() {
      this.taskForm.returnTaskShow = false;
      this.taskForm.defaultTaskShow = true;
      this.taskForm.sendUserShow = true;
      this.returnTaskList = [];
    },
    /** 委派任务 */
    submitDeleteTask() {
      this.$refs["taskForm"].validate((valid) => {
        if (valid) {
          delegate(this.taskForm).then((response) => {
            this.msgSuccess(response.msg);
            this.goBack();
          });
        }
      });
    },
    /** 取消回退任务按钮 */
    cancelDelegateTask() {
      this.taskForm.delegateTaskShow = false;
      this.taskForm.defaultTaskShow = true;
      this.taskForm.sendUserShow = true;
      this.returnTaskList = [];
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
