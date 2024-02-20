import axios from "axios";
import { getToken } from '@/utils/auth'
const MenuId = localStorage.getItem('menuId')
export default {
    data() {
        return {
            microProjectEntry: '',
            microElnEntry: '',
        }
    },
    mounted() {

    },
    created() {
        /**
         * @author Coder
         * @date 2023/4/20
         * @des 手动加载共享组件子应用 注册入口
         */
        this.microProjectEntry = process.env.NODE_ENV === "production" ? '/subProject/' : `//${window.location.hostname}:7004`
        this.microElnEntry = process.env.NODE_ENV === "production" ? '/subEln/' : `//${window.location.hostname}:7005`
    },
    methods: {
        /**
         * @author Coder
         * @date 2023/3/28
         * @des 快速查询目标节点
         */
        getKevinFormNode(tree, treeChildrenName, sourceAttributeName, sourceAttributeValue) {
            let targetAttribute = {}
            if (Array.isArray(tree) && tree.length > 0) {
                tree.some(node => {
                    if (node[sourceAttributeName] === sourceAttributeValue) {
                        targetAttribute = node
                        return true;
                    } else if (node[treeChildrenName] !== undefined) {
                        let temp = this.getKevinFormNode(node[treeChildrenName], treeChildrenName, sourceAttributeName, sourceAttributeValue, targetAttribute)
                        if (Object.keys(temp).length > 0) {
                            targetAttribute = temp
                            return true
                        }
                    }
                })
            }
            return targetAttribute
        },
        /**
         * @author Coder
         * @date 2023/4/20
         * @des 手动注册子应用 做组件共享
         */
        async doLoadMicroApp(microName, entry) {
            const app = window.loadMicroApp({
                name: `${microName}${new Date().getTime()}`,
                entry: entry,
                container: '#appContainer2',
                props: { commonComponents: window.commonComponents, isLoad: true }
            })
            await app.mountPromise;
        },
        async doLoadMicroElnApp(microName, entry) {
            const app = window.loadMicroApp({
                name: `${microName}${new Date().getTime()}`,
                entry: entry,
                container: '#appElnContainer',
                props: { commonComponents: window.commonComponents, isLoad: true }
            })
            await app.mountPromise;
        },
        //获取proJect扩展的form 元素
        async getProjectWidget(businessName) {
            return new Promise((re, rj) => {
                let host = process.env.NODE_ENV === "production" ? '/subProject/' : `//${window.location.hostname}:7004/`
                let url = `${host}profiles/projectWidget/${businessName}.json`
                axios.get(url, { headers: { 'Authorization': getToken() } }).then(response => {
                    re(response.data)
                }).catch(err => {
                    console.log('请求失败', err)
                })
            })
        },
        /**
         * @author Coder
         * @date 2023/4/20
         * @des 获取project配置的业务按钮
         */
        async getProjectSlotButtons(businessName) {
            return new Promise((re, rj) => {
                let host = process.env.NODE_ENV === "production" ? '/subProject/' : `//${window.location.hostname}:7004/`
                let url = `${host}profiles/slotButton/${businessName}.json`
                axios.get(url, { headers: { 'Authorization': getToken() } }).then(response => {
                    let entrySlotButtonList = []//主页上方的按钮
                    let actionButtons = [] //主页table 操作里面的按钮
                    let buttonListInfo = response.data
                    entrySlotButtonList = buttonListInfo.entry.filter(item => {
                        return this.$checkPermi([item.perm]) || !item.perm
                    })

                    actionButtons = buttonListInfo.actios.filter(item => {
                        return this.$checkPermi([item.perm]) || !item.perm
                    })
                    let params = {
                        entrySlotButtonList,
                        actionButtons,
                        logs: buttonListInfo.logs,
                        tableSlotLink: buttonListInfo.tableSlotLink
                    }
                    re(params)
                }).catch(err => {
                    console.log('请求失败', err)
                })
            })

        },
        //获取project插件按钮 3.0版本  维护地址：系统管理-低码维护-项目抽取类型
        getPluginsForButtons(businessName, callback) {
            this.$net('/formLayout/v2/getFormLayoutConfig', 'get', {id: businessName}).then(re => {
                if (re.data) {
                    let formDataStr = re.data.configStr
                    let resultDataStr = formDataStr.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                    let info = JSON.parse(resultDataStr)
                    let mainHomeButtons = []
                    let mainTableButtons = []
                    let mainTableSlotRender = []
                    let mainDialogBottomButtons = []
                    let engineList = []
                    let businessCode = {}

                    mainHomeButtons = info.mainHomeButtons.filter(item => {
                        return this.$checkPermi([item.perm]) || !item.perm
                    })
                    mainTableButtons = info.mainTableButtons.filter(item => {
                        return this.$checkPermi([item.perm]) || !item.perm
                    })
                    mainDialogBottomButtons = info.mainDialogBottomButtons
                    mainTableSlotRender = info.mainTableSlotRender || []
                    engineList = info.engineList || []
                    businessCode = info.businessCode
                    callback({
                        mainHomeButtons,
                        mainTableButtons,
                        mainDialogBottomButtons,
                        businessCode,
                        mainTableSlotRender,
                        engineList
                    })
                } else {
                    let mainHomeButtons = []
                    let mainTableButtons = []
                    let mainTableSlotRender = []
                    let mainDialogBottomButtons = []
                    let engineList = []
                    let businessCode = {}
                    callback({
                        mainHomeButtons,
                        mainTableButtons,
                        mainDialogBottomButtons,
                        businessCode,
                        mainTableSlotRender,
                        engineList
                    })
                }

            })
        },
        /**
         * @author Coder
         * @date 2023/5/23
         * @des 生成单号  委托中样品或者子样使用
         */
        entrustGenCode(commissionNumber, digits, seqNum) {
            return commissionNumber + '-' + seqNum.toString().padStart(digits, '0');
        },
        //封装自定义json
        base64ToFile(base64Data, fileName) {
            var byteCharacters = atob(base64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += 1024) {
                var slice = byteCharacters.slice(offset, offset + 1024);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }

            var blob = new Blob(byteArrays, { type: 'application/octet-stream' });
            var file = new File([blob], fileName, { type: 'application/octet-stream' });
            return file
        },
        downloadBase64Image(base64Data, fileName) {
            var a = document.createElement('a');
            a.href = URL.createObjectURL(this.convertBase64ToBlob(base64Data));
            a.download = fileName;
            a.click();
        },
        convertBase64ToBlob(base64Data) {
            var parts = base64Data.split(';base64,');
            var contentType = parts[0].split(':')[1];
            var raw = window.atob(parts[1]);
            var rawLength = raw.length;
            var uInt8Array = new Uint8Array(rawLength);

            for (var i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }

            return new Blob([uInt8Array], { type: contentType });
        },
        // 根据文件名下载文件
        downloadFileByName(fileInfo) {
            window.location.href = window.globalEnv.VUE_APP_BASE_API + '/common/uploadFileDownload?fileName=' + fileInfo.fileName + '&filePath=' + fileInfo.url + '&Authorization=' + getToken() + '&MenuId=' + MenuId
        },
        //提取的公共excel的方法
        mbu_downloadExcel(fileName, isDoneDelte = true) {
            window.location.href = window.globalEnv.VUE_APP_BASE_API + '/common/downloadExcel?fileName=' + encodeURI(fileName) + '&delete=' + isDoneDelte + '&Authorization=' + getToken() + '&MenuId=' + MenuId
        },
        //提取的公共下载 根据url
        mbu_downloadFile(fileName, isDoneDelte = true) {
            window.location.href = window.globalEnv.VUE_APP_BASE_API +
                "/common/downloadFile?fileName=" +
                encodeURI(fileName) +
                "&delete=" +
                isDoneDelte + '&Authorization=' + getToken() + '&MenuId=' + MenuId;

        },
        // 提取公共下载
        mbu_download(fileName, isDoneDelte = true) {
            window.location.href =
                window.globalEnv.VUE_APP_BASE_API +
                '/common/download?fileName=' + encodeURI(fileName) + '&delete=' + isDoneDelte + '&Authorization=' + getToken() + '&MenuId=' + MenuId;
        },
        mbu_downloadBatch(code, idList) {
            window.open(`${window.globalEnv.VUE_APP_BASE_API}/common/downloadBatch?code=${code}&idList=${idList}&Authorization=${getToken()}&MenuId=${MenuId}`)

        },
        sortByArr1(arr, rev) {
            if (rev === undefined) {
                rev = 1;
            } else {
                rev = (rev) ? 1 : -1;
            }
            return function (a, b) {
                for (let i = 0; i < arr.length; i++) {
                    let attr = arr[i]
                    if (a[attr] !== b[attr]) {
                        if (a[attr] > b[attr]) {
                            return rev * 1;
                        } else {
                            return rev * -1;
                        }
                    }
                }
            }
        },
        //排序
        resultData(tableData, merge) {
            return tableData.sort(this.sortByArr1(merge, true))
        },
        //渲染动态table行内增加列表
        getSpanArr(data, tableInfo) {
            let tableDataList = []
            tableDataList = this.resultData(data, tableInfo.mergeArr)
            console.log('tableDataListaaa==============', tableDataList)
            tableInfo.tableData = tableDataList
            tableInfo.mergeArr.forEach((key, index1) => {
                let count = 0; // 用来记录需要合并行的起始位置
                tableInfo.mergeObj[key] = []; // 记录每一列的合并信息
                tableDataList.forEach((item, index) => {
                    // index == 0表示数据为第一行，直接 push 一个 1
                    if (index === 0) {
                        tableInfo.mergeObj[key].push(1);
                    } else {
                        // 判断当前行是否与上一行其值相等 如果相等 在 count 记录的位置其值 +1 表示当前行需要合并 并push 一个 0 作为占位
                        if (item[key] === tableDataList[index - 1][key]) {
                            tableInfo.mergeObj[key][count] += 1;
                            tableInfo.mergeObj[key].push(0);
                        } else {
                            // 如果当前行和上一行其值不相等
                            count = index; // 记录当前位置
                            tableInfo.mergeObj[key].push(1); // 重新push 一个 1
                        }
                    }
                })
            })
        },
        getProjectK18(textName) {
            return new Promise((re, rj) => {
                let host = process.env.NODE_ENV === "production" ? '/subProject/' : `//${window.location.hostname}:7004/`
                let url = `${host}profiles/k18/${textName}.json`
                axios.get(url, {headers: {'Authorization': getToken()}}).then(response => {
                    console.log('k18请求', typeof response.data)
                    if (typeof response.data == 'string') {
                        rj({code: 500})
                    } else {
                        re(response.data)
                    }

                }).catch(err => {
                    console.log('k18请求', err)
                    rj({ code: 500 })
                })
            })
        },
        arrayToTreeV(list) {
            const roots = [];
            const map = {};

            // 将数组元素以id为键值建立映射
            list.forEach((item) => {
                map[item.itemId] = { ...item, voListZ: [] };
            });

            // 遍历数组，将元素插入到其父节点的voListZ数组中
            list.forEach((item) => {
                if (item.parentId !== null) {
                    if (map[item.parentId]) {
                        map[item.parentId].voListZ.push(map[item.itemId]);
                    } else {
                        // 如果父元素不存在，可以选择将其作为根节点
                        roots.push(map[item.itemId]);
                    }
                } else {
                    roots.push(map[item.itemId]);
                }
            });

            return roots;
        },
        // 检测项目（树形）将树结构转为一层方法
        getTreeToFloor(arr, tage) {
            let data = JSON.parse(JSON.stringify(arr))
            let newData = []
            const callback = (item) => {
                (item[tage] || (item[tage] = [])).map(v => {
                    callback(v)
                })
                delete item[tage]
                newData.push(item)
            }
            data.map(v => callback(v))
            return newData
        },
        replaceNullChildrenWithEmptyArray(obj, key) {
            if (obj[key] === null) {
                obj[key] = []; // Replacing null children with an empty array
            } else if (Array.isArray(obj[key])) {
                // Recursively process the children array if it exists
                obj[key].forEach((child) => {
                    this.replaceNullChildrenWithEmptyArray(child, key);
                });
            }
        },
        // 检测项目（树形） 将一层检测项目
        generateTree(itemList) {
            const root = {};
            const nodeMap = {};
            itemList.forEach(item => {
                const { itemId, parentId } = item;
                nodeMap[itemId] = { ...item, voListZ: [] };
            });
            itemList.forEach(item => {
                const { itemId, parentId } = item;
                const node = nodeMap[itemId];
                if (parentId === 0) {
                    root.voListZ.push(node);
                } else {
                    const parentNode = nodeMap[parentId];
                    parentNode.voListZ.push(node);
                }
            });
            return root;
        },
        sortArrayBySort(arr, sortOrder = 'asc') {
            const sortedArr = [...arr];

            sortedArr.sort((a, b) => {
                if (a.sort === null && b.sort === null) {
                    return 0;
                } else if (a.sort === null) {
                    return 1;
                } else if (b.sort === null) {
                    return -1;
                } else {
                    return sortOrder === 'asc' ? a.sort - b.sort : b.sort - a.sort;
                }
            });

            return sortedArr;
        }
    }
}
