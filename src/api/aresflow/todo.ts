import request from "@/utils/request";

// 查询待办任务列表
export function todoList(query: any) {
  return request({
    url: "/ares/flow/task/todoList",
    method: "get",
    params: query,
  });
}

// 完成任务
export function complete(data: any) {
  return request({
    url: "/ares/flow/task/pass",
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

// 可退回任务列表
export function returnList(data: any) {
  return request({
    url: "/ares/flowable/task/returnList",
    method: "post",
    data: data,
  });
}

export function getFormData(id: string) {
  return request({
    url: "/ares/sysFormData/getFormData/" + id,
    method: "get",
  });
}
