import request from '@/utils/request'

// 查询订单列表
export function listActOrder(query) {
  return request({
    url: '/nature/actOrder/list',
    method: 'get',
    params: query
  })
}

// 查询订单详细
export function getActOrder(id) {
  return request({
    url: '/nature/actOrder/' + id,
    method: 'get'
  })
}

// 新增订单
export function addActOrder(data) {
  return request({
    url: '/nature/actOrder',
    method: 'post',
    data: data
  })
}

// 修改订单
export function updateActOrder(data) {
  return request({
    url: '/nature/actOrder',
    method: 'put',
    data: data
  })
}

// 删除订单
export function delActOrder(id) {
  return request({
    url: '/nature/actOrder/' + id,
    method: 'delete'
  })
}

// 导出订单
export function exportActOrder(query) {
  return request({
    url: '/nature/actOrder/export',
    method: 'get',
    params: query
  })
}