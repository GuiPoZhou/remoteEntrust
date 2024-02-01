import request from '@/utils/request'

// 查询-- 检测审批配置列表
export function listDetail(query) {
  return request({
    url: '/unit/detail/list',
    method: 'get',
    params: query
  })
}

// 查询-- 检测审批配置详细
export function getDetail(id) {
  return request({
    url: '/unit/detail/' + id,
    method: 'get'
  })
}

// 新增-- 检测审批配置
export function addDetail(data) {
  return request({
    url: '/base/v1/approvalConfigDetail',
    method: 'post',
    data: data
  })
}

// 修改-- 检测审批配置
export function updateDetail(data) {
  return request({
    url: '/unit/detail',
    method: 'put',
    data: data
  })
}

// 删除-- 检测审批配置
export function delDetail(id) {
  return request({
    url: '/unit/detail/' + id,
    method: 'delete'
  })
}

// 导出-- 检测审批配置
export function exportDetail(query) {
  return request({
    url: '/unit/detail/export',
    method: 'get',
    params: query
  })
}
