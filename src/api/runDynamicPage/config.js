import request from '@/utils/request'

// 获取页面配置
export function  getPageConfig(id) {
  return request({
    url: '/template/execution/getDynamicPageConfig/'+id,
    method: 'get'
  })
}
export function  getDynamicData(url) {
  return request({
    url: url,
    method: 'get'
  })
}
export function getExecutionList(id, query) {
  return request({
    url: '/template/execution/run/dynamicList/'+id,
    method: 'post',
    data: query
  })
}
export function getExecutionEditDetail(executionTemplateId, executionId) {
  return request({
    url: '/template/execution/run/getDynamicForm/' + executionTemplateId + '?executionId=' + executionId,
    method: 'post',
  })
}
export function saveDynamicForm(executionTemplateId, executionId, dynamicFormData) {
  return request({
    url: '/template/execution/run/saveDynamicForm/' + executionTemplateId + '?executionId=' + executionId,
    method: 'post',
    data: dynamicFormData
  })
}
export function removeRow(executionTemplateId, executionId) {
  return request({
    url: '/template/execution/run/deleteDynamicFormRow/' + executionTemplateId + '?executionId=' + executionId,
    method: 'post',
  })
}
export function submitProcess(processData) {
  return request({
    url: '/template/execution/run/submitApply',
    method: 'post',
    data: processData
  })
}

