import request from '@/utils/request'

// 查询帖子列表
export function listCard(query) {
  return request({
    url: '/nature/card/list',
    method: 'get',
    params: query
  })
}

// 查询帖子详细
export function getCard(id) {
  return request({
    url: '/nature/card/' + id,
    method: 'get'
  })
}

// 新增帖子
export function addCard(data) {
  return request({
    url: '/nature/card',
    method: 'post',
    data: data
  })
}

// 修改帖子
export function updateCard(data) {
  return request({
    url: '/nature/card',
    method: 'put',
    data: data
  })
}

// 删除帖子
export function delCard(id) {
  return request({
    url: '/nature/card/' + id,
    method: 'delete'
  })
}

// 导出帖子
export function exportCard(query) {
  return request({
    url: '/nature/card/export',
    method: 'get',
    params: query
  })
}