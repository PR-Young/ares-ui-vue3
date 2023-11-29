import workflowBpmnModeler from './index.vue'


export default function workflowBpmnModelerInstall(app) {
  app.component(workflowBpmnModeler.name, workflowBpmnModeler)
}
