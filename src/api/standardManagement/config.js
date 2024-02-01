import request from '@/utils/request'

//计量单位分页列表
export function getMeasuringList(query) {
  return request({
    url: '/standard/v1/measuringUnits',
    method: 'get',
    params: query,
  })
}
//查询计量单位列表
export function selectMeasuringList(query) {
  return request({
    url: '/standard/v1/measuringUnits',
    method: 'get',
    params: query,
  })
}
//编辑计量单位列表
export function saveMeasuringList(data) {
  return request({
    url: '/standard/v1/measuringUnits',
    method: 'post',
    data,
  })
}
//删除计量单位列表
export function deleteMeasuringList(meteringId) {
  return request({
    url: '/standard/v1/measuringUnits/' + meteringId,//这里注意加/
    method: 'delete',
  })
}
//新增计量单位列表
export function addMeasuringList(data) {
  return request({
    url: '/standard/v1/measuringUnits',
    method: 'put',
    data
  })
}
//导出计量单位列表
export function exportMeasuringList(data) {
  return request({
    url: '/standard/v1/measuringUnits/action/export',
    method: 'get',
    params: data,
  })
}
//下载计量单位模板文件
export function downLoadTemplate() {
  return request({
    url: '/standard/v1/measuringUnits/importTemplate',
    method: 'get',
  })
}
//模板下载
// export function downLoadTemplate1() {
//   window.location.href = process.env.VUE_APP_BASE_API + "/standard/v1/measuringUnits/importTemplate";
// }
//更新计量单位列表中状态
export function getMeasuringListStatus(id, query) {
  return request({
    url: `/standard/v1/measuringUnits/updataStatus/${id}`,
    method: 'put',
    params: query
  })
}
//检测类别分页列表
export function getCheckList(query) {
  return request({
    url: '/standard/v1/detectCategorys',
    method: 'get',
    params: query,
  })
}
//删除检测类别列表
export function deleteCheckList(checkId) {
  return request({
    url: '/standard/v1/detectCategorys/' + checkId,//这里注意加/
    method: 'delete',
  })
}
//详情检测类别列表
export function detailsCheckList(checkId) {
  return request({
    url: '/standard/v1/detectCategorys/' + checkId,//这里注意加/
    method: 'get',
  })
}
//编辑检测类别列表
export function editCheckList(data, checkId) {
  return request({
    url: '/standard/v1/detectCategorys/' + checkId,//这里注意加/,
    method: 'put',
    data,
  })
}
//新增检测类别列表
export function addCheckList(data) {
  return request({
    url: '/standard/v1/detectCategorys',
    method: 'post',
    data
  })
}
//获取上级检测类别名称
export function getParentCheckList(query) {
  return request({
    url: '/standard/v1/detectCategorys/getList',
    method: 'get',
    params: query
  })
}
//更新检测类别列表中状态
export function getCheckListStatus(id, query) {
  return request({
    url: `/standard/v1/detectCategorys/${id}/updataStatus`,
    method: 'put',
    params: query
  })
}
//项目方法管理分页列表
export function getProjectMethodList(query) {
  return request({
    url: '/standard/v1/itemMethods',
    method: 'get',
    params: query,
  })
}
//项目分组分页列表
export function getProjectGroupList(query) {
  return request({
    url: '/standard/v1/itMeGroups',
    method: 'get',
    params: query,
  })
}
//新增项目分组分页列表
export function addProjectGroupList(query) {
  return request({
    url: '/standard/v1/itMeGroups',
    method: 'post',
    data: query,
  })
}
//详情项目分组列表
export function datailsProjectGroupList(detailsId) {
  return request({
    url: '/standard/v1/itMeGroups/' + detailsId,//这里注意加/
    method: 'get',
  })
}
//编辑项目分组列表
export function editProjectGroupList(data, id) {
  return request({
    url: '/standard/v1/itMeGroups/' + id,//这里注意加/
    method: 'put',
    data,
  })
}
//删除项目分组列表
export function deleteProjectGroupList(Id) {
  return request({
    url: '/standard/v1/itMeGroups/' + Id,//这里注意加/
    method: 'delete',
  })
}
//采样项目分组列表
export function getSamplingList(query) {
  return request({
    url: '/standard/v1/itMeTakeGroups',
    method: 'get',
    params: query,
  })
}
//更新采样项目分组列表中状态
export function getSamplingListStatus(id, query) {
  return request({
    url: `/standard/v1/itMeTakeGroups/${id}/updataStatus`,
    method: 'put',
    params: query
  })
}

//详情采样项目分组列表
export function datailsSamplingProjectGroupList(detailsId) {
  return request({
    url: '/standard/v1/itMeTakeGroups/' + detailsId,//这里注意加/
    method: 'get',
  })
}
//新增采样项目分组列表
export function addSamplingProjectGroupList(query) {
  return request({
    url: '/standard/v1/itMeTakeGroups',
    method: 'post',
    data: query
  })
}
//删除采样项目分组列表
export function deleteSamplingProjectGroupList(Id) {
  return request({
    url: '/standard/v1/itMeTakeGroups/' + Id,//这里注意加/
    method: 'delete',
  })
}
//编辑采样项目分组列表
export function editSamplingProjectGroupList(data, id) {
  return request({
    url: '/standard/v1/itMeTakeGroups/' + id,//这里注意加/
    method: 'put',
    data,
  })
}
//采样项目分组里面的字典数据
export function getDictionaryData(query) {
  return request({
    url: '/system/dict/data/listAll',
    method: 'get',
    params: query,
  })
}
//编辑采样项目分组列表
export function editSamplingList(data, id) {
  return request({
    url: '/standard/v1/itMeTakeGroups/' + id,//这里注意加/
    method: 'put',
    data,
  })
}


/*
 *@author: 焦政
 *@date: 2021-02-05 14:13:13
 *@description: 选择可分配项目列表接口
*/

// 项目分组 获取可分配项目列表
export function getCommonValidItemList(query) {
  return request({
    url: '/standard/v1/itMeGroups/getValidItemMethodList',
    method: 'get',
    params: query,
  })
}

// 采样项目分组 获取可以分配的项目列表
export function getTakeValidItemList(query) {
  return request({
    url: '/standard/v1/itMeTakeGroups/getValidItemMethodList',
    method: 'get',
    params: query,
  })
}