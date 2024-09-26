import request from '@/utils/request'

// 查询档期列表
export function listSche(query) {
  return request({
    url: '/nature/sche/list',
    method: 'get',
    params: query
  })
}

// 查询档期详细
export function getSche(id) {
  return request({
    url: '/nature/sche/' + id,
    method: 'get'
  })
}

// 新增档期
export function addSche(data) {
  return request({
    url: '/nature/sche',
    method: 'post',
    data: data
  })
}

// 修改档期
export function updateSche(data) {
  return request({
    url: '/nature/sche',
    method: 'put',
    data: data
  })
}

// 删除档期
export function delSche(id) {
  return request({
    url: '/nature/sche/' + id,
    method: 'delete'
  })
}

// 导出档期
export function exportSche(query) {
  return request({
    url: '/nature/sche/export',
    method: 'get',
    params: query
  })
}