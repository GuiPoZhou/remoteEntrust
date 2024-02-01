// 客商

import request from '@/utils/request'


// 查询客商信息列表
export function getCustomerList(query) {
  return request({
    url: '/customerinfo/list',
    method: 'get',
    params: query
  })
}

// 根据统一信用代码查询客商信息
export function getCustomerInfoByUscc(uscc) {
  return request({
    url: `/customerinfo/uscc/${uscc}`,
    method: 'get',
  })
}


// 根据联系人id查询客商信息
export function getCustomerInfoByContactId(id) {
  return request({
    url: `/customerinfo/${id}`,
    method: 'get',
  })
}

// 删除客商
export function deleteCustomerById(id) {
  return request({
    url: `/customerinfo/${id}`,
    method: 'delete'
  })
}

// 提交客商信息
export function saveCustomerInfo(data, type) {
  console.log('data', data)
  console.log('type', type)
  let methodLabel = 'post'
  type == 'add' ? methodLabel = 'post' : methodLabel = 'put'
  return request({
    url: `/customerinfo`,
    method: methodLabel,
    data
  })
}



// 获取责任人列表
export function getResponsible(query) {
  return request({
    url: '/customerinfo/getResponsible',
    method: 'get',
    params: query
  })
}

/*******************销售商机***********************/
// 意向商机列表
export function getIntentionList(query) {
  return request({
    url: '/saleChances',
    method: 'get',
    params: query
  })
}
// 新增商机
export function addIntention(addParam) {
  return request({
    url: '/saleChances',
    method: 'post',
    data: addParam
  })
}
// 申请方案
export function applyCase(id) {
  return request({
    url: `/saleChances/applyScheme/${id}`,
    method: 'get'
  })
}

// 根据客户名称查询客商信息
export function getCustomerInfo(customerName) {
  return request({
    url: `/customerinfo/customername/${customerName}`,
    method: 'get',
  })
}
// 根据客户ID和联系人名查询责任人是当前用户的联系人
export function getPersoninfo(query) {
  return request({
    url: '/customerinfo/getContactByCusIdAndCatName',
    method: 'get',
    params: query
  })
}
// 商机详情
export function getIntentiondetail(id) {
  return request({
    url: `/saleChances/${id}`,
    method: 'get',
  })
}
// 修改商机
export function editIntention(addParam, id) {
  return request({
    url: `/saleChances/` + id,
    method: 'put',
    data: addParam
  })
}
// 删除商机
export function deleteIntention(id) {
  return request({
    url: `/saleChances/${id}`,
    method: 'delete'
  })
}


// 商情记录
export function saleChanceMaintain(query) {
  return request({
    url: '/saleChanceMaintain',
    method: 'get',
    params: query
  })
}

// 联系记录增加
export function addSaleChanceMaintain(data) {
  return request({
    url: '/saleChanceMaintain',
    method: 'post',
    data
  })
}

// 删除联系记录
export function deleteSaleChanceMaintain(id) {
  return request({
    url: `/saleChanceMaintain/${id}`,
    method: 'delete'
  })
}


// 申请方案
export function applyPlan(query) {
  return request({
    url: `/saleChances/applyScheme/${query.id}`,
    method: 'get',
    params: query
  })
}
