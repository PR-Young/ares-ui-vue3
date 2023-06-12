import request from '@/utils/request'

// 查询定时任务调度列表
export function listJob(query) {
  return request({
    url: '/ares/monitor/job/list',
    method: 'get',
    params: query,
  })
}

// 查询定时任务调度详细
export function getJob(jobId) {
  return request({
    url: '/ares/monitor/job/' + jobId,
    method: 'get',
  })
}

// 新增定时任务调度
export function addJob(data) {
  return request({
    url: '/ares/monitor/job/edit',
    method: 'post',
    data: data,
  })
}

// 修改定时任务调度
export function updateJob(data) {
  return request({
    url: '/ares/monitor/job/edit',
    method: 'post',
    data: data,
  })
}

// 删除定时任务调度
export function delJob(jobId) {
  return request({
    url: '/ares/monitor/job/' + jobId,
    method: 'delete',
  })
}

// 导出定时任务调度
export function exportJob(query) {
  return request({
    url: '/ares/monitor/job/export',
    method: 'get',
    params: query,
  })
}

// 任务状态修改
export function changeJobStatus(id, status) {
  const data = {
    id,
    status,
  }
  return request({
    url: '/ares/monitor/job/changeStatus',
    method: 'put',
    data: data,
  })
}

// 定时任务立即执行一次
export function runJob(id, jobGroup) {
  const data = {
    id,
    jobGroup,
  }
  return request({
    url: '/ares/monitor/job/run',
    method: 'put',
    data: data,
  })
}
