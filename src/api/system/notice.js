import request from '@/utils/request'

// 查询公告列表
export function listNotice(query) {
  return request({
    url: '/ares/system/notice/list',
    method: 'get',
    params: query,
  })
}

// 查询公告详细
export function getNotice(noticeId) {
  return request({
    url: '/ares/system/notice/' + noticeId,
    method: 'get',
  })
}

// 新增公告
export function editNotice(data) {
  return request({
    url: '/ares/system/notice/edit',
    method: 'post',
    data: data,
  })
}

// 删除公告
export function delNotice(noticeId) {
  return request({
    url: '/ares/system/notice/' + noticeId,
    method: 'delete',
  })
}
