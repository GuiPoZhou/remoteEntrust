<template>
  <div class="signleeditcontainer">
    <el-drawer :append-to-body="true" :close-on-press-escape="false" :show-close="false" :visible.sync="showDrawer"
               :with-header="false" :wrapperClosable="false" size="95%">
      <div class="si-top">
        <span>listParamsList:主表单存放Array；</span>
        <span>bulletBox:二级弹框弹框存放Array（表单3.0将放弃主次之分，放弃弹框之分）；</span>
        <span>getKevinFormNode：快速查找目标节点；</span>
        <span>EntrustThis:主弹框this指向；</span>
        <span>KevinLogThis:二级弹框this指向；</span>
        <span>anchorPoint:动态表单单元锚点；</span>
        <span>getTreeToFloor:动态表单将树形array转为一层结构；</span>
        <span>arrayToTreeV:动态表单将一层结构转为树形数据；</span>
      </div>
      <component :is="conponentsName" ref="component" @close="close" @save="save"></component>
      <el-row v-if="showDev">
        <el-col :span="24">
          <span>此项内容编辑实现中.....</span>
        </el-col>
        <el-col :span="24">
          <el-button size="small" @click="close">关闭</el-button>
        </el-col>
      </el-row>
    </el-drawer>

  </div>
</template>
<script>
import buttonEdit from './components/buttonEdit.vue'
import inputEdit from './components/inputEdit.vue'
import tableEdit from './components/tableEdit.vue'
import elUploadEdit from './components/elUploadEdit.vue'
import autocompleteEdit from './components/autocompleteEdit.vue'
import selectEdit from './components/selectEdit.vue'
import radioEdit from './components/radioEdit.vue'
import elTabsEdit from './components/elTabsEdit.vue'
import paginationEdit from './components/paginationEdit.vue'
import elCascaderEdit from './components/elCascaderEdit.vue'

export default {
  components: {
    buttonEdit,
    inputEdit,
    tableEdit,
    elUploadEdit,
    autocompleteEdit,
    selectEdit,
    radioEdit,
    elTabsEdit,
    paginationEdit,
    elCascaderEdit
  },
  data() {
    return {
      showDrawer: false,
      conponentsName: '',
      editTarget: '',
      showDev: false
    }
  },
  methods: {
    //target 主表单单项编辑  bulletBox 二级弹框单项编辑
    init(params, target = "listParamsList") {
      console.log('params', params)
      this.showDrawer = true
      this.editTarget = target
      this.renderSignleEdit(params)
    },
    // render signleComponents
    renderSignleEdit(params) {
      switch (params.component) {
        case 'el-button':
          this.conponentsName = 'buttonEdit'
          break;
        case 'el-input':
        case 'input':
        case 'textarea':
          this.conponentsName = 'inputEdit'
          break;
        case 'el-table':
        case 'el-table-tree':
          this.conponentsName = 'tableEdit'
          break;
        case 'el-upload':
          this.conponentsName = 'elUploadEdit'
          break;
        case 'el-autocomplete':
          this.conponentsName = 'autocompleteEdit'
          break;
        case 'el-select':
        case 'select':
          this.conponentsName = 'selectEdit'
          break;
        case 'el-radio':
        case 'radio':
          this.conponentsName = 'radioEdit'
          break;
        case 'el-tabs':
          this.conponentsName = 'elTabsEdit'
          break;
        case 'el-pagination':
          this.conponentsName = 'paginationEdit'
          break;
        case 'el-cascader':
          this.conponentsName = 'elCascaderEdit'
        default:
          this.showDev = true
          break
      }
      this.$nextTick(() => {
        this.$refs.component.appendParams(params)
      })
    },
    close() {
      this.$emit('close')
    },
    save(params) {
      this.$emit('saveSignleEdit', {params, editTarget: this.editTarget})
    }
  }
}
</script>
<style lang="less" scoped>
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

.si-top {
  width: 50%;
  height: auto;
  border-radius: 5px;
  border-left: 5px solid #50bfff;
  padding: 10px;
  display: flex;
  flex-direction: row;
  background-color: #ecf8ff;
  margin: 10px;
  flex-wrap: wrap;

  span {
    font-size: 12px;
    color: #000;
    text-indent: 0.4rem;
    display: inline-block;
    margin-bottom: 8px;
  }
}
</style>
