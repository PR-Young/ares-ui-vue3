import request from "@/utils/request";

// 查询在线用户列表
export function list(query: any) {
  return request({
    url: "/ares/monitor/online/list",
    method: "get",
    params: query,
  });
}

// 强退用户
export function forceLogout(tokenId: string) {
  return request({
    url: "/ares/monitor/online/" + tokenId,
    method: "delete",
  });
}
