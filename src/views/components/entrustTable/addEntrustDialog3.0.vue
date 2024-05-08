<template>
  <div>
    <ml-dialog ref="mlDialog" :HasPermi="currentEnv == 'add'" :diaLogShow="showlog" :showEditDrag="true" @open="init"
               dia-log-title="委托"
               @close="e_close"
               @confirmFormDesgin="definitionFormJSON">
      <template #bologbody>
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
                        <!-- <el-button text type="primary" @click="e_delteBulletBox(scope.$index)">删除弹框
                        </el-button> -->
                        <el-button text type="primary" @click="e_editBulletBox(scope.row, scope.$index)">
                          编辑弹框
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <el-button slot="reference" size="small" type="primary">弹框管理</el-button>
            </el-popover>
            <el-button size="small" type="warning"
                       @click="e_showAllBodyCode({ codeJson: listParamsList, index: -1, type: 'global' })">
              主体Code
            </el-button>
            <!-- <el-button type="warning" size="small"
                @click="e_showAllBodyCode({ codeJson: bulletBox, index: -1, type: 'box' })">弹框Code
            </el-button> -->
          </el-col>
        </el-row>
        <el-form ref="form" :model="form" label-position="top" label-width="120px">
          <kevin-form ref="kevinForm" :bolckFormParams="listParamsList" :bulletBox="bulletBox"
                      :businessConfigId="businessConfigId"
                      :form="form" :openEnv="currentEnv" @addBlockInTab="e_addBlockInTab"
                      @blockDeleteInTab="e_blockDeleteInTab" @editBlockForm="e_editBlockForm"
                      @saveBulletBoxScript="e_saveBulletBoxScript" @saveSignleEdit="e_saveSignleEdit"
                      @saveTabGlobalScript="e_saveTabGlobalScript" @saveWidgetForm="e_saveWidgetForm"
                      @tabClick="e_tabClick"/>
        </el-form>
      </template>
      <template slot="bologfooter">
        <!--        <el-button v-if="currentEnv != 'detail' && entrustPreId == null && entrustStatus <= 1" size="small"-->
        <!--                   type="warning" @click="e_save(2)">暂存</el-button>-->
        <el-button v-if="currentEnv != 'detail'" size="small" type="primary" @click="e_save(100)">保存</el-button>
        <el-button size="small" @click="e_close">取消</el-button>
      </template>
    </ml-dialog>
    <!--        弹框组件-->
    <kevin-log v-if="showkevinLog" ref="kevinLog" :businessConfigId="businessConfigId" :itemBindType="itemBindType"
               :openEnv="currentEnv" :widget-form="kevinLogWidget" @close="showkevinLog = false"
               @confirmFormDesgin="definitionFormJSON"
               @save="e_saveLogParams" @saveAddForm="e_saveKevinEdit"
               @saveBulletBoxScript="e_saveBulletBoxScript" @saveSignleEdit="e_saveSignleEdit"/>
    <!--    &lt;!&ndash;        选择检测项目&ndash;&gt;-->
    <!--    <selectItem v-if="showselectItem" ref="selectItem" @cancel="showselectItem = false" @saveItem="e_saveItem"/>-->
    <!--    &lt;!&ndash;    检测类型&ndash;&gt;-->
    <!--    <DetectType v-if="showDetectType" :visible.sync="showDetectType" @cancel="closeType"-->
    <!--                @handleClick="backfillCategory"></DetectType>-->
    <!--    &lt;!&ndash;        添加检测项目&ndash;&gt;-->
    <!--    <AddTestItems v-if="showAddTestItems" ref="AddTestItems" @cancel="showAddTestItems = false"-->
    <!--                  @reload="addTestItemsReload"/>-->
    <!--    <selectOther v-show="showOtherItem" ref="selectItem2" @cancel="showOtherItem = false" @saveItem="e_saveItem"/>-->
    <!--    &lt;!&ndash; 选择人员分页 &ndash;&gt;-->
    <!--    <SelectUserPage v-if="userPageShow" ref="usersPage" :showlog="userPageShow" @cancel="userPageShow = false"-->
    <!--                    @confirm="e_confirmSelUser"/>-->
    <!--    &lt;!&ndash; 选择人员 不分页 &ndash;&gt;-->
    <!--    <SelectUserLog v-if="userShow" ref="users" :showlog="userShow" @cancel="userShow = false"-->
    <!--                   @confirm="e_confirmSelectUser"/>-->
    <!--    &lt;!&ndash;    选择方案&ndash;&gt;-->
    <!--    <selectScheme-->
    <!--        v-if="showSelectScheme"-->
    <!--        ref="selectScheme"-->
    <!--        :entrustPreId="form.id"-->
    <!--        :schemeWidgetId="schemeWidgetId"-->
    <!--        @close="showSelectScheme = false"-->
    <!--        @reload="selectSchemeReload"-->
    <!--    />-->
  </div>
