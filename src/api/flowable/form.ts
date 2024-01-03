import request from '@/utils/request'

// 查询流程表单列表
export function listForm(query: any) {
  return request({
    url: '/ares/sysForm/list',
    method: 'get',
    params: query,
  })
}

// 查询流程表单详细
export function getForm(formId: string) {
  return request({
    url: '/ares/sysForm/' + formId,
    method: 'get',
  })
}

// 新增流程表单
export function addForm(data: any) {
  return request({
    url: '/ares/sysForm/edit',
    method: 'post',
    data: data,
  })
}

// 修改流程表单
export function updateForm(data: any) {
  return request({
    url: '/ares/sysForm/edit',
    method: 'post',
    data: data,
  })
}
// 挂载表单
export function addDeployForm(data: any) {
  return request({
    url: '/ares/sysForm/addDeployForm',
    method: 'post',
    data: data,
  })
}

// 删除流程表单
export function delForm(formId: string) {
  return request({
    url: '/ares/sysForm/' + formId,
    method: 'delete',
  })
}

// 导出流程表单
export function exportForm(query: any) {
  return request({
    url: '/ares/sysForm/export',
    method: 'get',
    params: query,
  })
}
