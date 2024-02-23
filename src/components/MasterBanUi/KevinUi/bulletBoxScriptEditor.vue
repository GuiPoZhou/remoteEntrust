<template>
  <div>
    <el-drawer :append-to-body="true" :close-on-press-escape="false" :visible.sync="showDrawer" :with-header="false"
               :wrapperClosable="false" size="95%">
      <div class="scriptallarea">
        <div class="sa-left">
          <el-divider content-position="left">弹框手动执行事件管理</el-divider>
          <el-button size="mini" style="margin-bottom: 4px;" type="primary"
                     @click="e_addClickEvents">新增手动执行脚本
          </el-button>
          <el-table :data="events" style="width: 100%">
            <el-table-column label="事件名称" prop="label">
            </el-table-column>
            <el-table-column label="事件脚本" prop="value" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="e_editClickEvents(scope)">编辑脚本</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-divider content-position="left">弹框自动执行事件管理</el-divider>
          <el-button size="mini" style="margin-bottom: 4px;" type="primary"
                     @click="e_addopenEvents">新增自动执行脚本
          </el-button>
          <el-table :data="openEvents" style="width: 100%">
            <el-table-column label="事件名称" prop="label">
            </el-table-column>
            <el-table-column label="事件脚本" prop="value" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="e_editOpenEvents(scope)">编辑脚本</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-divider content-position="left">弹框底部按钮管理</el-divider>
          <el-table :data="bodyButtons" style="width: 100%">
            <el-table-column label="按钮名称" prop="label">
            </el-table-column>
            <el-table-column label="按钮类型" prop="type">
              <template slot-scope="scope">
                <el-select v-model="scope.row.type">
                  <el-option label="主要按钮" value="primary"></el-option>
                  <el-option label="危险按钮" value="danger"></el-option>
                  <el-option label="信息按钮" value="warning"></el-option>
                  <el-option label="成功按钮" value="success"></el-option>
                </el-select>
              </template>

            </el-table-column>
            <el-table-column label="按钮事件" prop="events" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="e_editBodyButtonScript(scope)">编辑脚本</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-row style="margin-top: 2rem;">

            <el-col :span="24">
              <el-button size="small" type="success" @click="save">保存</el-button>
              <el-button size="small" @click="e_close">取消</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="sa-right">
          <KevinEditor ref="KevinEditor" :options="options" @input="handleEditorInput"/>
        </div>
      </div>

    </el-drawer>
  </div>
</template>
<script>
import Vue from 'vue'

