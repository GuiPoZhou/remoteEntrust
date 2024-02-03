<template>
  <div>
    <bo-dialog :diaLogShow="dialogVisible" :isFullScreen="true" diaLogTitle="调查问卷" diaLogWidth="30%"
               @close="e_close">
      <template slot="bologbody">
        <div class="questionnairearea">
          <h1>{{ questionnaireInfo.templateName }}</h1>
          <span>有效期至：{{ questionnaireInfo.templateEndDate }}</span>
          <el-form ref="ruleForm" :model="ruleForm" class="demo-ruleForm" label-position="top"
                   label-width="130px">
            <div class="formarea">
              <div v-for="(v, i) in extendedData" :key="i" class="fa-list">
                <el-form-item :label="(i + 1) + '、' + v.title"
                              :rules="[{ required: true, message: '请输入内容', trigger: 'blur' }]">
                  <div v-if="v.type == 'radio'">
                    <el-radio-group v-model="v.value" :disabled="businessEnv=='detail'">
                      <el-radio v-for="(radioInfo, radioIndex) in v.extendedDataList"
                                :key="radioIndex" :label="radioInfo.value">{{ radioInfo.label }}
                      </el-radio>
                    </el-radio-group>
                  </div>
                  <div v-if="v.type == 'textarea'">
                    <el-input v-model="v.value" :disabled="businessEnv=='detail'" autosize
                              placeholder="请输入内容" type="textarea"></el-input>
                  </div>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
      </template>
      <template slot="bologfooter">
        <el-button v-if="businessEnv == 'add'" size="small" type="primary" @click="e_save">保存</el-button>
        <el-button size="small" @click="e_close">关闭</el-button>
      </template>
    </bo-dialog>
  </div>
</template>
<script>
export default {
  name: 'questionnaire',
  data() {
    return {
      dialogVisible: false,
      questionnaireInfo: {},
      extendedData: [],
      ruleForm: {},
      businessEnv: 'add'
    }
  },
  methods: {
    e_save() {
      this.$net('/v1/satisfactionSurvey/templateWrite', 'post', {
        templateId: this.questionnaireInfo.id,
        extendedData: JSON.stringify(this.extendedData)
      }).then(re => {
        if (re.code = 200) {
          this.$message.success('保存成功')
          this.dialogVisible = false
          this.$emit('save')
        } else {
          this.$message.error(re.msg)
        }
      })
    },
    init(questionnaireInfo) {
      this.questionnaireInfo = questionnaireInfo
      console.log('aa', JSON.parse(this.questionnaireInfo.extendedData))
      this.extendedData = JSON.parse(this.questionnaireInfo.extendedData)
      this.dialogVisible = true
    },
    editInit(questionnaireInfo, type = 'edit') {
      this.businessEnv = type
      this.questionnaireInfo = questionnaireInfo
      console.log('aa', JSON.parse(this.questionnaireInfo.extendedData))
      this.extendedData = JSON.parse(this.questionnaireInfo.extendedData)
      this.dialogVisible = true
    },
    e_close() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="less" scoped>
.questionnairearea {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .el-form {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .formarea {
      width: 50%;

      .fa-list {
        display: flex;
        flex-direction: column;
      }
    }
  }

}
</style>
