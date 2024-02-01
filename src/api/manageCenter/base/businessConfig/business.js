import request from '@/utils/request'

// 查询列表
export function listData(query) {
  return request({
    url: '/base/v1/businessConfigs',
    method: 'get',
    params: query
  })
}

// 查询详细
export function getData(id) {
  return request({
    url: '/base/v1/businessConfigs/' + id,
    method: 'get'
  })
}

// 新增数据
export function addData(data) {
  return request({
    url: '/base/v1/businessConfigs',
    method: 'post',
    data: data
  })
}

// 修改数据
export function updateData(id, data) {
  return request({
    url: '/base/v1/businessConfigs/' + id,
    method: 'put',
    data: data
  })
}

// 删除
export function delData(id) {
  return request({
    url: '/base/v1/businessConfigs/' + id,
    method: 'delete'
  })
}

// 状态修改
export function updateDataStatus(id, status) {
  const data = {
    status
  }
  return request({
    url: '/base/v1/businessConfigs/' + id + '/updataStatus?status=' + status,
    method: 'put',
    data: data
  })
}

// 编码方式下拉列表数据
export function encodingOptionsData(businessCategory) {
  return request({
    url: '/base/v1/encodingRule/listAll?businessCategory=' + businessCategory,
    method: 'get'
  })
}

// 表单样式下拉列表数据
export function executionTemplateOptionsData(businessCategory) {
  return request({
    url: '/template/execution/listAll?businessCategory=' + businessCategory,
    method: 'get'
  })
}
// 编制流程下拉列表数据
export function processOptionsData() {
  return request({
    url: '/activiti/actReModel/listAll',
    method: 'get'
  })
}

// 打印模板下拉列表数据
export function templateOptionsData(businessCategory, prepareWay) {
  return request({
    url: '/base/template/listAll?businessCategory=' + businessCategory + '&prepareWay=' + prepareWay,
    method: 'get'
  })
}