export default {
  components: {},
  data() {
    return {
      showDrawer: false,
      options: {
        language: 'javascript'
      },
      codeValue: '',
      editTage: '',
      bodyButtons: [],
      activeName: 'events',
      activeNames: [],
      anchorPoint: 0,
      events: [],
      editBodyButtonIndex: null,
      clickEventsTableIndex: null,
      openEventsTableIndex: null,
      openEvents: [],
      currentCode: "",
      eventsName: '',
      key: ''
    }
  },
  methods: {
    handleEditorInput(value) {
      if (this.editTage == 'bodybuttonscript') {
        let bodyButtonInfo = this.bodyButtons[this.editBodyButtonIndex]
        bodyButtonInfo.events = this.formatCode(value)
        this.$set(this.bodyButtons, this.editBodyButtonIndex, bodyButtonInfo)
      } else if (this.editTage == 'clickEvents') {
        let clickEventsInfo = this.events[this.clickEventsTableIndex]
        clickEventsInfo.value = this.formatCode(value)
        this.$set(this.events, this.clickEventsTableIndex, clickEventsInfo)
      } else if (this.editTage == 'openEventsEdit') {
        let openEventsInfo = this.openEvents[this.openEventsTableIndex]
        openEventsInfo.value = this.formatCode(value)
        this.$set(this.openEvents, this.openEventsTableIndex, openEventsInfo)
      }
    },
    e_editOpenEvents(scope) {
      this.editTage = 'openEventsEdit'
      this.openEventsTableIndex = scope.$index
      this.$refs.KevinEditor.changeEditor({value: scope.row.value});
    },
    e_editClickEvents(scope) {
      this.editTage = 'clickEvents'
      this.clickEventsTableIndex = scope.$index
      this.$refs.KevinEditor.changeEditor({value: scope.row.value});
    },
    e_editBodyButtonScript(scope) {
      console.log('scope.row.events', scope.row.events)
      this.editTage = 'bodybuttonscript'
      this.editBodyButtonIndex = scope.$index
      this.$refs.KevinEditor.changeEditor({value: scope.row.events});
    },
    e_addopenEvents() {
      this.$prompt('请输入脚本名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'test',
      }).then(({value}) => {
        const regex = /^[a-zA-Z0-9_]+$/;
        if (regex.test(value)) {
          let labelList = this.openEvents.map(item => {
            return item.label
          })
          if (labelList.indexOf(value) == -1) {
            this.openEvents.push({label: value, value: "console.log('新增自动执行脚本')"})
            this.$forceUpdate()
          } else {
            this.$message.error('请勿重复命名')
          }

        } else {
          this.$message.error('输入内容必须符合javascript对象key的命名规范')
        }
      }).catch(_ => {

      })
    },
    e_addClickEvents() {
      this.$prompt('请输入脚本名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'test',
      }).then(({value}) => {
        const regex = /^[a-zA-Z0-9_]+$/;
        if (regex.test(value)) {
          let labelList = this.events.map(item => {
            return item.label
          })
          if (labelList.indexOf(value) == -1) {
            this.events.push({label: value, value: "console.log('新增手动执行脚本')"})
            this.$forceUpdate()
          } else {
            this.$message.error('请勿重复命名')
          }
        } else {
          this.$message.error('输入内容必须符合javascript对象key的命名规范')
        }
      }).catch(_ => {

      })
    },
    save() {
      let events = {}
      if (this.events.length != 0) {
        this.events.forEach(item => {
          events[item.label] = item.value
        })
      }
      let openEvents = {}
      if (this.openEvents.length != 0) {
        this.openEvents.forEach(item => {
          openEvents[item.label] = item.value
        })
      }
      let saveParams = {
        events: events,
        openEvents: openEvents,
        anchorPoint: this.anchorPoint,
        bodyButtons: this.bodyButtons
      }
      console.log('saveParams', saveParams)
      this.$emit('saveBulletBoxScript', saveParams)
    },
    e_clickCurrentCode(eventsName, code, key) {
      this.eventsName = eventsName
      this.currentCode = code
      this.key = key
      this.$refs.KevinEditor.changeEditor({value: code});
    },
    init(params) {
      console.log('params', params)
      this.showDrawer = true
      this.anchorPoint = params.anchorPoint
      // this.events = params.events
      if (JSON.stringify(params.events) == '{}' || !params.events) {
        this.events = []
      } else {
        let arr = []
        for (let key in params.events) {
          let obj = {
            label: key,
            value: params.events[key]
          }
          arr.push(obj)
        }
        this.events = arr
      }
      if (JSON.stringify(params.openEvents) == '{}' || !params.openEvents) {
        this.openEvents = []
      } else {
        let arr = []
        for (let key in params.openEvents) {
          let obj = {
            label: key,
            value: params.openEvents[key]
          }
          arr.push(obj)
        }
        this.openEvents = arr
      }
      this.bodyButtons = params.bodyButtons
      console.log(this.openEvents)
    },
    handleClick() {
      this.activeNames = []
      this.eventsName = ''
      this.key = ''
      // this.$refs.KevinEditor.changeEditor({ value: '' });
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
    handleCollapseChange(activeNames) {
      if (activeNames.length > 0) {
        this.activeNames = activeNames.slice(-1); // 只保留最后一个打开的项
      }
    },
    e_close() {
      this.$emit('close')
    }
  },
  created() {

  }
}
</script>
<style lang="less" scoped>
.scriptallarea {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: row;

  .sa-left {
    width: 30%;
    height: 100%;
    overflow: auto;
    padding: 0 1rem;
  }

  .sa-right {
    flex: 1;
    height: 100%;

    .remark {
      font-size: 16px;
      font-weight: bold;
      color: red;
      display: block;
      margin-bottom: 15px;
    }
  }

  .code-card__body {
    display: block;
    margin: 10px;
    cursor: pointer;
    padding: 10px;
    max-height: 13rem;
    border: 1px solid #ccc;
    border-radius: 1rem;
    overflow: hidden;
  }
}
</style>
