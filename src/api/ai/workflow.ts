import request from "@/utils/request";
import { da } from "element-plus/es/locale";

// 查询列表
export function listSysWorkflows(query: any) {
  return request({
    url: "/ares/sysWorkflows/list",
    method: "get",
    params: query,
  });
}

// 查询
export function getSysWorkflows(id: string) {
  return request({
    url: "/ares/sysWorkflows/" + id,
    method: "get",
  });
}

// 新增
export function addSysWorkflows(data: any) {
  return request({
    url: "/ares/sysWorkflows/edit",
    method: "post",
    data: data,
  });
}

// 修改
export function updateSysWorkflows(data: any) {
  return request({
    url: "/ares/sysWorkflows/edit",
    method: "post",
    data: data,
  });
}

// 删除
export function delSysWorkflows(ids: string) {
  return request({
    url: "/ares/sysWorkflows/" + ids,
    method: "delete",
  });
}

// 导出
export function exportSysWorkflows(query: any) {
  return request({
    url: "/ares/sysWorkflows/export",
    method: "get",
    params: query,
  });
}

export function execute(data: any) {
  return request({
    url: "/ares/sysWorkflows//workflow/exe",
    method: "post",
    data: data,
  });
}
