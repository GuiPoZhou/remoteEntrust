import request from '@/utils/request'
import qs from 'qs'

//项目方法分页列表
export function listItemMethod(query) {
	return request({
		url: '/standard/v1/itemMethods',
		method: 'get',
		params: query,
	})
}

//认证情况列表
export function listAuthentication() {
	return request({
		url: '/system/dict/data/listAll',
		method: 'get',
		params: {"dictType": "authentication"},
	})
}

//根据项目名查询项目
export function searchItemsByName(itemName) {
	return request({
		url: '/standard/v1/itemMethods/searchItemsByName',
		method: 'get',
		params: {"itemName": itemName},
	})
}

//根据方法编码查询方法
export function searchMethodsByCode(methodCode) {
	return request({
		url: '/standard/v1/itemMethods/searchMethodsByCode',
		method: 'get',
		params: {"methodCode": methodCode},
	})
}

//新增
export function add(data) {
	return request({
		url: '/standard/v1/itemMethods',
		method: 'post',
		data
	})
}

//删除
export function deleteItem(id) {
	return request({
		url: '/standard/v1/itemMethods/' + id,
		method: 'delete'
	})
}

//导出
export function exportData(query) {
	return request({
		url: '/standard/v1/itemMethods/export',
		method: 'get',
		params: query,
	})
}

//获取详情
export function getDetailById(itemMethodId) {
	return request({
		url: '/standard/v1/itemMethods/' + itemMethodId,
		method: 'get',
	})
}

//修改
export function update(data, itemMethodId) {
	return request({
		url: '/standard/v1/itemMethods/' + itemMethodId,
		method: 'put',
		data
	})
}

// 更新状态
export function updateStatus(itemMethodId, status) {
	return request({
		url: '/standard/v1/itemMethods/' + itemMethodId + '/updataStatus',
		method: 'put',
		params: {
			"status": status
		}
	})
}

//模板下载
export function downLoadTemplate() {
	window.location.href = window.globalEnv.VUE_APP_BASE_API + "/standard/v1/itemMethods/importTemplate";
}


//根据项目id列表查询（项目-方法）列表
export function getItemsByIds(data) {
	return request({
		url: '/standard/v1/itemMethods/getItemsByIds',
		method: 'get',
		params: data,
		paramsSerializer: params => {
			return qs.stringify(params, {indices: false})
		}
	})
}

//项目分页列表
export function getItemList(query) {
	return request({
		url: '/standard/v1/itemMethods/getItemList',
		method: 'get',
		params: query,
	})
}









