import request from '@/utils/request'

// 获取全局参数
export function getContext() {
	return request({
		url: '/system/context',
		method: 'GET'
	})
}

// 设置启用样品领用
export function setEnableSampleCollect(val) {
	return request({
		url: '/system/context/enableSampleCollect/' + val,
		method: 'PUT'
	})
}

// 设置启用ELN
export function setEnableEln(val) {
	return request({
		url: '/system/context/enableEln/' + val,
		method: 'PUT'
	})
}
