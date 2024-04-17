<template>

  <div>
    <ml-dialog ref="mlDialog" :HasPermi="$checkRole(['admin'])" :dia-log-show="showlog" :dia-log-title="title" :showEditDrag="true"
               dia-log-width="70%" @close="cancel"
               @confirmFormDesgin="definitionFormJSON">
      <template slot="bologbody">
        <el-row v-if="!$store.state.system.closeDrag" style="margin-bottom:10px">
          <el-col :span="24">
            <el-button size="small" type="success" @click="e_addNewTab">新增页签
            </el-button>
            <el-popover placement="bottom-end" style="margin:0 10px" trigger="click" width="500">
              <el-row>
                <el-col :span="24">
                  <el-button size="small" style="margin:10px 0" type="primary"
                             @click="e_addBulletBox">新增弹框
                  </el-button>
                </el-col>
                <el-col :span="24">
                  <el-table :data="bulletBox" border style="width: 100%">
                    <el-table-column align="center" label="弹框标题" prop="title">
                    </el-table-column>
                    <el-table-column label="弹框唯一值" prop="anchorPoint">
                    </el-table-column>
                    <el-table-column label="操作">
                      <template v-slot="scope">
                        <!-- <el-button type="text" @click="e_delteBulletBox(scope.$index)">删除弹框
                        </el-button> -->
                        <el-button type="text" @click="e_editBulletBox(scope.row, scope.$index)">
                          编辑弹框
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <el-button slot="reference" size="small" type="primary">弹框管理</el-button>
            </el-popover>
            <!-- <el-button size="small" type="warning"
                @click="e_showAllBodyCode({ codeJson: listParamsList, index: -1, type: 'global' })">
                主体Code
            </el-button> -->
            <!-- <el-button type="warning" size="small"
                @click="e_showAllBodyCode({ codeJson: bulletBox, index: -1, type: 'box' })">弹框Code
            </el-button> -->
          </el-col>
        </el-row>
        <el-form ref="form" :model="queryForm" label-position="top" label-width="120px">
          <kevin-form ref="kevinForm" :bolckFormParams="listParamsList" :bulletBox="bulletBox" :businessConfigId="businessConfigId"
                      :form="queryForm" :open-env="currentEnv" @addBlockInTab="e_addBlockInTab"
                      @blockDeleteInTab="e_blockDeleteInTab" @editBlockForm="e_editBlockForm"
                      @saveBulletBoxScript="e_saveBulletBoxScript" @saveSignleEdit="e_saveSignleEdit"
                      @saveTabGlobalScript="e_saveTabGlobalScript" @saveWidgetForm="e_saveWidgetForm"
                      @tabClick="e_tabClick"/>
        </el-form>
      </template>
      <template slot="bologfooter">
        <el-button v-if="openType != 'again' && openType !== 'view'" :loading="isLoad" type="success"
                   @click="submit(2)">暂存
        </el-button>
        <el-button v-if="activeName == 'five' && openType !== 'view'" :loading="isLoad" type="primary"
                   @click="submit(1)">保存
        </el-button>
        <el-button @click="cancel">取 消</el-button>
      </template>
    </ml-dialog>
    <!--        弹框组件-->
    <kevin-log v-if="showkevinLog" ref="kevinLog" :businessConfigId="businessConfigId" :itemBindType="itemBindType"
               :open-env="currentEnv" :widget-form="kevinLogWidget" @close="showkevinLog = false"
               @confirmFormDesgin="definitionFormJSON"
               @save="e_saveLogParams" @saveAddForm="e_saveKevinEdit"
               @saveBulletBoxScript="e_saveBulletBoxScript" @saveSignleEdit="e_saveSignleEdit"/>
    <!--        选择检测项目-->
    <selectItem v-if="showselectItem" ref="selectItem" @cancel="showselectItem = false" @saveItem="e_saveItem"/>
    <!--        添加检测项目-->
    <AddTestItems v-if="showAddTestItems" ref="AddTestItems" @cancel="showAddTestItems = false"
                  @reload="addTestItemsReload"/>
  </div>
</template>
<script>
export default {
  data() {
    return {
      listParamsList: [],
      bulletBox: [],
      showkevinLog: false,
      kevinLogWidget: null,
    }
  },
  methods: {
    getNode(tree, treeChildrenName, sourceAttributeName, sourceAttributeValue) {
      let targetAttribute = {}
      if (Array.isArray(tree) && tree.length > 0) {
        tree.some(node => {
          if (node[sourceAttributeName] === sourceAttributeValue) {
            targetAttribute = node
            return true;
          } else if (node[treeChildrenName] !== undefined) {
            let temp = EntrustThis.getNode(node[treeChildrenName], treeChildrenName, sourceAttributeName, sourceAttributeValue, targetAttribute)
            if (Object.keys(temp).length > 0) {
              targetAttribute = temp
              return true
            }
          }
        })
      }
      return targetAttribute
    }
  }
}
</script>
<script setup>
import selectItem from '@/components/DetectSubItemManage/selectItem.vue'
import DetectType from '@/components/project/detectType.vue'
import {toRefs, ref, reactive, getCurrentInstance, watch, nextTick, defineProps, onBeforeMount} from 'vue'

