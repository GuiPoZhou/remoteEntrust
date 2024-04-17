<template>
  <div class="fixedForm">
    <el-form ref="form" :model="form" class="demo-ruleForm" label-width="210px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="主表字段" prop="mainKey">
            <el-select v-model="mainKey" filterable placeholder="支持输入查询或者选择" @change="handleSelect">
              <el-option
                  v-for="item in mainTableParams"
                  :key="item.prop"
                  :label="item.label"
                  :value="item.prop">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :rules="[ { required: true, message: '请选择主表字段', trigger: 'change' }]"
                        label="表单项名称（label）"
                        prop="label">
            <el-input v-model="form.label"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :rules="[ { required: true, message: '请选择主表字段', trigger: 'change' }]"
                        label="表单项键名（prop）"
                        prop="prop">
            <el-input v-model="form.prop"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="输入提示（placeholder）" prop="placeholder">
            <el-input v-model="form.placeholder"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :rules="[ { required: true, message: '请输入表单项键名', trigger: 'change' }]"
                        label="表单项类型（component）"
                        prop="component">
            <el-select v-model="form.component">
              <el-option label="输入框(el-input)" value="el-input"></el-option>
              <el-option label="文本域(textarea)" value="textarea"></el-option>
              <el-option label="输入框(el-autocomplete)" value="el-autocomplete"></el-option>
              <el-option label="InputNumber计数器(el-input-number)" value="el-input-number"></el-option>
              <el-option label="Select选择器(el-select)" value="el-select"></el-option>
              <el-option label="DatePicker日期选择器(el-date-picker)" value="el-date-picker"></el-option>
              <el-option label="TimePicker时间选择器(el-time-select)" value="el-time-select"></el-option>
              <el-option label="Radio单选框(el-radio)" value="el-radio"></el-option>
              <el-option label="Switch开关(el-switch)" value="el-switch"></el-option>
              <el-option label="Checkbox多选框(el-checkbox)" value="el-checkbox"></el-option>
              <el-option label="Upload 上传(el-upload)" value="el-upload"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :rules="[ { required: true, message: '请输入表单项行内长度', trigger: 'blur' }]"
                        label="行内长度（el-col）"
                        prop="col">
            <el-input-number v-model="form.col" :max="24" :min="6" label="el-col span的值"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="校验规则（rules）" prop="col">
            <el-input v-model="rules" type="textarea"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Input事件脚本" prop="events.input">
            <el-input v-model="form.events.input" type="textarea"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Change事件脚本" prop="events.change">
            <el-input v-model="form.events.change" type="textarea"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item>
            <el-button size="small" type="success" @click="e_save">保存</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      form: {
        label: '',
        prop: '',
        type: 'fixed',
        "disabled": false,
        "anchorPoint": '',
        "isHide": false,
        col: 6,
        rules: [],
        events: {},
        options: {
          options: []
        }
      },
      rules: "[]",
      mainTableParams: [],
      mainKey: ''
    }
  },
  props: {
    mainTableTags: {
      typeof: String,
      default: 'ENTRUSTMENT_AGREEMENT'
    }
  },
  mounted() {
    this.e_getMainTableData()
  },
  methods: {
    e_save() {
      this.$refs.form.validate(e => {
        if (e) {
          try {
            let rules = eval(this.rules)
            if (Object.prototype.toString.call(rules) === '[object Array]') {
              this.form.rules = rules
            }
            this.form.anchorPoint = this.form.prop
            this.$emit('confirm', this.form)
          } catch {
            this.$message.error('请检查校验规则脚本的语法正确性')
          }


        }
      })
    },
    /**
     * @author Coder
     * @date 2023/4/21
     * @des 选择字段
     */
    handleSelect() {
      console.log('this.mainKey', this.mainKey)
      let keyInfo = this.mainTableParams.filter(item => {
        return item.prop == this.mainKey
      })
      this.form.label = keyInfo[0].label
      this.form.prop = keyInfo[0].prop
    },
    /**
     * @author Coder
     * @date 2023/4/20
     * @des 获取表固定字段
     */
    e_getMainTableData() {
      this.$net(`/dbConfig/getColumnInfoWithBusinessCode/${this.mainTableTags}`, 'get').then(re => {
        let list = re.data
        list.forEach(item => {
          let obj = {
            label: item.columnComment,
            prop: this.changeSamllHump(item.columnName, '_')
          }
          this.mainTableParams.push(obj)
        })
      })
    },
    /**
     * @author Coder
     * @date 2023/4/21
     * @des 将字符串转为转为小驼峰
     */
    changeSamllHump(str, tag) {
      var arr = str.split(tag);
      for (var i = 1; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
      }
      return arr.join("");
    }
  }
}
</script>
<style lang="less" scoped>
.fixedForm .el-select {
  width: 100%;
}

.fixedForm .el-input-number {
  width: 100% !important;
}
</style>
