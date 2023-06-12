import request from '@/utils/request'
import { praseStrEmpty } from '@/utils/ares'

// 查询用户列表
export function list(query) {
  return request({
    url: '/ares/model/list',
    method: 'get',
    params: query,
  })
}

// 查询用户详细
export function getWorkflow(modelId) {
  return request({
    url: '/ares/model/' + praseStrEmpty(modelId),
    method: 'get',
  })
}

// 新增用户
export function addWorkflow(data) {
  return request({
    url: '/ares/model/edit',
    method: 'post',
    data: data,
  })
}

// 修改用户
export function updateWorkflow(data) {
  return request({
    url: '/ares/model/edit',
    method: 'post',
    data: data,
  })
}

// 删除用户
export function delWorkflow(modelId) {
  return request({
    url: '/ares/model/' + modelId,
    method: 'delete',
  })
}

export function deployWorkflow(modelId) {
  return request({
    url: '/ares/model/' + modelId + '/deployment',
    method: 'get',
  })
}
