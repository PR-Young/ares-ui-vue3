import workflowBpmnModeler from './index.vue'

workflowBpmnModeler.install = (Vue) =>
  window.$vueApp.component(workflowBpmnModeler.name, workflowBpmnModeler) // 给组件配置install方法

export default workflowBpmnModeler
