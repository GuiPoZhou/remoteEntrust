import request from '@/utils/request'

// 新增数据
export function addData(data) {
  return request({
    url: '/base/template',
    method: 'post',
    data: data
  })
}

// 修改数据
export function updateData(id, data) {
  return request({
    url: '/base/template/' + id,
    method: 'put',
    data: data
  })
}
// 模板管理-模板绑定试验参数-选择未绑定模板的试验参数弹框
export function getTemplateList(query) {
    return request({
        url: '/standard/v1/itemMethods/unboundTemplatelist',
        method: 'get',
        params:query
    })
}
// 根据项目查询参数映射配置列表
export function getItemMethodIdList(query) {
    return request({
        url: '/paramCollect/v1/paramMappingConfig/listByItemMethodIdList',
        method: 'get',
        params:query
    })
}
