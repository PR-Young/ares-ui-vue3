import request from '@/utils/request'

// 查询生成表数据
export function listTable(query: any) {
  return request({
    url: '/ares/tool/gen/list',
    method: 'get',
    params: query,
  })
}

// 查询db数据库列表
export function listDbTable(query: any) {
  return request({
    url: '/ares/tool/gen/db/list',
    method: 'get',
    params: query,
  })
}

// 查询表详细信息
export function getGenTable(tableId: string) {
  return request({
    url: '/ares/tool/gen/' + tableId,
    method: 'get',
  })
}

// 修改代码生成信息
export function updateGenTable(data: any) {
  return request({
    url: '/ares/tool/gen',
    method: 'put',
    data: data,
  })
}

// 导入表
export function importTable(data: any) {
  return request({
    url: '/ares/tool/gen/importTable',
    method: 'post',
    params: data,
  })
}

// 预览生成代码
export function previewTable(flag: string, tableName: string) {
  return request({
    url: '/ares/tool/gen/preview/' + flag + '/' + tableName,
    method: 'get',
  })
}

// 删除表数据
export function delTable(tableId: string) {
  return request({
    url: '/ares/tool/gen/' + tableId,
    method: 'delete',
  })
}
