import request from '@/utils/request'


// 查询已办任务列表
export function finishedList(query: any) {
  return request({
    url: '/ares/flowable/task/finishedList',
    method: 'get',
    params: query,
  })
}

// 任务流转记录
export function flowRecord(query: any) {
  return request({
    url: '/ares/flowable/task/flowRecord',
    method: 'get',
    params: query,
  })
}

// 撤回任务
export function revokeProcess(data: any) {
  return request({
    url: '/ares/flowable/task/revokeProcess',
    method: 'post',
    data: data,
  })
}

// 部署流程实例
export function deployStart(deployId: string) {
  return request({
    url: '/ares/flowable/process/startFlow/' + deployId,
    method: 'get',
  })
}

// 查询流程定义详细
export function getDeployment(id: string) {
  return request({
    url: '/ares/system/deployment/' + id,
    method: 'get',
  })
}

// 新增流程定义
export function addDeployment(data: any) {
  return request({
    url: '/ares/system/deployment',
    method: 'post',
    data: data,
  })
}

// 修改流程定义
export function updateDeployment(data: any) {
  return request({
    url: '/ares/system/deployment',
    method: 'put',
    data: data,
  })
}

// 删除流程定义
export function delDeployment(id: string) {
  return request({
    url: '/ares/system/deployment/' + id,
    method: 'delete',
  })
}

// 导出流程定义
export function exportDeployment(query: any) {
  return request({
    url: '/ares/system/deployment/export',
    method: 'get',
    params: query,
  })
}
