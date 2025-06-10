import request from "@/utils/request";

// 查询流程定义列表
export function listDefinition(query: any) {
  return request({
    url: "/ares/flow/definition/list",
    method: "get",
    params: query,
  });
}

// 激活/挂起流程

export function activeFlow(id: any) {
  return request({
    url: "/ares/flow/definition/active/" + id,
    method: "put",
  });
}

export function unActiveFlow(id: any) {
  return request({
    url: "/ares/flow/definition/unactive/" + id,
    method: "put",
  });
}

export function publishFlow(id: any) {
  return request({
    url: "/ares/flow/definition/publish/" + id,
    method: "put",
  });
}

export function unPublishFlow(id: any) {
  return request({
    url: "/ares/flow/definition/unpublish/" + id,
    method: "put",
  });
}

export function copyFlow(id: any) {
  return request({
    url: "/ares/flow/definition/copy/" + id,
    method: "put",
  });
}

// 读取xml文件
export function readXml(id: string) {
  return request({
    url: "/ares/flow/definition/flowChart/" + id,
    method: "get",
  });
}

// 新增流程定义
export function addDefinition(data: any) {
  return request({
    url: "/ares/flow/definition/save",
    method: "post",
    data: data,
  });
}

// 删除流程定义
export function delDefinition(ids: any) {
  return request({
    url: "/ares/flow/definition/del/" + ids,
    method: "delete",
  });
}
