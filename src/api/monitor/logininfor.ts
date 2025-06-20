import request from "@/utils/request";

// 查询登录日志列表
export function list(query: any) {
  return request({
    url: "/ares/sysLoginInfo/list",
    method: "get",
    params: query,
  });
}

// 删除登录日志
export function delLogininfor(infoId: string) {
  return request({
    url: "/ares/sysLoginInfo/" + infoId,
    method: "delete",
  });
}

// 清空登录日志
export function cleanLogininfor() {
  return request({
    url: "/ares/sysLoginInfo/clean",
    method: "delete",
  });
}

// 导出登录日志
export function exportLogininfor(query: any) {
  return request({
    url: "/ares/sysLoginInfo/export",
    method: "get",
    params: query,
  });
}

// 查询
export function getSysLoginInfo(id: string) {
  return request({
    url: "/ares/sysLoginInfo/" + id,
    method: "get",
  });
}