const emit = defineEmits(['close'])
const {openType} = defineProps(['businessConfigId', 'openType'])
const instance = getCurrentInstance()
// 获取vue实例相当于this
const vm = instance['proxy']

let showlog = ref(false)
let title = ref('委托')
let type = ref('add')
let isdisabled = ref(false)
let queryForm = ref({})
// 动态表配置
let businessConfigId = ref(0)
let currentEnv = ref(type.value)
let listParamsList = ref([])
let bulletBox = ref([])
let itemBindType = ref(1) ////检测项目挂载位置（编码样品：3、委托样品：2、仅委托：1）

// 检测类别
let showselectItem = ref(false)
let showAddTestItems = ref(false)
onBeforeMount(() => {
  window.EntrustThis = vm
  vm.$store.commit('set_entrustthis', vm)
})

/**
 * @author Coder
 * @date 2023/3/30
 * @des 确定选择的检测项目
 */
function e_saveItem(params) {
  console.log('确定选择项目')
  showselectItem.value = false
  let anchorInfo = getNode(listParamsList.value, 'formList', 'anchorPoint', 'detectItemTable')
  anchorInfo.tableData = JSON.parse(JSON.stringify(params))
  vm.$forceUpdate()
}

/**
 * @author Coder
 * @date 2023/3/28
 * @des 快速查询目标节点
 */
function getNode(tree, treeChildrenName, sourceAttributeName, sourceAttributeValue) {
  let targetAttribute = {}
  if (Array.isArray(tree) && tree.length > 0) {
    tree.some(node => {
      if (node[sourceAttributeName] === sourceAttributeValue) {
        targetAttribute = node
        return true;
      } else if (node[treeChildrenName] !== undefined) {
        let temp = EntrustThis.getNode(node[treeChildrenName], treeChildrenName, sourceAttributeName, sourceAttributeValue, targetAttribute)
        if (Object.keys(temp).length > 0) {
          targetAttribute = temp
          return true
        }
      }
    })
  }
  return targetAttribute
}

// 添加检测项目回调
function addTestItemsReload(itemParams) {
  console.log('回调')
  showAddTestItems.value = false
  eval(listParamsList.value[0].passiveEvents.appendItemTable)
}

/**
 * @author Coder
 * @date 2023/3/27
 * @des 点击tab
 */
let activeName = ref('')

function e_tabClick(activeNames) {
  activeName.value = activeNames
  let tableEventsInfo = listParamsList.value[0].tabClickEvents
  console.log('tableEventsInfo', tableEventsInfo)
  tableEventsInfo && tableEventsInfo.appendSubSampleDetail ? eval(tableEventsInfo.appendSubSampleDetail) : ''
}

//------------------------------
function init(id, env) {
  businessConfigId.value = id
  showlog.value = true
  type.value = env
  getFormConfigData()
}

async function editInit(id, row, openType, entrustStatus = -1) {
  console.log('entrustStatus', entrustStatus)
  currentEnv.value = openType
  businessConfigId.value = id
  await getFormConfigData()
  await e_getEntrustInfo(row.id)
  console.log(currentEnv)
  showlog.value = true
  vm.$forceUpdate()
}

/**
 * @author Coder
 * @date 2023/4/6
 * @des 查询委托详情
 */
async function e_getEntrustInfo(id) {
  let events = listParamsList.value[0].passiveEvents.entrustInfo
  var that = vm
  new Function('that', 'id', events)(that, id)
}

async function getFormConfigData() {
  let re = await vm.$net(`/formLayout/getFormLayoutConfig?id=${businessConfigId.value}`, 'get')
  // this.listParamsList = re.data.formLayoutConfig.listParamsList || []
  // this.bulletBox = re.data.formLayoutConfig.bulletBox || []

  let formDataStr = re.data.formLayoutConfigStr || '{}'
  let resultDataStr = formDataStr.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  let fromData = JSON.parse(resultDataStr)
  listParamsList.value = fromData.listParamsList || []
  bulletBox.value = fromData.bulletBox || []
  e_getWidgetServerData()
  // let targetAttribute = EntrustThis.getNode(EntrustThis.listParamsList, 'formList', 'anchorPoint', 'sampleInfo');
  // targetAttribute.tableData[0].sendSampleCount = 456
}

