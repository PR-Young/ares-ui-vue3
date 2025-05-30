import request from "@/utils/request";

// 查询字典类型列表
export function listType(query: any) {
  return request({
    url: "/ares/system/dict/type/list",
    method: "get",
    params: query,
  });
}

// 查询字典类型详细
export function getType(dictId: string) {
  return request({
    url: "/ares/system/dict/type/" + dictId,
    method: "get",
  });
}

export function editType(data: any) {
  return request({
    url: "/ares/system/dict/type/edit",
    method: "post",
    data: data,
  });
}

// 删除字典类型
export function delType(dictId: string) {
  return request({
    url: "/ares/system/dict/type/" + dictId,
    method: "delete",
  });
}

// 导出字典类型
export function exportType(query: any) {
  return request({
    url: "/system/dict/type/export",
    method: "get",
    params: query,
  });
}

// 获取字典选择框列表
export function optionselect() {
  return request({
    url: "/system/dict/type/optionselect",
    method: "get",
  });
}
