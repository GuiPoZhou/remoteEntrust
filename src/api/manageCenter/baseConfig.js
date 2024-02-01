import request from '@/utils/request'

//创建编码规则
export function getenCodingRule(params) {
	return request({
		url: '/base/v1/encodingRule',
		method: 'get',
		params
	})
}

//字典数据查询
export function getListAll(params) {
	return request({
		url: '/system/dict/data/listAll',
		method: 'get',
		params
	})
}

//创建编码规则
export function createRule(data) {
	return request({
		url: '/base/v1/encodingRule',
		method: 'post',
		data
	})
}

//更新编码规则
export function updateRule(id, data) {
	return request({
		url: `/base/v1/encodingRule/${id}`,
		method: 'put',
		data
	})
}

//启用/停用
export function updateStatus(id, status) {
	return request({
		url: `/base/v1/encodingRule/${id}/updateStatus?status=${status}`,
		method: 'put',
	})
}

//删除编码规则
export function deleteRule(id) {
	return request({
		url: `/base/v1/encodingRule/${id}`,
		method: 'delete'
	})
}

//获取编码规则
export function getEncodingRule(id) {
	return request({
		url: `/base/v1/encodingRule/${id}`,
		method: 'get',
	})
}

//编码规则逻辑列表
export function getEncodingRuleLogic(params) {
	return request({
		url: `/base/v1/encodingRuleLogic`,
		method: 'get',
		params
	})
}

//获取编码规则逻辑
export function encodingRuleLogicList(pramas) {
	return request({
		url: `/base/v1/encodingRuleLogic`,
		method: 'get',
		pramas
	})
}

//更新编码规则逻辑
export function updateEncodingRuleLogic(id, data) {
	return request({
		url: `/base/v1/encodingRuleLogic/${id}`,
		method: 'put',
		data
	})
}

//删除编码规则逻辑
export function deleteEncodingRuleLogic(id, data) {
	return request({
		url: `/base/v1/encodingRuleLogic/${id}`,
		method: 'delete',
		data
	})
}

//创建编码规则逻辑
export function createEncodingRuleLogic(data) {
	return request({
		url: `/base/v1/encodingRuleLogic`,
		method: 'post',
		data
	})
}

// 编码管理 - 获取业务类型枚举列表
export function getBusinessCategoryCodeList() {
	return request({
		url: '/base/v1/baseConfig/businessCategoryCodeList',
		method: 'get'
	})
}

// 打印模板管理 - 获取业务类型枚举列表
export function getBusinessCategoryTemplateList() {
	return request({
		url: '/base/v1/baseConfig/businessCategoryTemplateList',
		method: 'get'
	})
}

// 业务类型配置- 获取业务类型枚举列表
export function getBusinessCategoryBusinessList() {
	return request({
		url: '/base/v1/baseConfig/businessCategoryBusinessList',
		method: 'get'
	})
}
