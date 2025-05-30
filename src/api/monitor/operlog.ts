import request from "@/utils/request";

// 查询操作日志列表
export function list(query: any) {
  return request({
    url: "/ares/monitor/operlog/list",
    method: "get",
    params: query,
  });
}

// 删除操作日志
export function delOperlog(operId: string) {
  return request({
    url: "/ares/monitor/operlog/" + operId,
    method: "delete",
  });
}

// 清空操作日志
export function cleanOperlog() {
  return request({
    url: "/ares/monitor/operlog/clean",
    method: "delete",
  });
}

// 导出操作日志
export function exportOperlog(query: any) {
  return request({
    url: "/ares/monitor/operlog/export",
    method: "get",
    params: query,
  });
}
