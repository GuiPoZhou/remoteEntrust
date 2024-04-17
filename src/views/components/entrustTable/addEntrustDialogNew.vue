<template>
  <div>
    <BoDialog :diaLogShow="showKevinLog" :diaLogTitle="dialogTitle"
              :diaLogWidth="`${KevinJson.KevinWidget.width}%`" :fullScreen="KevinJson.KevinWidget.fullScreen" @close="e_close">
      <template slot="bologbody">
        <el-form ref="form" :form="form" :label-position="KevinJson.KevinWidget.formlabelPosition || 'top'" :model="form" class="demo-ruleForm"
                 label-width="100px">
          <el-row v-if="!nullKevinJson">
            <kevin-render ref="KevinRender" :Widget="renderWidget" :context="context" :editEnv="businessEnv"
                          :form="form"/>
          </el-row>
          <el-empty v-else :description="`请配置【${widgetId}】低码唯一键`"></el-empty>
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
import moment from "moment";

export default {
  name: "addDialog",
  data() {
    return {
      addShow: false,
      showKevinLog: false,
      fullScreen: false,
      dialogTitle: '',
      renderWidget: [],
      dialogFooterButtons: [],
      KevinJson: {
        KevinWidget: {}
      },
      nullKevinJson: false,
      context: this,
      form: {
        extData: {}
      },
      runKevinRender: false,
      widgetId: '', // 记得对应好低码唯一键
      businessEnv: 'add', //add 新增  edit 编辑   detail 详情
      container: null,
      showDept: false, // 选择单位
      cateShow: false,
      showSelectSubcontractor: false, //选择分包商
      localData: null, // 保存上一级传来的数据
    }
  },
  methods: {
    init(widgetId, data) {
      this.localData = data
      this.widgetId = widgetId
      this.showKevinLog = true
      this.e_getWidgetInfo()
    },
    async editInit(data, businessEnv = 'edit', widgetId) {
      this.localData = data
      this.businessEnv = businessEnv
      this.widgetId = widgetId
      this.showKevinLog = true
      await this.e_getWidgetInfo()
      new Function('ctx', '_this', 'mainTableRowData', this.KevinJson.KevinWidget.manuallyEvents.editProductinfo)(this.context, this.$refs.KevinRender, data)
    },
    async e_getWidgetInfo() {
      let re = await this.$net('/formLayout/v2/getFormLayoutConfig', 'get', {id: this.widgetId})
      try {
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
      } catch {
        this.nullKevinJson = true
      }

    },
    // 弹框底部动态按钮事件执行
    e_dialogButtonEvents(widgetInfo) {
      new Function('ctx', '_this', 'widgetInfo', widgetInfo.events)(this, this.$refs.KevinRender, widgetInfo)
      this.$forceUpdate()
    },
    // 执行动态表单自动执行脚本
    runWidgetAutoEvents(autoEvents) {
      if (autoEvents) {
        for (let key in autoEvents) {
          new Function('ctx', '_this', 'moment', autoEvents[key])(this, this.$refs.KevinRender, moment)
        }
      }
      this.form = {...this.form}
    },
    e_close() {
      this.$emit('close')
    },
    // pageOffice回调
    refreshReport(data) {
      console.log('refreshReport')
      console.log(1)
      new Function('ctx', '_this', 'data', this.KevinJson.KevinWidget.manuallyEvents.refreshReport)(this.context, this.$refs.KevinRender, data)

    },
    reload(data, events) {
      this.addShow = false
      new Function('ctx', '_this', 'data', this.KevinJson.KevinWidget.manuallyEvents[events])(this.context, this.$refs.KevinRender, data)
    },
  }
}
</script>

<style scoped>

</style>
