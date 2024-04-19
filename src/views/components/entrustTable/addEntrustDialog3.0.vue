<template>
  <div>
    <ml-dialog ref="mlDialog" :HasPermi="currentEnv == 'add'" :dia-log-show="showlog" :showEditDrag="true"
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
    <!--        选择检测项目-->
    <selectItem v-if="showselectItem" ref="selectItem" @cancel="showselectItem = false" @saveItem="e_saveItem"/>
    <!--    检测类型-->
    <DetectType v-if="showDetectType" :visible.sync="showDetectType" @cancel="closeType"
                @handleClick="backfillCategory"></DetectType>
    <!--        添加检测项目-->
    <AddTestItems v-if="showAddTestItems" ref="AddTestItems" @cancel="showAddTestItems = false"
                  @reload="addTestItemsReload"/>
    <selectOther v-show="showOtherItem" ref="selectItem2" @cancel="showOtherItem = false" @saveItem="e_saveItem"/>
    <!-- 选择人员分页 -->
    <SelectUserPage v-if="userPageShow" ref="usersPage" :showlog="userPageShow" @cancel="userPageShow = false"
                    @confirm="e_confirmSelUser"/>
    <!-- 选择人员 不分页 -->
    <SelectUserLog v-if="userShow" ref="users" :showlog="userShow" @cancel="userShow = false"
                   @confirm="e_confirmSelectUser"/>
    <!--    选择方案-->
    <selectScheme
        v-if="showSelectScheme"
        ref="selectScheme"
        :entrustPreId="form.id"
        :schemeWidgetId="schemeWidgetId"
        @close="showSelectScheme = false"
        @reload="selectSchemeReload"
    />
  </div>
</template>
<script setup>
import {useStore} from "vuex";

const store = useStore()
import moment from "moment"
import selectItem from '@/components/DetectSubItemManage/selectItem.vue'
import DetectType from '@/components/project/detectType.vue'
import SelectUserPage from '@/components/customerService/selectUserPage.vue'
import selectOther from '@/components/DetectHuaMiaoSubItemManage/selectItem.vue'
import selectScheme from "./selectScheme.vue";

let props = defineProps({
  itemBindType: Number,
  slotButtonInfo: {
    typeof: Object,
    default: () => {

    }
  },
})
let currentEnv = ref('add')
let businessConfigId = ref(null)
let showlog = ref(false)
let form = reactive({
  extData: {},
})

async function init(type, env) {
  console.log(env, 'env')
  currentEnv.value = env
  businessConfigId.value = type
  await getFormConfigData()
  getDept()
  showlog.value = true
  form.extData.entrustDate = moment().format('YYYY-MM-DD')
}

function getDept() {
  net('/v1/entrustRemoteAgreement/dept', 'get', {id: this.$store.state.user.user.userId}).then(res => {
    if (res.code === 200) {
      form.extData.deptName = res.data.deptName // 委托部门
      form.extData.deptId = res.data.deptId
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

defineExpose({
  init,
})
</script>


<style>
.ghost-read {
  background-color: blueviolet;
}
</style>
