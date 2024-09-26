import request from '@/utils/request'

// 查询文档列表
export function listDoc(query) {
  return request({
    url: '/nature/doc/list',
    method: 'get',
    params: query
  })
}

// 查询文档详细
export function getDoc(id) {
  return request({
    url: '/nature/doc/' + id,
    method: 'get'
  })
}

// 新增文档
export function addDoc(data) {
  return request({
    url: '/nature/doc',
    method: 'post',
    data: data
  })
}

// 修改文档
export function updateDoc(data) {
  return request({
    url: '/nature/doc',
    method: 'put',
    data: data
  })
}

// 删除文档
export function delDoc(id) {
  return request({
    url: '/nature/doc/' + id,
    method: 'delete'
  })
}

// 导出文档
export function exportDoc(query) {
  return request({
    url: '/nature/doc/export',
    method: 'get',
    params: query
  })
}