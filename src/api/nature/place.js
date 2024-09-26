import request from '@/utils/request'

// 查询场地列表
export function listPlace(query) {
  return request({
    url: '/nature/place/list',
    method: 'get',
    params: query
  })
}

// 查询场地详细
export function getPlace(id) {
  return request({
    url: '/nature/place/' + id,
    method: 'get'
  })
}

// 新增场地
export function addPlace(data) {
  return request({
    url: '/nature/place',
    method: 'post',
    data: data
  })
}

// 修改场地
export function updatePlace(data) {
  return request({
    url: '/nature/place',
    method: 'put',
    data: data
  })
}

// 删除场地
export function delPlace(id) {
  return request({
    url: '/nature/place/' + id,
    method: 'delete'
  })
}

// 导出场地
export function exportPlace(query) {
  return request({
    url: '/nature/place/export',
    method: 'get',
    params: query
  })
}

// 查询分类列表
export function getCategoryList() {
  return request({
    url: '/nature/category/optionList',
    method: 'get'
  })

}

// 新增档期
export function saveSche(data) {
  return request({
    url: '/nature/place/saveSche',
    method: 'post',
    data: data
  })
}