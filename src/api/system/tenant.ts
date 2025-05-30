import request from "@/utils/request";
import { praseStrEmpty } from "@/utils/ares";

// 查询列表
export function listSysTenants(query: any) {
  return request({
    url: "/ares/sysTenants/list",
    method: "get",
    params: query,
  });
}

// 查询
export function getSysTenants(id: any) {
  return request({
    url: "/ares/sysTenants/" + praseStrEmpty(id),
    method: "get",
  });
}

// 新增
export function addSysTenants(data: any) {
  return request({
    url: "/ares/sysTenants/edit",
    method: "post",
    data: data,
  });
}

// 修改
export function updateSysTenants(data: any) {
  return request({
    url: "/ares/sysTenants/edit",
    method: "post",
    data: data,
  });
}

// 删除
export function delSysTenants(postId: string) {
  return request({
    url: "/ares/sysTenants/" + postId,
    method: "delete",
  });
}

// 导出
export function exportSysTenants(query: any) {
  return request({
    url: "/ares/sysTenants/export",
    method: "get",
    params: query,
  });
}

// 状态修改
export function changeStatus(id: any, tenantStatus: any) {
  const data = {
    id,
    tenantStatus,
  };
  return request({
    url: "/ares/sysTenants/changeStatus",
    method: "put",
    data: data,
  });
}
