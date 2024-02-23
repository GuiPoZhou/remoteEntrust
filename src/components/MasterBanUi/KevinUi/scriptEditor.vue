<template>
  <div>
    <el-drawer :append-to-body="true" :close-on-press-escape="false" :visible.sync="showDrawer" :with-header="false"
               :wrapperClosable="false" size="95%">
      <div class="scriptallarea">
        <div class="sa-left">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="自动执行脚本(events)" name="events">
              <el-button size="mini" style="margin-bottom: 4px;" type="primary" @click="e_addAutoRun">新增自执行脚本
              </el-button>
              <el-collapse v-model="activeNames" @change="handleCollapseChange">
                <el-collapse-item v-for="(value, key) in events" :key="key" :name="key" :title="key">
                                    <span class="code-card__body" @click="e_clickCurrentCode('events', value, key)"> {{
                                        value
                                      }}</span>
                </el-collapse-item>

              </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="手动执行脚本(passiveEvents)" name="passiveEvents">
              <el-button size="mini" style="margin-bottom: 4px;" type="primary" @click="e_addPassiveEvents">
                新增手动执行脚本
              </el-button>

              <el-collapse v-model="activeNames" @change="handleCollapseChange">
                <el-collapse-item v-for="(value, key) in passiveEvents" :key="key" :name="key" :title="key">
                                    <span class="code-card__body"
                                          @click="e_clickCurrentCode('passiveEvents', value, key)">
                                        {{ value }}</span>
                </el-collapse-item>

              </el-collapse>
            </el-tab-pane>
          </el-tabs>

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
      activeName: 'events',
      activeNames: [],
      editTabIndex: 0,
      events: {},
      passiveEvents: {},
      currentCode: "",
      eventsName: '',
      key: ''
    }
  },
  methods: {
    e_addPassiveEvents() {
      this.$prompt('请输入脚本名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'test',
      }).then(({value}) => {
        const regex = /^[a-zA-Z0-9_]+$/;
        if (regex.test(value)) {
          if (!this.passiveEvents.hasOwnProperty(value)) {
            this.$set(this.passiveEvents, value, "console.log('新增手动执行脚本')")
          } else {
            this.$message.error('请勿重复命名')
          }

        } else {
          this.$message.error('输入内容必须符合javascript对象key的命名规范')
        }
      }).catch(_ => {

      })
    },
    e_addAutoRun() {
      this.$prompt('请输入脚本名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'test',
      }).then(({value}) => {
        const regex = /^[a-zA-Z0-9_]+$/;
        if (regex.test(value)) {
          if (!this.events.hasOwnProperty(value)) {
            this.$set(this.events, value, "console.log('新增自动执行脚本')")
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
      this.$emit('save', {events: this.events, passiveEvents: this.passiveEvents, tabIndex: this.editTabIndex})
    },
    e_clickCurrentCode(eventsName, code, key) {
      this.eventsName = eventsName
      this.currentCode = code
      this.key = key
      this.$refs.KevinEditor.changeEditor({value: code});
    },
    init(codeJson, index) {
      let tabInfo = JSON.parse(JSON.stringify(codeJson))
      this.events = tabInfo.events
      this.passiveEvents = tabInfo.passiveEvents
      this.editTabIndex = index
      this.showDrawer = true
    },
    handleClick() {
      this.activeNames = []
      this.eventsName = ''
      this.key = ''
      this.$refs.KevinEditor.changeEditor({value: ''});
    },
    handleEditorInput(value) {
      if (this.eventsName) {
        this[`${this.eventsName}`][`${this.key}`] = this.formatCode(value)
      }

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
