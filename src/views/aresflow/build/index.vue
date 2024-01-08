<template>
  <!--创建容器-->
  <div class="containerBox">
    <div class="canvas" ref="canvasRef"></div>
    <div class="panel" id="js-properties-panel"></div>
    <!--属性面板将通过该元素呈现到其中-->
  </div>
</template>
<script>
import { ElMessage } from "element-plus";
import { reactive } from "vue";
import BpmnModeler from "bpmn-js/lib/Modeler.js"; // 引入 bpmn-js
// 导入一下有关于bpmn-js的字体库以及样式文件
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
// 右侧属性面包样式
import "bpmn-js-properties-panel/dist/assets/properties-panel.css";
// 汉化包 (这里注意你们项目的路径！！！！！！！)
import customTranslate from "./components/customTranslate";
// 注意这个xml文件
//import xmlStr from "@/components/Process/flowable/init.js";
import xmlStr from "./components/xml.js";
// 两个属性面板相关模块
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule,
} from "bpmn-js-properties-panel";
import CamundaBpmnModdle from "camunda-bpmn-moddle/resources/camunda.json";
//import flowableModdleExtension from "./components/flowableExtension.js";
import flowableModdle from "./components/flowable.json";

export default {
  data() {
    return {
      state: reactive({
        bpmnModeler: null,
        bpmnXmlStr: xmlStr(),
      }),
    };
  },
  mounted() {
    // 将汉化包装成一个模块
    const customTranslateModule = {
      translate: ["value", customTranslate],
    };
    // 生成实例
    this.state.bpmnModeler = new BpmnModeler({
      container: this.$refs["canvasRef"], // 获取到属性ref为“canvasRef”的dom节点
      propertiesPanel: {
        parent: "#js-properties-panel",
      },
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        CamundaPlatformPropertiesProviderModule,
        //  汉化模块
        customTranslateModule,
        //flowableModdleExtension,
      ],
      moddleExtensions: {
        camunda: CamundaBpmnModdle,
        //flowable: flowableModdle,
      },
    });
    this.createNewDiagram(this.state.bpmnXmlStr); // 新增流程定义
  },
  methods: {
    async createNewDiagram(bpmn) {
      try {
        const result = await this.state.bpmnModeler.importXML(bpmn);
        const { warnings } = result;
        console.log(warnings);
      } catch (e) {
        ElMessage.error("打开模型出错，数据格式有误！");
        console.log("error---->", e);
      }
    },
  },
};
</script>
<style>
.containerBox {
  height: calc(100vh - 160px);
  margin-top: 30px;
  position: relative;
}

.containerBox #container {
  height: calc(100vh - 160px);
  border: 1px solid rgb(121, 121, 121);
}

.canvas {
  width: calc(100vw - 750px);
  height: calc(100vh - 150px);
}

.bpp-properties-panel [type="text"] {
  box-sizing: border-box;
}

.panel {
  width: 400px;
  position: absolute;
  top: 1px;
  right: 1px;
  height: 100%;
  overflow: auto;
}

/* 右下角logo */
.bjs-powered-by {
  display: none;
}
</style>