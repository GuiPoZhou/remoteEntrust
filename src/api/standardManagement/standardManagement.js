import request from '@/utils/request'

//标准树查询
export function getStandardTreelist(query) {
  return request({
    url: '/decideStandard/v1/tree/querySdandardTree',
    method: 'get',
    params: query,
  })
}
//标准树新增
export function addStandardtree(data) {
  return request({
    url: '/decideStandard/v1/tree/addSdandardTree',
    method: 'post',
    data,
  })
}
//标准树删除
export function deleteStandardtree(decideSdandardTreeId) {
  return request({
    url: '/decideStandard/v1/tree/delStandardTree/' + decideSdandardTreeId,
    method: 'get',
  })
}
//标准树修改
export function editStandardtree(data) {
  return request({
    url: '/decideStandard/v1/tree/updateSdandardTree',
    method: 'post',
    data,
  })
}
// 判定标准查询列表
export function getStandardList(query) {
  return request({
    url: '/decideStandard/v1/standard/querySdandard',
    method: 'get',
    params: query,
  })
}
//标准新增
export function addStandard(data) {
  return request({
    url: '/decideStandard/v1/standard/addSdandard',
    method: 'post',
    data,
  })
}
//标准详情
export function detailStandard(decideStandardId) {
  return request({
    url: '/decideStandard/v1/standard/querySdandardById/' + decideStandardId,
    method: 'get',
  })
}
//标准修改
export function editStandard(data) {
  return request({
    url: '/decideStandard/v1/standard/updateSdandard',
    method: 'post',
    data,
  })
}
// 标准复制
export function copyStandard(decideSdandardId) {
  return request({
    url: '/decideStandard/v1/standard/copySdandard/' + decideSdandardId,
    method: 'get',
  })
}
// 标准删除
export function delStandard(decideSdandardId) {
  return request({
    url: '/decideStandard/v1/standard/delStandard/' + decideSdandardId,
    method: 'get',
  })
}
// 标准中的产品分类树查询
export function getproductStandardTree(decidestandardId) {
  return request({
    url: '/decideStandard/v1/standardProduction/queryStandardProduction/' + decidestandardId,
    method: 'get',
  })
}
//标准中的产品分类树新增
export function addproductStandardtree(data) {
  return request({
    url: '/decideStandard/v1/standardProduction/addStandardProduction',
    method: 'post',
    data,
  })
}
//标准中的产品分类树修改
export function editproductStandardtree(data) {
  return request({
    url: '/decideStandard/v1/standardProduction/updateStandardProduction',
    method: 'post',
    data,
  })
}
//标准树删除
export function deleteproductStandardtree(standardProductionId) {
  return request({
    url: '/decideStandard/v1/standardProduction/delStandardProduction/' + standardProductionId,
    method: 'get',
  })
}
// 判定指标查询列表
export function getstandaraItemList(query) {
  return request({
    url: '/decideStandard/v1/item/queryStandardItemLimitList',
    method: 'get',
    params: query,
  })
}
// 检测类别树查询列表
export function getCategoryTree(query) {
  return request({
    url: '/decideStandard/v1/item/queryCategoryTree',
    method: 'get',
    params: query,
  })
}
// 根据检测类别查询项目
export function getCategoryItem(query) {
  return request({
    url: '/decideStandard/v1/item/queryCategoryItem',
    method: 'get',
    params: query,
  })
}
// 检测项目新增
export function addStandardItem(data) {
  return request({
    url: '/decideStandard/v1/item/addStandardItem',
    method: 'post',
    data,
  })
}
// 判定指标添加/修改
export function addItemLimit(data) {
  return request({
    url: '/decideStandard/v1/item/saveOrUpdateItemLimit',
    method: 'post',
    data,
  })
}
// 判定指标删除
export function delStandardItem(data) {
  return request({
    url: '/decideStandard/v1/item/delStandardItem',
    method: 'post',
    data,
  })
}
// 多指标维护查询
export function getMultLimitList(query) {
  return request({
    url: '/decideStandard/v1/item/queryMultLimitList',
    method: 'get',
    params: query,
  })
}
// 多指标保存
export function saveStandardItem(data) {
  return request({
    url: '/decideStandard/v1/item/saveMultItemLimit',
    method: 'post',
    data,
  })
}
// 复制指标
export function copyStandardItem(data) {
  return request({
    url: '/decideStandard/v1/item/copyItemLimit',
    method: 'post',
    data,
  })
}
