import request from '@/utils/request'

// 获取表信息
export function getTableInfo() {
  return request({
    url: '/dbConfig/getTableInfo',
    method: 'get'
  })
}
// 获取表信息
export function getTableInfoWithBusinessConfigId(businessConfigId) {
  return request({
    url: '/dbConfig/getTableInfoWithBusinessConfigId/' + businessConfigId,
    method: 'get'
  })
}
// 获取表属性
export function getColumnInfo(tableName) {
  return request({
    url: '/dbConfig/getColumnInfo/' + tableName,
    method: 'get'
  })
}
//getColumnInfoWithBusinessId
// 获取表属性
export function getColumnInfoWithBusinessId(businessConfigId) {
  return request({
    url: '/dbConfig/getColumnInfoWithBusinessId/' + businessConfigId,
    method: 'get'
  })
}
// 获取关联表已配置的业务类型
export function getBusinessConfig(tableName) {
  return request({
    url: '/dbConfig/getBusinessConfig/' + tableName,
    method: 'get'
  })
}

// 获取扩展属性
export function getExDataConfigOptions(businessConfigId) {
  return request({
    url: '/dbConfig/getExDataConfigOptions/' + businessConfigId,
    method: 'get'
  })
}

// 获取扩展属性
export function saveTableListConfig(data) {
  return request({
    url: '/dbConfig/saveTableListConfig',
    method: 'post',
    data: data
  })
}

// 获取扩展属性
export function getTableListConfig(businessConfigId) {
  return request({
    url: '/dbConfig/getTableListConfig/' + businessConfigId,
    method: 'get'
  })
}
// 查询详细
export function getBusinessConfigWithId(id) {
  return request({
    url: '/base/v1/businessConfigs/' + id,
    method: 'get'
  })
}


// 获取扩展属性
export function getDynamicListData(businessConfigId, data) {
  return request({
    url: '/v1/entrustRemoteAgreement/isAdminEntrust/' + businessConfigId,
    method: 'post',
    data: data
  })
}

// 获取全部数据源
export function getDataSourceAllList() {
  return request({
    url: '/reportDataSourceMain/getAllList',
    method: 'post',
    data: {name: null}
    })
}

// 获取一级数据源树形结构
export function getDataSourceTreeData(id) {
  return request({
    url: '/reportDataSourceConfig/getReportDataSourceTree/' + id,
    method: 'get',
  })
}

// 获取数据源具体配置
export function getDataSourceConfig(id) {
  return request({
    url: '/reportDataSourceConfig/getReportDataSource/' + id,
    method: 'get',
  })
}

// 获取数据源内容
export function getBusinessData(id) {
  return request({
    url: '/reportDataSourceConfig/getBusinessData/?dataSourceId=' + id,
    method: 'get',
  })
}
