import {getToken} from '@/utils/auth.js';

// 假设你有以下类型声明或者全局类型
interface GlobalEnv {
    VUE_APP_BASE_API: string;
}

declare let window: Window & { globalEnv: GlobalEnv };
declare let localStorage: Storage;

const MenuId = localStorage.getItem('menuId') as string | null; // 或者更准确地定义存储的MenuId类型

export function downLoadFile(fileName: string, isTrue: boolean = true): void {
    if (MenuId === null) {
        throw new Error("MenuId not found in local storage");
    }
    const baseURL = window.globalEnv.VUE_APP_BASE_API;
    window.location.href = `${baseURL}/common/download?fileName=${encodeURIComponent(fileName)}&delete=${isTrue}&Authorization=${getToken()}&MenuId=${MenuId}`;
}

export function downLoadFile2(fileName: string, isTrue: boolean = true): void {
    if (MenuId === null) {
        throw new Error("MenuId not found in local storage");
    }
    const baseURL = window.globalEnv.VUE_APP_BASE_API;
    window.location.href = `${baseURL}/common/downloadFile?fileName=${encodeURIComponent(fileName)}&delete=${isTrue}&Authorization=${getToken()}&MenuId=${MenuId}`;
}

export function downloadFileByName(fileInfo: { fileName: string; url: string }): void {
    if (MenuId === null) {
        throw new Error("MenuId not found in local storage");
    }
    window.location.href = `${window.globalEnv.VUE_APP_BASE_API}/common/uploadFileDownload?fileName=${fileInfo.fileName}&filePath=${fileInfo.url}&Authorization=${getToken()}&MenuId=${MenuId}`;
}

export function mbu_downloadExcel(fileName: string, isDoneDelte: boolean = true): void {
    if (MenuId === null) {
        throw new Error("MenuId not found in local storage");
    }
    window.location.href = `${window.globalEnv.VUE_APP_BASE_API}/common/downloadExcel?fileName=${encodeURIComponent(fileName)}&delete=${isDoneDelte}&Authorization=${getToken()}&MenuId=${MenuId}`;
}

export function mbu_downloadFile(fileName: string, isDoneDelte: boolean = true): void {
    if (MenuId === null) {
        throw new Error("MenuId not found in local storage");
    }
    window.location.href = `${window.globalEnv.VUE_APP_BASE_API}/common/downloadFile?fileName=${encodeURIComponent(fileName)}&delete=${isDoneDelte}&Authorization=${getToken()}&MenuId=${MenuId}`;
}

export function mbu_download(fileName: string, isDoneDelte: boolean = true): void {
    if (MenuId === null) {
        throw new Error("MenuId not found in local storage");
    }
    window.location.href = `${window.globalEnv.VUE_APP_BASE_API}/common/download?fileName=${encodeURIComponent(fileName)}&delete=${isDoneDelte}&Authorization=${getToken()}&MenuId=${MenuId}`;
}

export function mbu_downloadPdf(fileName: string, isDoneDelte: boolean = true): void {
    if (MenuId === null) {
        throw new Error("MenuId not found in local storage");
    }
    window.location.href = `${window.globalEnv.VUE_APP_BASE_API}/v1/entrustRemoteAgreement/common/downloadFile?fileName=${encodeURIComponent(fileName)}&delete=${isDoneDelte}&Authorization=${getToken()}&MenuId=${MenuId}`;
}

export function mbu_downloadPageOffice(fileName: string, isDoneDelte: boolean = true): void {
    if (MenuId === null) {
        throw new Error("MenuId not found in local storage");
    }
    window.location.href = `${window.globalEnv.VUE_APP_BASE_API}${encodeURIComponent(fileName)}&delete=${isDoneDelte}&Authorization=${getToken()}&MenuId=${MenuId}`;
}

// 根据你的注释和上下文推测，这里可能需要一个具体的路径
// export function mbu_downloadPageOffice(fileName: string, isDoneDelte: boolean = true): void {
//   if (MenuId === null) {
//     throw new Error("MenuId not found in local storage");
//   }
//   window.location.href =
//     `${window.globalEnv.VUE_APP_BASE_API}/v1/pageOffice/common/downloadFile?fileName=${encodeURIComponent(fileName)}&delete=${isDoneDelte}&Authorization=${getToken()}&MenuId=${MenuId}`;
// }

export function mbu_downloadBatch(code: string, idList: string[]): void {
    if (MenuId === null) {
        throw new Error("MenuId not found in local storage");
    }
    const url = `${window.globalEnv.VUE_APP_BASE_API}/common/downloadBatch?code=${code}&idList=${encodeURIComponent(JSON.stringify(idList))}&Authorization=${getToken()}&MenuId=${MenuId}`;
    window.open(url);
}
