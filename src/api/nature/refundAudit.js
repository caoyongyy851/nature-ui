import request from '@/utils/request'

// 查询退款审核列表
export function listRefundAudit(query) {
  return request({
    url: '/nature/refundAudit/list',
    method: 'get',
    params: query
  })
}

// 查询退款审核详细
export function getRefundAudit(id) {
  return request({
    url: '/nature/refundAudit/' + id,
    method: 'get'
  })
}

// 新增退款审核
export function addRefundAudit(data) {
  return request({
    url: '/nature/refundAudit',
    method: 'post',
    data: data
  })
}

// 修改退款审核
export function updateRefundAudit(data) {
  return request({
    url: '/nature/refundAudit',
    method: 'put',
    data: data
  })
}

// 删除退款审核
export function delRefundAudit(id) {
  return request({
    url: '/nature/refundAudit/' + id,
    method: 'delete'
  })
}

// 导出退款审核
export function exportRefundAudit(query) {
  return request({
    url: '/nature/refundAudit/export',
    method: 'get',
    params: query
  })
}
  // 审核退款
export function audit(id, status) {
  return request({
    url: '/nature/refundAudit/audit/' + id + '/' + status,
    method: 'get'
  })
}