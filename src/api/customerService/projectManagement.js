// 检测方案相关

import request from '@/utils/request'

// 获取页面配置
export function getBusinessConfig(businessCategoy) {
    return request({
        url: '/template/execution/run/getBusinessConfig/' + businessCategoy,
        method: 'get'
    })
}

// 查询检测方案列表
export function getByList(query) {
    return request({
        url: '/v1/detectSchemes/byList',
        method: 'get',
        params: query
    })
}

// 方案复制
export function copySchemes(id) {
    return request({
        url: `/v1/detectSchemes/${id}/copy`,
        method: 'post'
    })
}

// 查询钻探要求
export function getDrillingRequirement() {
    return request({
        url: '/detectscheme/drillingRequirements',
        method: 'get'
    })
}


// 方案添加
export function addDetectSchemes(data) {
    return request({
        url: '/v1/detectSchemes/add',
        method: 'post',
        data
    })
}


// 方案提交
export function pushDetectSchemes(id, schemeType) {
    return request({
        url: `/v1/dynamicDetectSchemes/${id}?schemeType=${schemeType}`,
        method: 'post',
    })
}

// 根据方案id查询方案详情
export function getDetectSchemesInfo(id) {
    return request({
        url: `/v1/detectSchemes/by/${id}`,
        method: 'get'
    })
}


// 编辑方案
export function editDetectSchemes(id, data) {
    return request({
        url: `/v1/detectSchemes/${id}`,
        method: 'put',
        data
    })
}
