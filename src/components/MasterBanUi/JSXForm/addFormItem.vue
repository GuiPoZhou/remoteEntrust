<template>
  <ml-dialog ref="BoDislog" :dia-log-show="showlog" dia-log-title="引入字段" dia-log-width="50%" @close="e_close">
    <template slot="bologbody">
      <el-table
          ref="formJSONTable"
          :data="formJSON"
          style="width: 100%">
        <el-table-column
            align="center"
            label="表单标题"
            prop="label"
        >
        </el-table-column>
        <el-table-column
            align="center"
            label="表单类型"
            prop="type"
        >
        </el-table-column>
        <el-table-column
            align="center"
            label="参数Key"
            prop="keyName"
        >
        </el-table-column>
        <el-table-column
            align="center"
            label="所占行"
            prop="col"
        >
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.col" :max="24" :min="1" size="small"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="操作"
        >
          <template slot-scope="scope">
            <el-button v-if="checkKey(scope.row.keyName)" type="text" @click="e_selFormItem(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template slot="bologfooter">
      <el-button size="small" @click="e_close">关闭</el-button>
    </template>
  </ml-dialog>
</template>
<script>
export default {
  name: "addFormItem",
  data() {
    return {
      showlog: false,
      formJSON: [],
      currentlist: [],
      // 已支持的form类型
      configFormType: ['input', 'textarea', 'checkbox', 'radio', 'time', 'date', 'select', 'number'],
      paramsTypeList: [
        {
          label: '固定字段',
          value: 'fixed'
        },
        {
          label: '扩展字段',
          value: 'ext'
        }
      ]
    }
  },

  methods: {
    e_changeParamsType(e, index) {
      let obj = this.formJSON[index]
      obj.paramsType = e
      this.$set(this.formJSON, index, obj)
      this.$nextTick(() => {
        this.$refs.formJSONTable.doLayout()
        console.log(this.formJSON)
      })

    },
    init(list, currentlist) {
      this.formJSON = JSON.parse(JSON.stringify(list))
      this.showlog = true
      this.$refs.BoDislog.isFullScreen = false
      this.currentlist = currentlist

    },
    checkKey(prop) {
      let propList = this.currentlist.map(item => {
        return item.prop
      })
      if (propList.indexOf(prop) == -1) {
        return true
      } else {
        return false
      }
    },
    e_close() {
      this.$emit('close')
    },
    e_selFormItem(row) {
      if (this.configFormType.indexOf(row.type) == -1) {
        this.$message.warning('暂不支持该类型')
        return
      }
      let obj = {
        label: row.label,
        prop: row.keyName,
        type: 'ext',
        col: row.col,
        component: row.type,
        options: row.options
      }
      this.$emit('selFormItem', obj)
    }
  },
}
</script>
