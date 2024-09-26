import request from '@/utils/request'

// 查询公司/机构列表
export function listCompany(query) {
  return request({
    url: '/nature/company/list',
    method: 'get',
    params: query
  })
}

// 查询公司/机构详细
export function getCompany(id) {
  return request({
    url: '/nature/company/' + id,
    method: 'get'
  })
}

// 新增公司/机构
export function addCompany(data) {
  return request({
    url: '/nature/company',
    method: 'post',
    data: data
  })
}

// 修改公司/机构
export function updateCompany(data) {
  return request({
    url: '/nature/company',
    method: 'put',
    data: data
  })
}

// 删除公司/机构
export function delCompany(id) {
  return request({
    url: '/nature/company/' + id,
    method: 'delete'
  })
}

// 导出公司/机构
export function exportCompany(query) {
  return request({
    url: '/nature/company/export',
    method: 'get',
    params: query
  })
}

  // 审核退款
  export function audit(id, status) {
    return request({
      url: '/nature/company/audit/' + id + '/' + status,
      method: 'get'
    })
  }