import request from '@/utils/request'

// 查询场地分类列表
export function listCategory(query) {
  return request({
    url: '/nature/category/list',
    method: 'get',
    params: query
  })
}

// 查询场地分类详细
export function getCategory(id) {
  return request({
    url: '/nature/category/' + id,
    method: 'get'
  })
}

// 新增场地分类
export function addCategory(data) {
  return request({
    url: '/nature/category',
    method: 'post',
    data: data
  })
}

// 修改场地分类
export function updateCategory(data) {
  return request({
    url: '/nature/category',
    method: 'put',
    data: data
  })
}

// 删除场地分类
export function delCategory(id) {
  return request({
    url: '/nature/category/' + id,
    method: 'delete'
  })
}

// 导出场地分类
export function exportCategory(query) {
  return request({
    url: '/nature/category/export',
    method: 'get',
    params: query
  })
}