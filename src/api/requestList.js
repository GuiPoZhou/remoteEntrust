/*
 *@author: 焦政
 *@date: 2021-09-14 16:31:34
 *@description:独立封装请求  把接口地址 放置到实际业务页面中去，免除多余文件的创建与多文件的引入
 */
import request from '@/utils/request'

export function net(url, method, params = {}) {
    return new Promise((re, rj) => {
        switch (method) {
            case 'postZip':
                re(requestPostZip(url, params))
                break
            case 'post':
                re(requestPost(url, params))
                break
            case 'get':
                re(requestGet(url, params))
                break
            case 'delete':
                re(requestDelete(url, params))
                break
            case 'deleteQs':
                re(requestDeleteQs(url, params))
                break
            case 'deleteData':
                re(requestDeleteData(url, params))
                break
            case 'put':
                re(requestPut(url, params))
                break
            case 'putZip':
                re(requestPutZip(url, params))
                break
            case 'postFile'://导出文档
                re(requestPostFile(url, params))
                break;
            case 'getFile'://导出文档
                re(requestGetFile(url, params))
                break
        }
    })
}
function requestPostFile(url, data) {
    return request({
        url,
        method: 'post',
        data,
        responseType: 'blob',
    })
}
function requestGetFile(url, data) {
    return request({
        url,
        method: 'get',
        params: data,
        responseType: 'blob',
    })
}

function requestPost(url, data) {
    return request({
        url,
        method: 'post',
        data
    })
}

function requestPostZip(url, data) {
    return request({
        url,
        method: 'post',
        data,
        headers: { 'Content-Encoding': 'gzip', 'Content-Type': 'application/json' }
    })
}

function requestGet(url, params) {
    return request({
        url,
        method: 'get',
        params
    })
}

function requestDelete(url, params) {
    console.log(params)
    return request({
        url,
        method: 'delete',
        params
    })
}

function requestDeleteQs(url, params) {
    console.log(params)
    return request({
        url,
        method: 'delete',
        params,
        paramsSerializer:{
            serialize:function(params){
                const keys = params.map(item=>`ids=${item}`).join('&')
                return `${keys}`
            }
        }
    })
}

function requestDeleteData(url, params) {
    return request({
        url,
        method: 'delete',
        data: params
    })
}

function requestPut(url, data) {
    return request({
        url,
        method: 'put',
        data
    })
}
function requestPutZip(url, data) {
    return request({
        url,
        method: 'put',
        data,
        headers: { 'Content-Encoding': 'gzip', 'Content-Type': 'text/plain' }
    })
}
