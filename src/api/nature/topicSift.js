import request from '@/utils/request'

// 查询精选话题列表
export function listTopicSift(query) {
  return request({
    url: '/nature/topicSift/list',
    method: 'get',
    params: query
  })
}

// 查询精选话题详细
export function getTopicSift(id) {
  return request({
    url: '/nature/topicSift/' + id,
    method: 'get'
  })
}

// 新增精选话题
export function addTopicSift(data) {
  return request({
    url: '/nature/topicSift',
    method: 'post',
    data: data
  })
}

// 修改精选话题
export function updateTopicSift(data) {
  return request({
    url: '/nature/topicSift',
    method: 'put',
    data: data
  })
}

// 删除精选话题
export function delTopicSift(id) {
  return request({
    url: '/nature/topicSift/' + id,
    method: 'delete'
  })
}

// 导出精选话题
export function exportTopicSift(query) {
  return request({
    url: '/nature/topicSift/export',
    method: 'get',
    params: query
  })
}