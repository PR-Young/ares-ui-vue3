import request from '@/utils/request'

export function getExchangeList() {
  return request({
    url: '/ares/config/getExchanges',
    method: 'get',
  })
}

export function getQueueList() {
  return request({
    url: '/ares/config/getQueues',
    method: 'get',
  })
}

export function getQueueBindings(params) {
  return request({
    url: '/ares/config/getQueueBindings',
    method: 'get',
    params: params,
  })
}

export function addExchange(data) {
  return request({
    url: '/ares/config/addExchange',
    method: 'post',
    data: data,
  })
}

export function deleteExchange(params) {
  return request({
    url: '/ares/config/deleteExchange',
    method: 'delete',
    data: params,
  })
}

export function addQueue(data) {
  return request({
    url: '/ares/config/addQueue',
    method: 'post',
    data: data,
  })
}

export function deleteQueue(params) {
  return request({
    url: '/ares/config/deleteQueue',
    method: 'delete',
    data: params,
  })
}

export function purgeQueue(params) {
  return request({
    url: '/ares/config/purgeQueue',
    method: 'post',
    data: params,
  })
}

export function addBinding(data) {
  return request({
    url: '/ares/config/addBinding',
    method: 'post',
    data: data,
  })
}

export function removeBinding(params) {
  return request({
    url: '/ares/config/removeBinding',
    method: 'post',
    data: params,
  })
}
