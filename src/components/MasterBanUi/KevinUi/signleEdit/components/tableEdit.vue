<template>
  <el-form ref="signleParams" :model="signleParams" class="demo-ruleForm" label-width="120px">
    <el-row style="padding:1rem;">
      <el-col :span="6">
        <el-form-item
            :rules="[{ required: true, message: '此项若为空请在json编辑器中进行维护(且唯一)', trigger: 'blur' }]"
            label="单项唯一值"
            prop="anchorPoint">
          <el-input v-model="signleParams.anchorPoint" disabled></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row style="padding:0 2rem;">
      <el-col :span="24">

        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="主表格配置" name="first">
            <el-row>
              <el-col :span="12">
                <el-divider content-position="left">主表格操作列事件管理</el-divider>
                <el-button size="mini" style="margin: 5px 0;" type="primary"
                           @click="e_addMainTableActionButton">新增主表操作列按钮
                </el-button>
                <el-collapse v-model="mainTableActionActive" @change="e_changeMainTableActionCool">
                  <el-collapse-item v-for="(value, index) in signleParams.tableSlotButtons" :key="index"
                                    :name="index" :title="value.label">
                                        <span class="code-card__body"
                                              @click="e_clickMainTableActionEvents('mainAction', value.events, index)">
                                            {{
                                            value.events
                                          }}</span>
                  </el-collapse-item>
                </el-collapse>
                <el-divider content-position="left">主表格数据列管理</el-divider>

                <el-table :data="signleParams.tableColumns" height="400" style="width: 100%">
                  <el-table-column label="列名" prop="label">
                  </el-table-column>
                  <el-table-column label="参数key" prop="prop">
                  </el-table-column>
                  <el-table-column label="参数类型" prop="valueType">
                  </el-table-column>
                  <el-table-column label="参数类型" prop="valueType">
                  </el-table-column>
                  <el-table-column label="渲染类型" prop="editType">
                  </el-table-column>
                  <el-table-column label="事件" prop="slotRenderEvents" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button v-if="scope.row.slotRenderEvents" type="text"
                                 @click="e_editMainTableDataEvents(scope.row.slotRenderEvents, scope.$index)">编辑事件脚本
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-divider content-position="left">表格多选事件脚本管理</el-divider>
                <el-form-item label="表格多选事件脚本" prop="selectionChange">
                  <el-input v-model="signleParams.events.selectionChange" readonly>
                    <el-button slot="append" size="small" @click="e_editSelectionChange">编辑</el-button>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <KevinEditor ref="KevinEditorMain" :options="options" @input="e_inputMainTableEditor"/>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane v-if="signleParams.haveChild" label="子表格配置" name="second">
            <el-row>
              <el-col :span="12">
                <el-divider content-position="left">子表格操作列事件管理</el-divider>
                <el-button size="mini" style="margin: 5px 0;" type="primary"
                           @click="e_addSubTableActionButton">新增子表操作列按钮
                </el-button>
                <el-table :data="signleParams.childTableSlotButtons" height="400" style="width: 100%">
                  <el-table-column label="按钮名称" prop="label">
                  </el-table-column>
                  <el-table-column label="按钮是否禁用脚本" prop="actionStatusEvents" show-overflow-tooltip>
                    <template slot-scope="scope">
                                            <span
                                                :style="{ color: subTableScriptEditType == 'subStatus' && subTableScriptIndex == scope.$index ? '#409EFF' : '#000' }">{{
                                                scope.row.actionStatusEvents
                                              }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="按钮事件脚本" prop="events" show-overflow-tooltip>
                    <template slot-scope="scope">
                                            <span
                                                :style="{ color: subTableScriptEditType == 'subEvents' && subTableScriptIndex == scope.$index ? 'rebeccapurple' : '#000' }">{{
                                                scope.row.events
                                              }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="text"
                                 @click="e_editSubStatusScript(scope.row.actionStatusEvents, scope.$index)">编辑状态脚本
                      </el-button>
                      <el-button style="color: rebeccapurple;" type="text"
                                 @click="e_editSubTableEvents(scope.row.events, scope.$index)">编辑事件脚本
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
              <el-col :span="12">
                <KevinEditor v-if="activeName == 'second'" ref="KevinEditorSub" :options="options"
                             @input="e_inputSubTableEditor"/>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <el-row style="padding: 2rem;">
      <el-col :span=24>
        <el-button size="small" type="primary" @click="e_save">保存</el-button>
        <el-button size="small" @click="e_close">取消</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import Vue from 'vue'

export default {
  data() {
    return {
      options: {
        language: 'javascript'
      },
      activeName: 'first',
      signleParams: {},
      mainTableActionActive: [],
      mainEditorClickType: '',
      mainTableEditorActionIndex: null,
      mainTableDataActive: [],
      mainTableDataEventsIndex: null,
      subTableScriptEditType: '',
      subTableScriptIndex: null
    }
  },
  created() {

  },
  methods: {
    e_editSelectionChange() {
      this.mainEditorClickType = 'mainTableSelectionChange'
      this.$refs.KevinEditorMain.changeEditor({value: this.signleParams.events.selectionChange || ''})
    },
    e_addSubTableActionButton() {
      this.$prompt('请输入要新增的子表操作列按钮名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'test',
      }).then(({value}) => {
        let obj = {
          label: value,
          isHide: false,
          actionStatusEvents: 'return false',
          events: `console.log('新增的操作列按钮-${value}')`
        }
        this.signleParams.childTableSlotButtons.push(obj)
      }).catch(_ => {

      })
    },
    e_inputSubTableEditor(code) {
      let subButtonInfo = this.signleParams.childTableSlotButtons[this.subTableScriptIndex]
      if (this.subTableScriptEditType == 'subStatus') {
        subButtonInfo.actionStatusEvents = this.formatCode(code)
      } else if (this.subTableScriptEditType == 'subEvents') {
        subButtonInfo.events = this.formatCode(code)
      }
      this.$set(this.signleParams.childTableSlotButtons, this.subTableScriptIndex, subButtonInfo)
    },
    e_editSubTableEvents(code, index) {
      this.subTableScriptEditType = 'subEvents'
      this.subTableScriptIndex = index
      this.$refs.KevinEditorSub.changeEditor({value: code})
    },
    e_editSubStatusScript(code, index) {
      this.subTableScriptEditType = 'subStatus'
      this.subTableScriptIndex = index
      this.$refs.KevinEditorSub.changeEditor({value: code})
    },
    e_editMainTableDataEvents(code, index) {
      this.mainEditorClickType = 'mainData'
      this.mainTableDataEventsIndex = index
      this.$refs.KevinEditorMain.changeEditor({value: code})
    },
    e_addMainTableActionButton() {
      this.$prompt('请输入要新增的操作列按钮名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'test',
      }).then(({value}) => {
        let obj = {
          label: value,
          isHide: false,
          events: `console.log('新增的操作列按钮-${value}')`
        }
        this.signleParams.tableSlotButtons.push(obj)
      }).catch(_ => {

      })
    },
    e_inputMainTableEditor(code) {
      if (this.mainEditorClickType == 'mainAction') {
        let actionInfo = this.signleParams.tableSlotButtons[this.mainTableEditorActionIndex]
        actionInfo.events = this.formatCode(code)
        this.$set(this.signleParams.tableSlotButtons, this.mainTableEditorActionIndex, actionInfo)
      } else if (this.mainEditorClickType == 'mainData') {
        let dataInfo = this.signleParams.tableColumns[this.mainTableDataEventsIndex]
        dataInfo.slotRenderEvents = this.formatCode(code)
        this.$set(this.signleParams.tableColumns, this.mainTableDataEventsIndex, dataInfo)
      } else if (this.mainEditorClickType == 'mainTableSelectionChange') {
        let changeInfo = this.formatCode(code)
        this.signleParams.events.selectionChange = changeInfo
        this.$forceUpdate()
      }
    },
    e_clickMainTableActionEvents(editType, code, index) {
      this.mainEditorClickType = editType
      this.mainTableEditorActionIndex = index
      this.$refs.KevinEditorMain.changeEditor({value: code})
    },
    e_changeMainTableDataCool(activeNames) {
      if (activeNames.length > 0) {
        this.mainTableDataActive = activeNames.slice(-1); // 只保留最后一个打开的项
      }
    },
    e_changeMainTableActionCool(activeNames) {
      if (activeNames.length > 0) {
        this.mainTableActionActive = activeNames.slice(-1); // 只保留最后一个打开的项
      }
    },
    handleClick() {
      this.mainEditorClickType = ''
      this.mainTableDataEventsIndex = null
      this.subTableScriptEditType = ''
      this.subTableScriptIndex = null
    },
    appendParams(params) {
      console.log('params', params)
      this.signleParams = JSON.parse(JSON.stringify(params))
      if (!this.signleParams.events || !this.signleParams.events.selectionChange) {
        this.signleParams.events = {
          selectionChange: ''
        }
      }
    },
    e_save() {
      this.$refs.signleParams.validate(v => {
        if (v) {
          console.log('this.signleParams', this.signleParams)
          this.$emit('save', this.signleParams)
        }
      })
    },
    e_close() {
      this.$emit('close')
    },
    formatCode(code) {
      // 去除开头和结尾的空白字符
      code = code.trim();

      // 在大括号前后添加空格
      code = code.replace(/\s*{\s*/g, ' { ').replace(/\s*}\s*/g, ' } ');

      // 在逗号前后添加空格
      code = code.replace(/,(\S)/g, ', $1');

      // 返回格式化后的代码
      return code;
    },
  }
}
</script>
