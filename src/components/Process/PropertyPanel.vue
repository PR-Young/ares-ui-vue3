<template>
  <div ref="propertyPanel" class="property-panel">
    <div v-if="nodeName" class="node-name">{{ nodeName }}</div>
    <component
      :is="getComponent"
      v-if="element"
      :element="element"
      :modeler="modeler"
      :users="users"
      :groups="groups"
      :categorys="categorys"
      @dataType="dataType"
    />
  </div>
</template>

<script>
import { $on, $off, $once, $emit } from "../../utils/gogocodeTransfer";
import taskPanel from "./components/nodePanel/task.vue";
import startEndPanel from "./components/nodePanel/startEnd.vue";
import processPanel from "./components/nodePanel/process.vue";
import sequenceFlowPanel from "./components/nodePanel/sequenceFlow.vue";
import gatewayPanel from "./components/nodePanel/gateway.vue";
import { NodeName } from "./lang/zh";
import { markRaw, nextTick } from "vue";

export default {
  name: "PropertyPanel",
  components: {
    processPanel: markRaw(processPanel),
    taskPanel: markRaw(taskPanel),
    startEndPanel: markRaw(startEndPanel),
    sequenceFlowPanel: markRaw(sequenceFlowPanel),
    gatewayPanel: markRaw(gatewayPanel),
  },
  props: {
    users: {
      type: Array,
      required: true,
    },
    groups: {
      type: Array,
      required: true,
    },
    categorys: {
      type: Array,
      required: true,
    },
    modeler: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      element: null,
      form: {
        id: "",
        name: "",
        color: null,
      },
      roles: [
        { value: "manager", label: "经理" },
        { value: "personnel", label: "人事" },
        { value: "charge", label: "主管" },
      ],
    };
  },
  computed: {
    getComponent() {
      const type = this.element?.type;
      if (
        [
          "bpmn:IntermediateThrowEvent",
          "bpmn:StartEvent",
          "bpmn:EndEvent",
        ].includes(type)
      ) {
        return "startEndPanel";
      }
      if (
        [
          "bpmn:UserTask",
          "bpmn:Task",
          "bpmn:SendTask",
          "bpmn:ReceiveTask",
          "bpmn:ManualTask",
          "bpmn:BusinessRuleTask",
          "bpmn:ServiceTask",
          "bpmn:ScriptTask",
          // 'bpmn:CallActivity',
          // 'bpmn:SubProcess'
        ].includes(type)
      ) {
        return "taskPanel";
      }
      if (type === "bpmn:SequenceFlow") {
        return "sequenceFlowPanel";
      }
      if (
        [
          "bpmn:InclusiveGateway",
          "bpmn:ExclusiveGateway",
          "bpmn:ParallelGateway",
          "bpmn:EventBasedGateway",
        ].includes(type)
      ) {
        return "gatewayPanel";
      }
      if (type === "bpmn:Process") {
        return "processPanel";
      }
      return null;
    },
    nodeName() {
      if (this.element) {
        const bizObj = this.element.businessObject;
        const type =
          bizObj.eventDefinitions && bizObj.eventDefinitions.length > 0
            ? bizObj.eventDefinitions[0].$type
            : bizObj.$type;
        return NodeName[type] || type;
      }
      return "";
    },
  },
  mounted() {
    this.handleModeler();
  },
  methods: {
    handleModeler() {
      this.modeler.on("root.added", async (e) => {
        if (e.element.type === "bpmn:Process") {
          this.element = null;
          await nextTick().then(() => {
            this.element = e.element;
          });
        }
      });
      this.modeler.on("element.click", async (e) => {
        const { element } = e;
        console.log(element);
        if (element.type === "bpmn:Process") {
          this.element = element;
        }
      });
      this.modeler.on("selection.changed", async (e) => {
        // hack 同类型面板不刷新
        this.element = null;
        const element = e.newSelection[0];
        if (element) {
          await nextTick().then(() => {
            this.element = element;
          });
        }
      });
    },
    /** 获取数据类型 */
    dataType(data) {
      $emit(this, "dataType", data);
    },
  },
  emits: ["dataType"],
};
</script>

<style lang="scss">
.property-panel {
  padding: 20px 20px;
  .el-form--label-top .el-form-item__label {
    padding: 0;
  }
  .el-form-item {
    margin-bottom: 6px;
  }
  .tab-table .el-form-item {
    margin-bottom: 16px;
  }
  .node-name {
    border-bottom: 1px solid #ccc;
    padding: 0 0 10px 20px;
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: bold;
    color: #444;
  }
}
</style>
