import request from "@/utils/request";

// 查询菜单列表
export function listMenu(query: any) {
  return request({
    url: "/ares/system/menu/list",
    method: "get",
    params: query,
  });
}

// 查询菜单详细
export function getMenu(menuId: string) {
  return request({
    url: "/ares/system/menu/" + menuId,
    method: "get",
  });
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: "/ares/system/menu/treeselect",
    method: "get",
  });
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId: string) {
  return request({
    url: "/ares/system/menu/roleMenuTreeselect/" + roleId,
    method: "get",
  });
}

// 新增菜单
export function addMenu(data: any) {
  return request({
    url: "/ares/system/menu/edit",
    method: "post",
    data: data,
  });
}

// 修改菜单
export function updateMenu(data: any) {
  return request({
    url: "/ares/system/menu/edit",
    method: "post",
    data: data,
  });
}

// 删除菜单
export function delMenu(menuId: string) {
  return request({
    url: "/ares/system/menu/" + menuId,
    method: "delete",
  });
}
