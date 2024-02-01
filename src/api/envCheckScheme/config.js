import request from '@/utils/request'

// 获取页面配置
export function  getBusinessConfig(businessCategoy) {
  return request({
    url: '/template/execution/run/getBusinessConfig/' + businessCategoy,
    method: 'get'
  })
}

//获取检测类别
export function getCategoryList(query) {
  return request({
    url: '/standard/v1/detectCategorys/getCategoryList',
    method: 'get',
    params: query
  })
}
//检测项目查询
export function getItemList(query, detectTypeId) {
  query.detectCategory = detectTypeId;
  return request({
    url: '/standard/v1/itemMethods/getItemList',
    method: 'get',
    params: query
  })
}

//查询分组项目列表
export function getGroupList(query, detectTypeId) {
  query.detectCategory = detectTypeId;
  return request({
    url: '/v1/entrustRemoteAgreement/getGroupList',
    method: 'get',
    params: query
  })
}
//按照分组查询项目
export function getGroupItemList({groupId,query}, detectTypeId) {
  query.detectCategory = detectTypeId;
  console.log(query);
  return request({
    url: `standard/v1/itMeGroups/getGroupsByItemIdList/${groupId}`,
    method: 'get',
    params: query
  })
}
//保存
export function saveDynamicForm(executionTemplateId, executionId, dynamicFormData, saveFlag, envBusinessConfigId) {
  return request({
    url: '/v1/dynamicDetectSchemes/' + executionTemplateId + '/save?saveFlag='+saveFlag+'&envBusinessConfigId='+envBusinessConfigId+'&executionId=' + executionId,
    method: 'post',
    data: dynamicFormData
  })
}
//获取详细信息
export function getExecutionEditDetail(id) {
  return request({
    url: '/v1/dynamicDetectSchemes/' + id,
    method: 'get',
  })
}
//复制数据
export function copyRow(id) {
  return request({
    url: 'v1/detectSchemes/'+id+'/copy',
    method: 'post',
  })
}

//删除数据
export function detectSchemes(ids) {
  return request({
    url: 'v1/detectSchemes/'+ids.toString(),
    method: 'delete',
  })
}
