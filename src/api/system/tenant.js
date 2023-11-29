import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ares";

// 查询列表
export function listSysTenants(query) {
  return request({
    url: '/ares/sysTenants/list',
    method: 'get',
    params: query
  })
}

// 查询
export function getSysTenants(id) {
  return request({
    url: '/ares/sysTenants/' + praseStrEmpty(id),
    method: 'get'
  })
}

// 新增
export function addSysTenants(data) {
  return request({
    url: '/ares/sysTenants/edit',
    method: 'post',
    data: data
  })
}

// 修改
export function updateSysTenants(data) {
  return request({
    url: '/ares/sysTenants/edit',
    method: 'post',
    data: data
  })
}

// 删除
export function delSysTenants(postId) {
  return request({
    url: '/ares/sysTenants/' + postId,
    method: 'delete'
  })
}

// 导出
export function exportSysTenants(query) {
  return request({
    url: '/ares/sysTenants/export',
    method: 'get',
    params: query
  })
}

// 状态修改
export function changeStatus(id, tenantStatus) {
  const data = {
    id,
    tenantStatus
  }
  return request({
    url: '/ares/sysTenants/changeStatus',
    method: 'put',
    data: data
  })
}
