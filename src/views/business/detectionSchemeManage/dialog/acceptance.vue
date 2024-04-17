<template>
  <div>
    <BoDialog :diaLogShow="showKevinLog" :diaLogTitle="dialogTitle" :fullScreen="fullScreen" @close="e_close">
      <template slot="bologbody">
        <el-form ref="form" :form="form" :label-position="KevinJson.KevinWidget.formlabelPosition || 'top'" :model="form" class="demo-ruleForm"
                 label-width="100px">
          <el-row>
            <KevinRender ref="KevinRender" :Widget="renderWidget" :context="context" :form="form"/>
          </el-row>
        </el-form>
      </template>
      <template slot="bologfooter">
        <el-button v-for="(buttonInfo, buttonIndex) in dialogFooterButtons" :key="buttonIndex"
                   :loading="buttonInfo.isLoading" :size="buttonInfo.size"
                   :type="buttonInfo.type" @click="e_dialogButtonEvents(buttonInfo)">
          {{ buttonInfo.title }}
        </el-button>
      </template>
    </BoDialog>

  </div>
</template>

<script>


export default {
  data() {
    return {
      showSelectProduct: false,
      showDepartment: false,
      showSelsctInstrument: false,
      userShow: false,
      categoryShow: false,//选择检测类别
      showselectItem: false,//选择检测项目
      showKevinLog: false,
      fullScreen: false,
      dialogTitle: '',
      renderWidget: [],
      dialogFooterButtons: [],
      KevinJson: {
        KevinWidget: {}
      },
      context: this,
      form: {
        extData: {}
      },
      runKevinRender: false,
      businessEnv: 'add', //add 新增  edit 编辑   detail 详情
      container: null,
      accepttanceType: "",//验收类型
    }
  },
  props: {
    widgetId: {
      type: String,
      default: 'detectionSchemeManage_finishProductForm'// 记得对应好低码唯一键
    }
  },
  methods: {
    init() {
      this.showKevinLog = true
      this.e_getWidgetInfo()
    },
    async editInit(row, type) {
      this.businessEnv = type
      this.showKevinLog = true
      await this.e_getWidgetInfo()
      new Function('ctx', "_this", 'row', 'type', this.KevinJson.KevinWidget.manuallyEvents.getSchemeInfo)(this, this.$refs.KevinRender, row, type)
    },
    async e_getWidgetInfo() {
      let re = await this.$net('/formLayout/v2/getFormLayoutConfig', 'get', {id: this.widgetId})
      let formDataStr = re.data.configStr
      let resultDataStr = formDataStr.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      let info = JSON.parse(resultDataStr)
      let KevinJson = info.KevinJson
      this.KevinJson = KevinJson
      this.showKevinLog = true
      this.dialogTitle = KevinJson.KevinWidget.title
      this.renderWidget = KevinJson.KevinWidget.children
      KevinJson.KevinWidget.diaLogFooterButton.forEach(dfb => {
        if (!dfb.statusEvents || new Function('ctx', '_this', dfb.statusEvents)(this, this.$refs.KevinRender)) {
          this.dialogFooterButtons.push(dfb)
        }
      })
      this.fullScreen = true
      this.$nextTick(() => {
        this.runWidgetAutoEvents(KevinJson.KevinWidget.autoEvents)
        this.$refs.KevinRender.getWidgetServerData(this.renderWidget)
        this.container = this.$refs.KevinRender
      })
    },
    /**
     * @author Coder
     * @date 2023/3/30
     * @des 确定选择的检测项目
     */
    e_saveItem(params) {
      this.showselectItem = false
      new Function('ctx', '_this', 'params', this.KevinJson.KevinWidget.manuallyEvents.addItemData)(this, this.$refs.KevinRender, params)
    },
    /**
     * @author Coder
     * @date 2023/4/17
     * @des 确定选择的人员
     */
    e_confirmSelectUser(userInfo) {
      this.userShow = false
      new Function('ctx', '_this', 'userInfo', this.KevinJson.KevinWidget.manuallyEvents.SelectUser)(this, this.$refs.KevinRender, userInfo)
    },
    e_confirmSelectDepartment(departInfo) {
      this.showDepartment = false
      new Function('ctx', '_this', 'departInfo', this.KevinJson.KevinWidget.manuallyEvents.selectDepartment)(this, this.$refs.KevinRender, departInfo)
    },
    e_confirmSelectProduct(productInfo) {
      this.showSelectProduct = false
      new Function('ctx', '_this', 'productInfo', this.KevinJson.KevinWidget.manuallyEvents.SelectProduct)(this, this.$refs.KevinRender, productInfo)
    },
    e_confirmSelsctInstrument(selectedData) {
      this.showSelsctInstrument = false
      new Function('ctx', '_this', 'selectedData', this.KevinJson.KevinWidget.manuallyEvents.selectInstrument)(this, this.$refs.KevinRender, selectedData)
    },
    /**
     * @author Coder
     * @date 2023/4/6
     * @des 确认检测类别的信息
     */
    backfillCategory(data) {
      new Function('ctx', '_this', 'data', this.KevinJson.KevinWidget.manuallyEvents.selectItemData)(this, this.$refs.KevinRender, data)
    },
    // 添加检测项目回调
    addTestItemsReload(itemParams) {
      this.showAddTestItems = false
      eval(this.listParamsList[0].passiveEvents.appendItemTable)
    },
    // 弹框底部动态按钮事件执行
    e_dialogButtonEvents(widgetInfo) {
      new Function('ctx', '_this', 'widgetInfo', widgetInfo.events)(this, this.$refs.KevinRender, widgetInfo)
    },
    // 执行动态表单自动执行脚本
    runWidgetAutoEvents(autoEvents) {
      if (autoEvents) {
        for (let key in autoEvents) {
          new Function('ctx', '_this', autoEvents[key])(this, this.$refs.KevinRender)
        }
      }
      this.form = {...this.form}
    },
    e_close() {
      this.$emit('close')
    }
  }
}
</script>

<style></style>