</template>
<script setup>
import {useStore} from "vuex";
import {net} from '@/api/requestList.js'
const store = useStore()
import moment from "moment"
import selectItem from '@/components/DetectSubItemManage/selectItem.vue'
import DetectType from '@/components/project/detectType.vue'
import SelectUserPage from '@/components/customerService/selectUserPage.vue'
import selectOther from '@/components/DetectHuaMiaoSubItemManage/selectItem.vue'
import selectScheme from "./selectScheme.vue";


const vm = getCurrentInstance().proxy
let EntrustThis = vm
onMounted(() => {

})
let props = defineProps({
  itemBindType: Number,
  slotButtonInfo: {
    typeof: Object,
    default: () => {

    }
  },
})
let currentEnv = ref(inject('env', 'add'))
let businessConfigId = ref(inject('businessId', null))
let showlog = ref(false)
let form = reactive({
  extData: {},
})
const emit = defineEmits(['close'])
async function init(type, env) {
  console.log(env, 'env')
  showlog.value = true
  await getFormConfigData()
  getDept()
  form.extData.entrustDate = moment().format('YYYY-MM-DD')
}

function getDept() {
  net('/v1/entrustRemoteAgreement/dept', 'get', {id: store.state.user.user.userId}).then(res => {
    if (res.code === 200 && res.data) {
      form.extData.deptName = res?.data.deptName // 委托部门
      form.extData.deptId = res?.data.deptId
    }
  })
}

let listParamsList = ref([])
let bulletBox = ref([])

async function getFormConfigData() {
  let re = await net(`/formLayout/getFormLayoutConfig?id=${businessConfigId.value}`, 'get')
  let formDataStr = re.data.formLayoutConfigStr || '{}'
  let resultDataStr = formDataStr.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  let fromData = JSON.parse(resultDataStr)
  listParamsList.value = fromData.listParamsList || []
  bulletBox.value = fromData.bulletBox || []
  e_getWidgetServerData()
  e_doFormConfigEvents()
  // let targetAttribute = EntrustThis.getNode(EntrustThis.listParamsList, 'formList', 'anchorPoint', 'sampleInfo');
  // targetAttribute.tableData[0].sendSampleCount = 456
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
  store.commit('set_listParamsList', listParamsList.value)
  store.commit('set_bulletBox', bulletBox.value)
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
 * @date 2023/3/30
 * @des 保存表单布局配置
 */
function definitionFormJSON() {
  process.env.NODE_ENV === "production" ? doSaveFormJsonByPwd() : doSaveFormJSON()
}

let confirmPwd = ref('kevinform')

function doSaveFormJsonByPwd() {
  ElMessageBox.prompt('请输入密码', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputType: 'password',
  }).then(({value}) => {
    // 成功之后的回调
    if (value == confirmPwd.value) {
      doSaveFormJSON()
    } else {
      ElMessage.error('操作密码错误')
      MlDialogThis.closeDrag = false
    }
  }).catch(_ => {
    MlDialogThis.closeDrag = false
  })
}

