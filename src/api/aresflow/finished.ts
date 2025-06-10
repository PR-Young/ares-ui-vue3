import request from "@/utils/request";

// 查询已办任务列表
export function finishedList(query: any) {
  return request({
    url: "/ares/flow/task/finishedList",
    method: "get",
    params: query,
  });
}

// 任务流转记录
export function flowRecord(query: any) {
  return request({
    url: "/ares/flow/task/flowRecord",
    method: "get",
    params: query,
  });
}

// 撤回任务
export function revokeProcess(data: any) {
  return request({
    url: "/ares/flowable/task/revokeProcess",
    method: "post",
    data: data,
  });
}
