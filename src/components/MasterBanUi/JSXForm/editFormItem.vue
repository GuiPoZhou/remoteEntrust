<template>
  <ml-dialog :dia-log-show="showlog" dia-log-title="编辑表单项" dia-log-width="50%" @close="e_close">
    <template slot="bologbody">
      <el-table :data="list" style="width: 100%">
        <el-table-column align="center" label="表单标题" prop="label">
          <template v-slot="scope">
            <el-input v-model="scope.row.label"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" label="表单key" prop="prop">
        </el-table-column>
        <el-table-column align="center" label="所占行" prop="col">
          <template v-slot="scope">
            <el-input-number v-model="scope.row.col" :max="24" :min="1" size="small"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <!--                <el-button type="text">删除</el-button>-->
        </el-table-column>
      </el-table>
    </template>
    <template slot="bologfooter">
      <el-button size="small" type="primary" @click="e_confirm">确定</el-button>
      <el-button size="small" @click="e_close">取消</el-button>
    </template>

  </ml-dialog>
</template>
<script>
export default {
  name: 'ml-edit',
  data() {
    return {
      showlog: false,
      list: [],
      listLabel: ''
    }
  },
  methods: {
    e_confirm() {
      let labelList = this.list.map(item => {
        return item.label
      })
      let isTrue = true
      labelList.forEach(item => {
        if (item == '') {
          isTrue = false
        }
      })
      if (!isTrue) {
        this.$message.error('表单标题不能为空')
        return
      }
      let backFunLabel = `that['${this.listLabel}']=list`
      let list = this.list
      this.$emit('confirm', {list, backFunLabel})
    },
    init({list, listLabel}) {
      this.showlog = true
      this.list = list
      this.listLabel = listLabel
    },
    e_close() {
      this.$emit('close')
    }
  }
}
</script>
