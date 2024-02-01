import request from '@/utils/request'

//首页列表1
export function tasksList(query) {
  return request({
    url: '/base/v1/register/tasks/list',
    method: 'get',
    params:query
  })
}
// 不符合项列表
export function returnList(data) {
  return request({
    url: '/base/v1/register/tasks/description',
    method: 'post',
    data:data
  })
}

//委托状态 加急状态 委托书状态
export function selectDict() {
  return request({
    url: 'base/v1/register/tasks/selectDict',
    method: 'get',
  })
}

//公司用户信息查询列表
export function companyUserManager(data) {
  return request({
    url: '/v1/entrustCustomerUsers/userList/' + data.customerId,
    method: 'get',
    params: data
  })
}

//公司信息查询（单条）
export function queryCompanyInfo(id) {
  return request({
    url: '/v1/entrustRemoteOuterInvoicing/selectCustomer/' + id,
    method: 'get',
  })
}


//首页委托数据
export function queryIndexData() {
  return request({
    url: '/base/v1/register/tasks/indexData',
    method: 'get',
  })
}
//复制委托
export function cloneTask(id) {
  return request({
    url: `/v1/entrustRemoteAgreement/${id}/copy`,
    method: 'post',
  })
}
//撤回委托
export function recallTask(query) {
  return request({
    url: '/base/v1/register/tasks/recallTask',
    method: 'get',
    params:query
  })
}
// 新增用户
export function addUser(data) {
  return request({
    url: '/base/v1/companyUserManager/add',
    method: 'post',
    data: data
  })
}

// 删除用户
export function deleteUser(data) {
  return request({
    url: '/base/v1/companyUserManager/delete/' + data,
    method: 'delete',
  })
}

// 状态
export function updataStatus(data) {
  return request({
    url: '/base/v1/companyUserManager/updateStatus',
    method: 'post',
    data: data
  })
}

// 获取用户信息
export function queryUserDetail(userId) {
  return request({
    url: '/v1/entrustCustomerUsers/queryUserInfo/' + userId,
    method: 'get',
  })
}

// 重置密码
export function resetPassword(data) {
  return request({
    url: '/base/v1/companyUserManager/resetPassword',
    method: 'post',
    data: data
  })
}


//保存公司信息
export function saveCompany(data) {
  return request({
    url: '/v1/entrustRemoteOuterInvoicing/updateCustomer',
    method: 'post',
    data: data
  })
}


//保存公司信息
export function saveUser(data) {
  return request({
    url: 'base/v1/companyUserManager/update',
    method: 'post',
    data: data
  })
}

//下载报告的列表页