// 保存表单配置
function doSaveFormJSON() {
  let listParamsListCopy = JSON.parse(JSON.stringify(listParamsList.value))
  listParamsListCopy.forEach(tabInfo => {
    tabInfo.formList.forEach(blockInfo => {
      blockInfo.formList.forEach(formInfo => {
        if (formInfo.component == 'el-table') {
          formInfo.tableData = []
          formInfo.tableSelections = []
        }
      })
    })
  })
  let bulletBoxCopy = JSON.parse(JSON.stringify(bulletBox.value))
  bulletBoxCopy.forEach(bulletInfo => {
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
      listParamsList: listParamsList.value,
      bulletBox: bulletBox.value
    }
  }
  let formLayoutConfigStr = JSON.stringify(saveParams)
  let resultStr = formLayoutConfigStr.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  console.log(JSON.parse(resultStr))
  net('/formLayout/saveFormLayoutConfig', 'post', JSON.parse(resultStr)).then(re => {
    if (re.code == 200) {
      ElMessage.success('保存成功')
      e_getWidgetServerData()
      store.commit('set_closeDrag', true)
      vm.$refs.mlDialog.closeDrag = true
      store.commit('set_listParamsList', listParamsList.value)
      store.commit('set_bulletBox', bulletBox.value)
      MlDialogThis.closeDrag = true
    }
  })
}
/**
 * @author Coder
 * @date 2023/4/3
 * @des 动态执行在最外层的脚本
 */
function e_doFormConfigEvents() {
  listParamsList.value.forEach((tabInfo, tabIndex) => {
    if (tabInfo.events) {
      for (let key in tabInfo.events) {
        eval(tabInfo.events[key])
      }
    }
  })
}

/**
 * @author Coder
 * @date 2023/3/23
 * @des 新增tab
 */
function e_addNewTab() {
  ElMessageBox.confirm('确定新增一个Tab页？').then(() => {
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
  ElMessageBox.confirm('确定新增加一个弹框吗？').then(() => {
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
let showKevinLog = ref(false)
let kevinLogWidget = ref(null)

function e_editBulletBox(params, index) {
  kevinLogWidget.value = params
  showKevinLog.value = true
  nextTick(() => {
    vm.$refs.kevinLog.editInit(index, 'editBullet')
  })
}

/**
 * @author Coder
 * @date 2023/3/24
 * @des 查看全局code
 */
function e_showAllBodyCode(params) {
  vm.$refs.kevinForm.e_showKevinFormEditor(params)
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
 * @des 删除选择的区域 逻辑删除
 */
function e_blockDeleteInTab({tabIndex, blockIndex}) {
  listParamsList.value[tabIndex].formList[blockIndex].isHide = true
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
    listParamsList.value[params['index']] = params.codeJson
    // this.$set(this.listParamsList, params['index'], params.codeJson)
  } else if (params.type == 'block') {
    let tabInfo = listParamsList.value[params['parentIndex']]
    tabInfo.formList[params['index']] = params.codeJson
    listParamsList.value[params['parentIndex']] = tabInfo
    // this.$set(this.listParamsList, params['parentIndex'], tabInfo)
  } else if (params.type == 'box') {
    // this.bulletBox = params.codeJson
    bulletBox.value = params.codeJson
  }
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

//保存单项编辑
function e_saveSignleEdit(info) {
  changeFormNode([info.editTarget].value, info.params.anchorPoint, info.params)
  definitionFormJSON()
}

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

function e_saveTabGlobalScript(params) {
  listParamsList.value[params.tabIndex].events = params.events
  listParamsList.value[params.tabIndex].passiveEvents = params.passiveEvents
  definitionFormJSON()
}

/**
 * @author Coder
 * @date 2023/3/23
 * @des 保存对区域内进行新增form项
 */
function e_saveWidgetForm() {
  definitionFormJSON()
}

/**
 * @author Coder
 * @date 2023/3/27
 * @des 点击tab
 */
let activeName = ref('0')

function e_tabClick(e) {
  activeName.value = e
  let tableEventsInfo = listParamsList.value[0].tabClickEvents
  console.log('tableEventsInfo', tableEventsInfo)
  tableEventsInfo && tableEventsInfo.appendSubSampleDetail ? eval(tableEventsInfo.appendSubSampleDetail) : ''
}

let showkevinLog = ref(false)


function e_close() {
  emit('close')
  store.commit('set_closeDrag', true)
}
defineExpose({
  init,
})
</script>


<style>
.ghost-read {
  background-color: blueviolet;
}
</style>
