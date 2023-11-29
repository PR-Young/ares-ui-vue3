import BpmnViewer from './src/BpmnViewer.vue'


export default function bpmnViewerInstall(app) {
  app.component(BpmnViewer.name, BpmnViewer)
}


