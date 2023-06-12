import request from '@/utils/request'
// 查询公告列表
export function listLog(query) {
  return request({
    url: '/ares/system/log/list',
    method: 'get',
    params: query,
  })
}

export function delLog(logId) {
  return request({
    url: '/ares/system/log/' + logId,
    method: 'delete',
  })
}
