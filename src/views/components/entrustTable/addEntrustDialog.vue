<template>
  <div>
    <ml-dialog ref="mlDialog" :HasPermi="currentEnv == 'add'" :dia-log-show="showlog" :showEditDrag="true" dia-log-title="委托"
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
          <kevin-form ref="kevinForm" :bolckFormParams="listParamsList" :bulletBox="bulletBox" :businessConfigId="businessConfigId"
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

<script>
import moment from "moment"
import selectItem from '@/components/DetectSubItemManage/selectItem.vue'
import DetectType from '@/components/project/detectType.vue'
import SelectUserPage from '@/components/customerService/selectUserPage.vue'
import selectOther from '@/components/DetectHuaMiaoSubItemManage/selectItem.vue'
import selectScheme from "./selectScheme.vue";
export default {
  data() {
    return {
      schemeWidgetId: null,
      showSelectScheme: false,
      showOtherItem: false,
      showDetectType: false,
      entrustRowInfo: {},
      showPhoninexPersonSelect: false,
      showsendBack: false,
      userPageShow: false,
      userShow: false,
      showAddTestItems: false,
      categoryShow: false,//选择检测类别
      activeName: '0',//当前活动的tab
      showselectItem: false,//选择检测项目
      showkevinLog: false,
      kevinLogWidget: null,
      showType: 'add',
      showlog: false,
      showeditFormItem: false,
      showcodeEditor: false,
      form: {
        customerName: '',
        customerAddress: '',
        detectedDeptName: '',
        contactId: null,
        contact: '',
        companyPhone: '',
        extData: {}
      },
      listParamsList: [],
      bulletBox: [],
      businessConfigId: undefined,
      currentEnv: 'detail',//当前运行环境  表单区分 新增add  编辑 edit  查看/详情 detail
      listData: [],
      detectCategoryArr: [],
      confirmPwd: 'kevinform',
      entrustStatus: -1,
      entrustPreId: null
    }
  },
  created() {
    window.EntrustThis = this
    window.KevinLogThis = this
    this.$store.commit('set_entrustthis', this)
  },
  async mounted() {
  },
  components: {
    selectItem,
    DetectType,
    SelectUserPage,
    selectOther,
    selectScheme,
  },
  props: {
    itemBindType: Number,
    slotButtonInfo: {
      typeof: Object,
      default: () => {

      }
    },
  },
  methods: {
    //保存单项编辑
    e_saveSignleEdit(info) {
      this.changeFormNode(this[info.editTarget], info.params.anchorPoint, info.params)
      this.definitionFormJSON()
    },
    changeFormNode(data, anchorPoint, params) {
      for (let i = 0; i < data.length; i++) {
        var node = data[i];
        if (node.anchorPoint === anchorPoint) {
          // 给节点添加新属性
          Object.assign(node, params);
        }

        if (node.formList) {
          // 递归遍历子节点
          this.changeFormNode(node.formList, anchorPoint, params);
        }
      }

    },
    e_saveTabGlobalScript(params) {
      this.listParamsList[params.tabIndex].events = params.events
      this.listParamsList[params.tabIndex].passiveEvents = params.passiveEvents
      this.definitionFormJSON()
    },
    e_saveBulletBoxScript(params) {
      this.bulletBox.forEach(item => {
        if (item.anchorPoint == params.anchorPoint) {
          item.events = params.events
          item.openEvents = params.openEvents
          item.bodyButtons = params.bodyButtons
        }
      })
      this.definitionFormJSON()
    },
    // 菲尼克斯人员选择确定
    confirmPhoninexPersonSelect(userInfo, callbackEvents) {
      this.showPhoninexPersonSelect = false
      var that = this
      new Function('that', 'userInfo', callbackEvents)(that, userInfo)
      this.form = {...this.form}
    },
    e_sendBackReload() {
      this.showlog = false
      this.$emit('saveReload')
    },
    //底部扩展按钮事件
    e_footerSlotEvents(events) {
      eval(events)
    },
    //底部扩展按钮状态
    checkFooterSlotButtonStatus(statusEvents) {
      return eval(statusEvents)
    },
    //选择人员
    e_confirmSelUser(userInfo, callbackEvents) {
      this.userPageShow = false
      var that = this
      new Function('that', 'userInfo', callbackEvents)(that, userInfo)
      this.form = {...this.form}
    },
    /**
     * @author Coder
     * @date 2023/4/17
     * @des 确定选择的人员
     */
    e_confirmSelectUser(userInfo) {
      this.userShow = false
      var that = this
      if (sessionStorage.getItem('callBackUserInfo')) {
        let events = sessionStorage.getItem('callBackUserInfo')
        eval(events)
        // console.log('userInfo',userInfo)
        // new Function('that', 'userInfo', events)(that, userInfo)
        this.form = {...this.form}
      }
    },
    /**
     * @author Coder
     * @date 2023/4/7
     * @des 确定弹框传递过来的数据
     */
    e_saveLogParams({params, events, editDataIndex}) {
      console.log('保存回填', params)
      this.showkevinLog = false
      eval(events)
      this.$forceUpdate()
    },
    /**
     * @author Coder
     * @date 2023/4/6
     * @des 确认检测类别的信息
     */
    backfillCategory(data) {
      this.form.detectType = data.id;
      this.$store.commit('set_detectType', data.id);
      this.$store.commit('set_detectName', data.detectName);
      let anchorInfo = this.getNode(
          this.listParamsList,
          'formList',
          'anchorPoint',
          'itemTable'
      );
      this.showOtherItem = true;
      console.log(this.$refs)
      this.$nextTick(() => {
        this.$refs.selectItem2.initItemList(
            this.$store.state.BeiYuan.detectType,
            JSON.parse(JSON.stringify(anchorInfo.tableData)),
            []
        );
      });

    },
    // 添加检测项目回调
    addTestItemsReload(itemParams) {
      this.showAddTestItems = false
      eval(this.listParamsList[0].passiveEvents.appendItemTable)
    },
    /**
     * @author Coder
     * @date 2023/4/6
     * @des 弹起选择检测类别弹框
     */
    e_openCategory() {
      this.categoryShow = true
    },
    /**
     * @author Coder
     * @date 2023/3/30
     * @des 保存委托 此处根据业务类型配置的检测项目分为 itemBindType （编码样品：3、委托样品：2、仅委托：1）  三种不同的方式对应不同的接口（新增、编辑、查询详情都不同）
     */
    e_save(saveFlag) {
      this.$refs.form.validate(v => {
        if (v) {
          let events = this.listParamsList[0].passiveEvents.saveEntrust
          var that = this
          new Function('that', 'saveFlag', events)(that, saveFlag)
        } else {
          this.$message.error('基本信息表单存在未填项，请填写')
          this.$refs.kevinForm.activeName = '0'
        }
      })

    },
    /**
     * @author Coder
     * @date 2023/4/4
     * @des 获取检测项目
     */
    getItemList() {
      let anchorPointInfo = this.getNode(this.listParamsList, 'formList', 'anchorPoint', 'detectItemTable')
      return anchorPointInfo.tableData
    },
    /**
     * @author Coder
     * @date 2023/3/30
     * @des 确定选择的检测项目
     */
    e_saveItem(params) {
      console.log(params)
      this.showselectItem = false
      console.log(this.$store)
      params.map(item => {
        item.detectNames = item.voListZ.map(item => item.itemName).join(',')
      })
      // eval(this.kevinLogWidget.appendItemTable(params))
      let anchorInfo = this.getNode(this.listParamsList, 'formList', 'anchorPoint', 'itemTable')
      console.log(anchorInfo)
      anchorInfo.tableData = JSON.parse(JSON.stringify(params))

      this.$forceUpdate()
    },
    /**
     * @author Coder
     * @date 2023/3/30
     * @des 唤起选择检测项目弹框
     */
    e_openSelectItem() {
      let anchorInfo = EntrustThis.getNode(EntrustThis.listParamsList, 'formList', 'anchorPoint', 'detectItemTable');
      let selectedItems = anchorInfo.tableData;
      EntrustThis.showselectItem = true;
      EntrustThis.$nextTick(() => {
        EntrustThis.$refs.selectItem.initItemList(selectedItems);
        EntrustThis.$store.commit('set_detectType', '');
      })
      this.$forceUpdate()
    },
    /**
     * @author Coder
     * @date 2023/3/28
     * @des 快速查询目标节点
     */
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
    },
    selectSchemeReload(params, selectData) {
      this.showSelectScheme = false
      new Function('ctx', 'params', 'selectData', this.listParamsList[0].passiveEvents.selectSchemeReload)(this, params, selectData)
    },
    /**
     * @author Coder
     * @date 2023/3/27
     * @des 点击tab
     */
    e_tabClick(activeName) {
      this.activeName = activeName
      let tableEventsInfo = this.listParamsList[0].tabClickEvents
      console.log('tableEventsInfo', tableEventsInfo)
      tableEventsInfo && tableEventsInfo.appendSubSampleDetail ? eval(tableEventsInfo.appendSubSampleDetail) : ''
    },
    /**
     * @author Coder
     * @date 2023/4/3
     * @des 动态执行在最外层的脚本
     */
    e_doFormConfigEvents() {
      // this.listParamsList.forEach((tabInfo, tabIndex) => {
      //     if (tabInfo.events) {
      //         for (let key in tabInfo.events) {
      //             eval(tabInfo.events[key])
      //         }
      //     }
      // })
    },
    /**
     * @author Coder
     * @date 2023/3/25
     * @des 获取动态form中的接口数据
     */
    e_getWidgetServerData() {
      this.listParamsList.forEach(tabInfo => {
        tabInfo.formList.forEach(blockInfo => {
          blockInfo.formList.forEach(item => {
            this.e_getFormOptions(item)
          })
        })
      })
      this.bulletBox.forEach(blockInfo => {
        blockInfo.formList.forEach(item => {
          this.e_getFormOptions(item)
        })
      })
      this.$store.commit('set_listParamsList', this.listParamsList)
      this.$store.commit('set_bulletBox', this.bulletBox)
    },
    async e_getFormOptions(item) {
      let componentList = ['el-select', 'select', 'el-radio', 'radio', 'checkbox', 'el-checkbox', 'el-cascader']
      if (componentList.indexOf(item.component) != -1) {
        if (item.options.dynamicGetUrl) {
          item.options.options = []
          let re = await this.$net(item.options.dynamicGetUrl, 'get')
          let dataRouse = re.rows || re.data.list || re.data
          dataRouse.forEach(ii => {
            let obj = {
              label: ii[item.options.dynamicGetValue],
              value: ii[item.options.dynamicGetKey] * 1,
              children: ii[item.options.dynamicGetChildren ? item.options.dynamicGetChildren : 'children']
            }
            if (componentList.indexOf('el-cascader') != -1) {
              obj?.children.map(iteme => {
                iteme.label = iteme[item.options.dynamicGetValue]
                iteme.value = iteme[item.options.dynamicGetKey]
              })
              obj?.children?.children?.map(item3 => {
                item3.label = item3[item.options.dynamicGetValue]
                item3.value = item3[item.options.dynamicGetKey]
              })
            }

            item.options.options.push(obj)
          })
        }
      }
    },
    /**
     * @author Coder
     * @date 2023/3/24
     * @des 保存弹框的编辑
     */
    e_saveKevinEdit(editParams) {
      let obj = this.bulletBox[editParams.index]
      obj = editParams.params
      this.kevinLogWidget = obj
      this.$set(this.bulletBox, editParams.index, obj)
      this.definitionFormJSON()
    },
    /**
     * @author Coder
     * @date 2023/3/24
     * @des 编辑弹框
     */
    e_editBulletBox(params, index) {

      this.kevinLogWidget = params
      this.showkevinLog = true
      this.$nextTick(() => {
        this.$refs.kevinLog.editInit(index, 'editBullet')
      })
    },
    /**
     * @author Coder
     * @date 2023/3/24
     * @des 查看全局code
     */
    e_showAllBodyCode(params) {
      this.$refs.kevinForm.e_showKevinFormEditor(params)
    },
    /**
     * @author Coder
     * @date 2023/3/24
     * @des 新增弹框内容
     */
    e_addBulletBox() {
      this.$confirm('确定新增加一个弹框吗？').then(() => {
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
        this.bulletBox.push(params)
      })
    },
    /**
     * @author Coder
     * @date 2023/3/24
     * @des 删除弹框
     */
    e_delteBulletBox(index) {
      this.$confirm('确定删除该弹框吗？').then(() => {
        this.bulletBox.splice(index, 1)
      })
    },
    /**
     * @author Coder
     * @date 2023/3/23
     * @des 保存对区域内进行新增form项
     */
    e_saveWidgetForm() {
      this.definitionFormJSON()
    },
    /**
     * @author Coder
     * @date 2023/3/23
     * @des 新增tab
     */
    e_addNewTab() {
      this.$confirm('确定新增一个Tab页？').then(() => {
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
        this.listParamsList.push(obj)
        this.definitionFormJSON()
      })

    },
    /**
     * @author Coder
     * @date 2023/3/23
     * @des 删除选择的区域 逻辑删除
     */
    e_blockDeleteInTab({tabIndex, blockIndex}) {
      this.listParamsList[tabIndex].formList[blockIndex].isHide = true
      this.definitionFormJSON()
    },
    /**
     * @author Coder
     * @date 2023/3/23
     * @des 在tab下新增区域
     */
    e_addBlockInTab(tabIndex) {
      let params = {
        "title": "我是新增区域",
        "anchorPoint": "",
        "isHide": false,
        "formList": [],
        "events": {}
      }
      this.listParamsList[tabIndex].formList.push(params)
      this.definitionFormJSON()
    },
    /**
     * @author Coder
     * @date 2023/3/23
     * @des 获取form
     */
    e_editBlockForm(params) {
      if (params.type == 'global') {
        this.listParamsList = params.codeJson
      } else if (params.type == 'tab') {
        this.$set(this.listParamsList, params['index'], params.codeJson)
      } else if (params.type == 'block') {
        let tabInfo = this.listParamsList[params['parentIndex']]
        tabInfo.formList[params['index']] = params.codeJson
        this.$set(this.listParamsList, params['parentIndex'], tabInfo)
      } else if (params.type == 'box') {
        this.bulletBox = params.codeJson
      }
      this.definitionFormJSON()
    },
    async getFormConfigData() {
      let re = await this.$net(`/formLayout/getFormLayoutConfig?id=${this.businessConfigId}`, 'get')
      // this.listParamsList = re.data.formLayoutConfig.listParamsList || []
      // this.bulletBox = re.data.formLayoutConfig.bulletBox || []

      let formDataStr = re.data.formLayoutConfigStr || '{}'
      let resultDataStr = formDataStr.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      let fromData = JSON.parse(resultDataStr)
      this.listParamsList = fromData.listParamsList || []
      this.bulletBox = fromData.bulletBox || []
      this.e_getWidgetServerData()
      this.e_doFormConfigEvents()
      // let targetAttribute = EntrustThis.getNode(EntrustThis.listParamsList, 'formList', 'anchorPoint', 'sampleInfo');
      // targetAttribute.tableData[0].sendSampleCount = 456
    },
    /**
     * @author Coder
     * @date 2023/3/30
     * @des 保存表单布局配置
     */
    definitionFormJSON() {
      process.env.NODE_ENV === "production" ? this.doSaveFormJsonByPwd() : this.doSaveFormJSON()
    },
    doSaveFormJsonByPwd() {
      this.$prompt('请输入密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'password',
      }).then(({value}) => {
        // 成功之后的回调
        if (value == this.confirmPwd) {
          this.doSaveFormJSON()
        } else {
          this.$message.error('操作密码错误')
          MlDialogThis.closeDrag = false
        }
      }).catch(_ => {
        MlDialogThis.closeDrag = false
      })
    },
    // 保存表单配置
    doSaveFormJSON() {
      let listParamsList = JSON.parse(JSON.stringify(this.listParamsList))
      listParamsList.forEach(tabInfo => {
        tabInfo.formList.forEach(blockInfo => {
          blockInfo.formList.forEach(formInfo => {
            if (formInfo.component == 'el-table') {
              formInfo.tableData = []
              formInfo.tableSelections = []
            }
          })
        })
      })
      let bulletBox = JSON.parse(JSON.stringify(this.bulletBox))
      bulletBox.forEach(bulletInfo => {
        bulletInfo.formList.forEach(blockInfo => {
          if (blockInfo.component == 'el-table') {
            blockInfo.tableData = []
            blockInfo.tableSelections = []
          }
        })
      })
      let saveParams = {
        id: this.businessConfigId,
        formLayoutConfig: {
          listParamsList: listParamsList,
          bulletBox: bulletBox
        }
      }
      let formLayoutConfigStr = JSON.stringify(saveParams)
      let resultStr = formLayoutConfigStr.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      console.log(JSON.parse(resultStr))
      this.$net('/formLayout/saveFormLayoutConfig', 'post', JSON.parse(resultStr)).then(re => {
        if (re.code == 200) {
          this.$message.success('保存成功')
          this.e_getWidgetServerData()
          this.$store.commit('set_closeDrag', true)
          this.$refs.mlDialog.closeDrag = true
          this.$store.commit('set_listParamsList', listParamsList)
          this.$store.commit('set_bulletBox', bulletBox)
          MlDialogThis.closeDrag = true
        }
      })
    },
    e_close() {
      this.$emit('close')
      this.$store.commit('set_closeDrag', true)
    },
    /**
     * @author Coder
     * @date 2023/4/6
     * @des 新增打开
     */
    async init(type, env) {
      console.log(env, 'env')
      this.currentEnv = env
      this.businessConfigId = type
      await this.getFormConfigData()
      this.showlog = true
      this.getDept()
      this.form.extData.entrustDate = moment().format('YYYY-MM-DD')
      this.$forceUpdate()
    },
    getDept() {
      this.$net('/v1/entrustRemoteAgreement/dept', 'get', {id: this.$store.state.user.user.userId}).then(res => {
        if (res.code === 200) {
          this.form.extData.deptName = res.data.deptName // 委托部门
          this.form.extData.deptId = res.data.deptId
        }
      })
    },
    /**
     * @author Coder
     * @date 2023/4/6
     * @des 编辑或者查看详情打开
     */
    async editInit(id, row, openType, entrustStatus = -1) {
      this.entrustRowInfo = JSON.parse(JSON.stringify(row))
      this.entrustPreId = row?.entrustPreId
      this.businessConfigId = id
      this.currentEnv = openType
      await this.getFormConfigData()
      await this.e_getEntrustInfo(row.id)

      this.showlog = true
      this.$forceUpdate()
    },
    /**
     * @author Coder
     * @date 2023/4/6
     * @des 查询委托详情
     */
    async e_getEntrustInfo(id) {
      console.log(id)
      let events = this.listParamsList[0].passiveEvents.entrustInfo
      var that = this
      new Function('that', 'id', events)(that, id)
    },
    closeType() {
      console.log('关闭1')
      this.showDetectType = false
    }
  }
}
</script>

<style>
.ghost-read {
  background-color: blueviolet;
}
</style>
