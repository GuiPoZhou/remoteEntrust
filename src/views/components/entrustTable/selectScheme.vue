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
    <!--    方案详情-->
    <acceptance
        ref="acceptance"
        v-if="showAcceptance"
        :widgetId="schemeWidgetId"
        @close="showAcceptance = false"
    />
  </div>
</template>

<script>
import acceptance from "@/views/business/detectionSchemeManage/dialog/acceptance.vue";

export default {
  components: {acceptance},
  props: {
    schemeWidgetId: String,
    entrustPreId: Number,
  },
  data() {
    return {
      showProjectVerification: false,
      showAcceptance: false,
      showKevinLog: false,
      fullScreen: false,
      dialogTitle: '',
      renderWidget: [],
      dialogFooterButtons: [],
      productTypeId: null,
      KevinJson: {
        KevinWidget: {}
      },
      context: this,
      form: {
        extData: {}
      },
      runKevinRender: false,
      container: null,
      widgetId: 'Association_Scheme_Component',
      mainTableData: {},
      selectData: {},
    }
  },
  methods: {
    getList() {
      if (this.KevinJson.KevinWidget.manuallyEvents.getList) {
        new Function('ctx', '_this', this.KevinJson.KevinWidget.manuallyEvents.getList)(this, this.$refs.KevinRender)
      } else {
        console.error('请配置表单手动执行脚本，并命名为 getList')
      }
    },
    init() {
      this.showKevinLog = true
      this.e_getWidgetInfo()
    },
    async editInit(row, businessEnv = 'edit') {
      this.mainTableData = row
      this.businessEnv = businessEnv
      this.showKevinLog = true
      await this.e_getWidgetInfo()
      new Function('ctx', '_this', 'mainTableData', this.KevinJson.KevinWidget.manuallyEvents.getEntrusInfo)(this, this.$refs.KevinRender, row)
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
    // 弹框底部动态按钮事件执行
    e_dialogButtonEvents(widgetInfo) {
      new Function('ctx', '_this', 'widgetInfo', widgetInfo.events)(this, this.$refs.KevinRender, widgetInfo)
      this.$forceUpdate()
    },
    // 执行动态表单自动执行脚本
    runWidgetAutoEvents(autoEvents) {
      if (autoEvents) {
        for (let key in autoEvents) {
          new Function('ctx', '_this', autoEvents[key])(this, this.$refs.KevinRender)
        }
      }
    },
    // 项目核查确定
    projectVerificationReload(params) {
      console.log(params);
      console.log(this.selectData);
      this.showProjectVerification = false
      new Function('ctx', '_this', 'params', 'selectData', this.KevinJson.KevinWidget.manuallyEvents.projectVerificationReload)(this, this.$refs.KevinRender, params, this.selectData)
    }
    ,
    e_close() {
      this.showKevinLog = false
      this.$emit('close')
    }
  }

}
</script>

<style></style>
