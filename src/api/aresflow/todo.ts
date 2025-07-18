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
export function depute(data: any) {
  return request({
    url: "/ares/flow/task/depute",
    method: "post",
    data: data,
  });
}

// 退回任务
export function transferTask(data: any) {
  return request({
    url: "/ares/flow/task/transfer",
    method: "post",
    data: data,
  });
}

// 退回任务
export function rejectTask(data: any) {
  return request({
    url: "/ares/flow/task/reject",
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
