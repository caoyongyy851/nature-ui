import request from '@/utils/request'

// 查询活动评论列表
export function listAComment(query) {
  return request({
    url: '/nature/aComment/list',
    method: 'get',
    params: query
  })
}

// 查询活动评论详细
export function getAComment(id) {
  return request({
    url: '/nature/aComment/' + id,
    method: 'get'
  })
}

// 新增活动评论
export function addAComment(data) {
  return request({
    url: '/nature/aComment',
    method: 'post',
    data: data
  })
}

// 修改活动评论
export function updateAComment(data) {
  return request({
    url: '/nature/aComment',
    method: 'put',
    data: data
  })
}

// 删除活动评论
export function delAComment(id) {
  return request({
    url: '/nature/aComment/' + id,
    method: 'delete'
  })
}

// 导出活动评论
export function exportAComment(query) {
  return request({
    url: '/nature/aComment/export',
    method: 'get',
    params: query
  })
}