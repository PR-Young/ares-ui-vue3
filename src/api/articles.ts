import request from "@/utils/request";

// 查询列表
export function listArticles(query: any) {
  return request({
    url: "/ares/articles/list",
    method: "get",
    params: query,
  });
}

// 查询
export function getArticles(id: string) {
  return request({
    url: "/ares/articles/" + id,
    method: "get",
  });
}

// 新增
export function addArticles(data: any) {
  return request({
    url: "/ares/articles/edit",
    method: "post",
    data: data,
  });
}

// 修改
export function updateArticles(data: any) {
  return request({
    url: "/ares/articles/edit",
    method: "post",
    data: data,
  });
}

// 删除
export function delArticles(postId: string) {
  return request({
    url: "/ares/articles/" + postId,
    method: "delete",
  });
}

// 导出
export function exportArticles(query: any) {
  return request({
    url: "/ares/articles/export",
    method: "get",
    params: query,
  });
}
