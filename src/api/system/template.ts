import request from '@/utils/request'

// 查询模版列表
export function listTemplate(query: any) {
  return request({
    url: '/ares/sysTemplate/list',
    method: 'get',
    params: query,
  })
}

// 查询模版详细
export function getTemplate(templateId: string) {
  return request({
    url: '/ares/sysTemplate/' + templateId,
    method: 'get',
  })
}

// 新增模版
export function addTemplate(data: any) {
  return request({
    url: '/ares/sysTemplate/edit',
    method: 'post',
    data: data,
  })
}

// 修改模版
export function updateTemplate(data: any) {
  return request({
    url: '/ares/sysTemplate/edit',
    method: 'post',
    data: data,
  })
}

// 删除模版
export function delTemplate(configId: string) {
  return request({
    url: '/ares/sysTemplate/' + configId,
    method: 'delete',
  })
}

// 导出模版
export function exportTemplate(query: any) {
  return request({
    url: '/ares/sysTemplate/export',
    method: 'get',
    params: query,
  })
}
