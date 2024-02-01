import request from '@/utils/request'
//公司信息列表查询
export function companyManager(data) {
  return request({
    url: '/base/v1/companyManager/list',
    method: 'post',
    data: data
  })
}
// 状态
export function updataStatus(data) {
  return request({
    url: '/base/v1/companyManager/updateStatus',
    method: 'post',
    data: data
  })
}

// 公司信息新增
export function companyManagerAdd(data) {
  return request({
    url: '/base/v1/companyManager/add',
    method: 'post',
    data: data
  })
}
//详情
export function queryCompanyInfo(data) {
  return request({
    url: '/base/v1/companyManager/queryCompanyInfo',
    method: 'post',
    data: data
  })
}
// 公司信息删除
export function deleteCompanyInfo(companyIds) {
  return request({
    url: '/base/v1/companyManager/delete/'+ companyIds,
    method: 'delete',
  })
}

//修改
export function companyManagerUpdate(data) {
  return request({
    url: '/base/v1/companyManager/update',
    method: 'post',
    data: data
  })
}
//重置密码
export function resetPassword(data) {
  return request({
    url: '/base/v1/companyManager/resetPassword',
    method: 'post',
    data: data
  })
}

