import request from '@/utils/request'

// 查询话题封面列表
export function listTopicCover(query) {
  return request({
    url: '/nature/topicCover/list',
    method: 'get',
    params: query
  })
}

// 查询话题封面详细
export function getTopicCover(id) {
  return request({
    url: '/nature/topicCover/' + id,
    method: 'get'
  })
}

// 新增话题封面
export function addTopicCover(data) {
  return request({
    url: '/nature/topicCover',
    method: 'post',
    data: data
  })
}

// 修改话题封面
export function updateTopicCover(data) {
  return request({
    url: '/nature/topicCover',
    method: 'put',
    data: data
  })
}

// 删除话题封面
export function delTopicCover(id) {
  return request({
    url: '/nature/topicCover/' + id,
    method: 'delete'
  })
}

// 导出话题封面
export function exportTopicCover(query) {
  return request({
    url: '/nature/topicCover/export',
    method: 'get',
    params: query
  })
}