watch(() => type, (val) => {
  switch (val) {
    case 'add':
      title.value = '新增'
      isdisabled.value = false
      break;
    case 'edit':
      title.value = '修改'
      isdisabled.value = false
      break;
    case 'detail':
      title.value = '详情'
      isdisabled.value = true
      break
  }
}, {
  immediate: true
})

function tabSelected() {

}

/**
 * @author Coder
 * @date 2023/3/23
 * @des 在tab下新增区域
 */
function e_addBlockInTab(tabIndex) {
  let params = {
    "title": "我是新增区域",
    "anchorPoint": "",
    "isHide": false,
    "formList": [],
    "events": {}
  }
  listParamsList.value[tabIndex].formList.push(params)
  definitionFormJSON()
}

/**
 * @author Coder
 * @date 2023/3/23
 * @des 获取form
 */
function e_editBlockForm(params) {
  if (params.type == 'global') {
    listParamsList.value = params.codeJson
  } else if (params.type == 'tab') {
    vm.$set(listParamsList.value, params['index'], params.codeJson)
  } else if (params.type == 'block') {
    let tabInfo = listParamsList.value[params['parentIndex']]
    tabInfo.formList[params['index']] = params.codeJson
    vm.$set(listParamsList.value, params['parentIndex'], tabInfo)
  } else if (params.type == 'box') {
    bulletBox.value = params.codeJson
  }
  definitionFormJSON()
}

/**
 * @author Coder
 * @date 2023/3/30
 * @des 保存表单布局配置
 */
function definitionFormJSON() {
  process.env.NODE_ENV === "production" ? doSaveFormJsonByPwd() : doSaveFormJSON()
}

const confirmPwd = 'kevinform'

function doSaveFormJsonByPwd() {
  vm.$prompt('请输入密码', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputType: 'password',
  }).then(({value}) => {
    // 成功之后的回调
    if (value == confirmPwd) {
      doSaveFormJSON()
    } else {
      vm.$message.error('操作密码错误')
      MlDialogThis.closeDrag = false
    }
  }).catch(_ => {
    MlDialogThis.closeDrag = false
  })
}

// 保存表单配置
function doSaveFormJSON() {
  let listParamsListForm = JSON.parse(JSON.stringify(listParamsList.value))
  listParamsListForm.forEach(tabInfo => {
    tabInfo.formList.forEach(blockInfo => {
      blockInfo.formList.forEach(formInfo => {
        if (formInfo.component == 'el-table') {
          formInfo.tableData = []
          formInfo.tableSelections = []
        }
      })
    })
  })
  let bulletBoxForm = JSON.parse(JSON.stringify(bulletBox.value))
  bulletBoxForm.forEach(bulletInfo => {
    bulletInfo.formList.forEach(blockInfo => {
      if (blockInfo.component == 'el-table') {
        blockInfo.tableData = []
        blockInfo.tableSelections = []
      }
    })
  })
  let saveParams = {
    id: businessConfigId.value,
    formLayoutConfig: {
      listParamsList: listParamsListForm,
      bulletBox: bulletBoxForm
    }
  }
  let formLayoutConfigStr = JSON.stringify(saveParams)
  let resultStr = formLayoutConfigStr.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  console.log(JSON.parse(resultStr))
  vm.$net('/formLayout/saveFormLayoutConfig', 'post', JSON.parse(resultStr)).then(re => {
    if (re.code == 200) {
      vm.$message.success('保存成功')
      e_getWidgetServerData()
      vm.$store.commit('set_closeDrag', true)
      vm.$refs.mlDialog.closeDrag = true
      vm.$store.commit('set_listParamsList', listParamsList.value)
      vm.$store.commit('set_bulletBox', bulletBox.value)
      MlDialogThis.closeDrag = true
    }
  })
}

/**
 * @author Coder
 * @date 2023/3/25
 * @des 获取动态form中的接口数据
 */
function e_getWidgetServerData() {
  listParamsList.value.forEach(tabInfo => {
    tabInfo.formList.forEach(blockInfo => {
      blockInfo.formList.forEach(item => {
        e_getFormOptions(item)
      })
    })
  })
  bulletBox.value.forEach(blockInfo => {
    blockInfo.formList.forEach(item => {
      e_getFormOptions(item)
    })
  })
  vm.$store.commit('set_listParamsList', listParamsList.value)
  vm.$store.commit('set_bulletBox', bulletBox.value)
}

async function e_getFormOptions(item) {
  let componentList = ['el-select', 'select', 'el-radio', 'radio', 'checkbox', 'el-checkbox']
  if (componentList.indexOf(item.component) != -1) {
    if (item.options.dynamicGetUrl) {
      item.options.options = []
      let re = await vm.$net(item.options.dynamicGetUrl, 'get')
      let dataRouse = re.rows || re.data.list || re.data
      dataRouse.forEach(ii => {
        let obj = {
          label: ii[item.options.dynamicGetValue],
          value: ii[item.options.dynamicGetKey] * 1
        }
        item.options.options.push(obj)
      })
    }
  }
}

