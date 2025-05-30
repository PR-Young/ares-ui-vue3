import request from "@/utils/request";
// 查询公告列表
export function listLog(query: any) {
  return request({
    url: "/ares/system/log/list",
    method: "get",
    params: query,
  });
}

export function delLog(logId: string) {
  return request({
    url: "/ares/system/log/" + logId,
    method: "delete",
  });
}
