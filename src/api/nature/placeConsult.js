import request from '@/utils/request'

// 查询玩场咨询列表
export function listPlaceConsult(query) {
  return request({
    url: '/nature/placeConsult/list',
    method: 'get',
    params: query
  })
}

// 查询玩场咨询详细
export function getPlaceConsult(id) {
  return request({
    url: '/nature/placeConsult/' + id,
    method: 'get'
  })
}

// 新增玩场咨询
export function addPlaceConsult(data) {
  return request({
    url: '/nature/placeConsult',
    method: 'post',
    data: data
  })
}

// 修改玩场咨询
export function updatePlaceConsult(data) {
  return request({
    url: '/nature/placeConsult',
    method: 'put',
    data: data
  })
}

// 删除玩场咨询
export function delPlaceConsult(id) {
  return request({
    url: '/nature/placeConsult/' + id,
    method: 'delete'
  })
}

// 导出玩场咨询
export function exportPlaceConsult(query) {
  return request({
    url: '/nature/placeConsult/export',
    method: 'get',
    params: query
  })
}