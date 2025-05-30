import request from "@/utils/request";

// 查询待办任务列表
export function todoList(query: any) {
  return request({
    url: "/ares/flowable/task/todoList",
    method: "get",
    params: query,
  });
}

// 完成任务
export function complete(data: any) {
  return request({
    url: "/ares/flowable/task/complete",
    method: "post",
    data: data,
  });
}

// 委派任务
export function delegate(data: any) {
  return request({
    url: "/ares/flowable/task/delegate",
    method: "post",
    data: data,
  });
}

// 退回任务
export function returnTask(data: any) {
  return request({
    url: "/ares/flowable/task/return",
    method: "post",
    data: data,
  });
}

// 驳回任务
export function rejectTask(data: any) {
  return request({
    url: "/ares/flowable/task/reject",
    method: "post",
    data: data,
  });
}

// 驳回任务
export function rejectTaskNew(data: any) {
  return request({
    url: "/ares/flowable/task/rejectnew",
    method: "post",
    data: data,
  });
}

// 可退回任务列表
export function returnList(data: any) {
  return request({
    url: "/ares/flowable/task/returnList",
    method: "post",
    data: data,
  });
}

// 下一节点
export function getNextFlowNode(data: any) {
  return request({
    url: "/ares/flowable/task/nextFlowNode",
    method: "post",
    data: data,
  });
}

// 部署流程实例
export function deployStart(deployId: string) {
  return request({
    url: "/ares/flowable/process/startFlow/" + deployId,
    method: "get",
  });
}

// 查询流程定义详细
export function getDeployment(id: string) {
  return request({
    url: "/ares/system/deployment/" + id,
    method: "get",
  });
}

// 新增流程定义
export function addDeployment(data: any) {
  return request({
    url: "/ares/system/deployment",
    method: "post",
    data: data,
  });
}

// 修改流程定义
export function updateDeployment(data: any) {
  return request({
    url: "/ares/system/deployment",
    method: "put",
    data: data,
  });
}

// 删除流程定义
export function delDeployment(id: string) {
  return request({
    url: "/ares/system/deployment/" + id,
    method: "delete",
  });
}

// 导出流程定义
export function exportDeployment(query: any) {
  return request({
    url: "/ares/system/deployment/export",
    method: "get",
    params: query,
  });
}

export function getFormData(id: string) {
  return request({
    url: "/ares/sysFormData/getFormData/" + id,
    method: "get",
  });
}
