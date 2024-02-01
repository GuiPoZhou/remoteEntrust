import request from '@/utils/request'

// 查询-- 检测审批配置列表
export function listConfig(query) {
  return request({
    url: '/base/v1/approvalConfig',
    method: 'get',
    params: query
  })
}

// 查询-- 检测审批配置详细
export function getConfig(id) {
  return request({
    url: '/unit/config/' + id,
    method: 'get'
  })
}

// 新增-- 检测审批配置
export function addConfig(data) {
  return request({
    url: '/unit/config',
    method: 'post',
    data: data
  })
}

// 修改-- 检测审批配置
export function updateConfig(data) {
  return request({
    url: '/unit/config',
    method: 'put',
    data: data
  })
}

// 删除-- 检测审批配置
export function delConfig(id) {
  return request({
    url: '/unit/config/' + id,
    method: 'delete'
  })
}

// 导出-- 检测审批配置
export function exportConfig(query) {
  return request({
    url: '/unit/config/export',
    method: 'get',
    params: query
  })
}


// 查询-- 根据审批类型获取步骤列表
export function nodeList(code,name) {
  return request({
    url: `/base/v1/approvalConfig/${code}`,
    method: 'get',
	  params: name
  })
}


// 查询-- 根据审批类型获取步骤列表
export function testList() {
  let aa = [];
  aa.push(4);
  aa.push(5);

  let param = {};
  param.pageSize = 10;
  param.pageNum = 1;
  //param.equipmentClass = "";
  param.equipmentNumber = "";

  return request({
    url: `/resource/v1/equipmentReceive/receiveEquipmentList`,
    method: 'get',
    params: param
  })
}
