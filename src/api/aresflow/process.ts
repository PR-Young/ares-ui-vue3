import request from "@/utils/request";

// 完成任务
export function startFlow(data: any) {
  return request({
    url: "/ares/flow/instance/start",
    method: "post",
    data: data,
  });
}

// 我的发起的流程
export function myProcessList(query: any) {
  return request({
    url: "/ares/flow/task/myProcess",
    method: "get",
    params: query,
  });
}


// 取消申请
export function stopProcess(data: any) {
  return request({
    url: "/ares/flow/task/termination/" + data.taskId,
    method: "post",
    data: data,
  });
}


// 查询流程定义列表
export function activeFlowList() {
  return request({
    url: "/ares/flow/definition/activeFlowList",
    method: "get",
  });
}

// 查询流程图
export function getFlowChart(id: string) {
  return request({
    url: "/ares/flow/task/flowChart/" + id,
    method: "get",
  });
}
