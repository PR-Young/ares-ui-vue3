import request from "@/utils/request";

// 查询调度日志列表
export function listJobLog(query: any) {
  return request({
    url: "/ares/monitor/jobLog/list",
    method: "get",
    params: query,
  });
}

// 删除调度日志
export function delJobLog(jobLogId: string) {
  return request({
    url: "/ares/monitor/jobLog/" + jobLogId,
    method: "delete",
  });
}

// 清空调度日志
export function cleanJobLog() {
  return request({
    url: "/ares/monitor/jobLog/clean",
    method: "delete",
  });
}

// 导出调度日志
export function exportJobLog(query: any) {
  return request({
    url: "/ares/monitor/jobLog/export",
    method: "get",
    params: query,
  });
}
