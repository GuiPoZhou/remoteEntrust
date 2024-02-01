/*
 * @Autor: 焦政
 * @Date: 2021-02-24 16:46:36
 * @Description: license相关接口
 */
import request from '@/utils/request'


// 查询当前项目是属于哪个公司的哪个项目
export function getProjectInfo() {
    return request({
        url: 'licenseClient/v1/getCompanyDetail',
        method: 'get'
    })
}


//  查询公司license信息  proInfo项目信息
export function licenseInfo(proInfo) {
    return request({
        url: 'licenseClient/v1/info',
        method: 'get',
        params: proInfo
    })
}


// 上传license文件
export function uploadLicenseDoc(formData) {
    return request({
        method: 'post',
        // 上传地址
        url: 'licenseClient/v1/upload',
        // 定义上传头
        headers: { 'Content-Type': 'multipart/form-data' },
        data: formData
    });
}

// 校验当前公司下的该项目的license是否到期
export function checkLicense(formData) {
    return request({
        method: 'post',
        // 上传地址
        url: 'licenseClient/v1/check',
        // 定义上传头
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: formData
    })
}