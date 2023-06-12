import request from '@/utils/request'

export function getPanelGroups() {
  return request({
    url: '/ares/index/panelGroup',
    method: 'get',
  })
}

export function getLineChartData() {
  return request({
    url: '/ares/index/lineChartData',
    method: 'get',
  })
}

export function getLineChart() {
  return request({
    url: '/ares/index/lineChart',
    method: 'get',
  })
}

export function queryByKey(value) {
  return request({
    url: '/ares/index/query',
    method: 'post',
    data: value,
  })
}
