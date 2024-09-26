import request from '@/utils/request'

// 查询帖子轮播图列表
export function listSwiperTopic(query) {
  return request({
    url: '/nature/swiperTopic/list',
    method: 'get',
    params: query
  })
}

// 查询帖子轮播图详细
export function getSwiperTopic(id) {
  return request({
    url: '/nature/swiperTopic/' + id,
    method: 'get'
  })
}

// 新增帖子轮播图
export function addSwiperTopic(data) {
  return request({
    url: '/nature/swiperTopic',
    method: 'post',
    data: data
  })
}

// 修改帖子轮播图
export function updateSwiperTopic(data) {
  return request({
    url: '/nature/swiperTopic',
    method: 'put',
    data: data
  })
}

// 删除帖子轮播图
export function delSwiperTopic(id) {
  return request({
    url: '/nature/swiperTopic/' + id,
    method: 'delete'
  })
}

// 导出帖子轮播图
export function exportSwiperTopic(query) {
  return request({
    url: '/nature/swiperTopic/export',
    method: 'get',
    params: query
  })
}