/**
 * @author Coder
 * @date 2023/3/24
 * @des 保存弹框的编辑
 */
function e_saveKevinEdit(editParams) {
  let obj = bulletBox.value[editParams.index]
  obj = editParams.params
  vm.kevinLogWidget = obj
  vm.$set(bulletBox.value, editParams.index, obj)
  definitionFormJSON()
}

/**
 * @author Coder
 * @date 2023/3/23
 * @des 删除选择的区域 逻辑删除
 */
function e_blockDeleteInTab({tabIndex, blockIndex}) {
  listParamsList.value[tabIndex].formList[blockIndex].isHide = true
  definitionFormJSON()
}

/**
 * @author Coder
 * @date 2023/3/23
 * @des 保存对区域内进行新增form项
 */
function e_saveTabGlobalScript(params) {
  listParamsList.value[params.tabIndex].events = params.events
  listParamsList.value[params.tabIndex].passiveEvents = params.passiveEvents
  definitionFormJSON()
}

function e_saveBulletBoxScript(params) {
  bulletBox.value.forEach(item => {
    if (item.anchorPoint == params.anchorPoint) {
      item.events = params.events
      item.openEvents = params.openEvents
      item.bodyButtons = params.bodyButtons
    }
  })
  definitionFormJSON()
}

function e_saveWidgetForm() {
  definitionFormJSON()
}

//保存单项编辑
function e_saveSignleEdit(info) {
  let newInfo = info.editTarget
  console.log(newInfo)
  const target = vm[info.editTarget];
  console.log(target)
  changeFormNode(target, info.params.anchorPoint, info.params)
  definitionFormJSON()
}

watch(() => listParamsList.value, (val) => {
  vm.listParamsList = val
}, {deep: true, immediate: true})
watch(() => bulletBox.value, (val) => {
  vm.bulletBox = val
}, {deep: true, immediate: true})

function changeFormNode(data, anchorPoint, params) {
  for (let i = 0; i < data.length; i++) {
    var node = data[i];
    if (node.anchorPoint === anchorPoint) {
      // 给节点添加新属性
      Object.assign(node, params);
    }

    if (node.formList) {
      // 递归遍历子节点
      changeFormNode(node.formList, anchorPoint, params);
    }
  }

}

function e_saveLogParams({params, events, editDataIndex}) {
  console.log('保存回填', params)
  console.log('保存回填', events)
  vm.showkevinLog = false
  eval(events)
  vm.$forceUpdate()
}

/**
 * @author Coder
 * @date 2023/3/23
 * @des 新增tab
 */
function e_addNewTab() {
  vm.$confirm('确定新增一个Tab页？').then(() => {
    let obj = {
      "tabTitle": "新Tab",
      "anchorPoint": "",
      "formList": [
        {
          "title": "新区域",
          "isHide": false,
          "formList": []
        }
      ]
    }
    listParamsList.value.push(obj)
    definitionFormJSON()
  })

}

/**
 * @author Coder
 * @date 2023/3/24
 * @des 新增弹框内容
 */
function e_addBulletBox() {
  vm.$confirm('确定新增加一个弹框吗？').then(() => {
    let params = {
      title: '新弹框',
      anchorPoint: 'newBullet',
      events: {},
      formList: [],
      "bodyButtons": [
        {
          "label": "确定",
          "events": "",
          "type": "primary"
        },
        {
          "label": "取消",
          "events": "that.e_close()"
        }
      ]
    }
    bulletBox.value.push(params)
  })
}

/**
 * @author Coder
 * @date 2023/3/24
 * @des 编辑弹框
 */
function e_editBulletBox(params, index) {

  vm.kevinLogWidget = params
  vm.showkevinLog = true
  nextTick(() => {
    vm.$refs.kevinLog.editInit(index, 'editBullet')
  })
}

let isLoad = ref(false)

function submit(saveFlag) {
  vm.$refs.form.validate(v => {
    if (v) {
      let events = this.listParamsList[0].passiveEvents.saveEntrust
      var that = vm
      new Function('that', 'saveFlag', events)(that, saveFlag)
    } else {
      this.$message.error('基本信息表单存在未填项，请填写')
      this.$refs.kevinForm.activeName = '0'
    }
  })
}

function setTitle(name) {
  title.value = name
}

function cancel() {
  showlog.value = false
  emit('close')
}

// 暴露组件的属性和方法
defineExpose({init, setTitle, queryForm, editInit});


</script>
<style scoped>

</style>
