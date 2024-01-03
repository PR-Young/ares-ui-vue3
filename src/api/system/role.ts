import request from '@/utils/request'

// 查询角色列表
export function listRole(query: any) {
  return request({
    url: '/ares/system/role/list',
    method: 'get',
    params: query,
  })
}

// 查询角色详细
export function getRole(roleId: string) {
  return request({
    url: '/ares/system/role/' + roleId,
    method: 'get',
  })
}

// 新增角色
export function addRole(data: any) {
  return request({
    url: '/ares/system/role/edit',
    method: 'post',
    data: data,
  })
}

// 修改角色
export function updateRole(data: any) {
  return request({
    url: '/ares/system/role/edit',
    method: 'post',
    data: data,
  })
}

// 角色数据权限
export function dataScope(data: any) {
  return request({
    url: '/ares/system/role/dataScope',
    method: 'put',
    data: data,
  })
}

// 角色状态修改
export function changeRoleStatus(roleId: any, status: any) {
  const data = {
    roleId,
    status,
  }
  return request({
    url: '/ares/system/role/changeStatus',
    method: 'put',
    data: data,
  })
}

// 删除角色
export function delRole(roleId: string) {
  return request({
    url: '/ares/system/role/' + roleId,
    method: 'delete',
  })
}

// 导出角色
export function exportRole(query: any) {
  return request({
    url: '/ares/system/role/export',
    method: 'get',
    params: query,
  })
}

export function roleUserselect(roleId: string) {
  return request({
    url: '/ares/system/role/roleUserselect/' + roleId,
    method: 'get',
  })
}
