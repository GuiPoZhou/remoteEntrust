<template>
  <div>
    <el-select ref="selectTree" v-model="modelValue" :clearable="true" class="main-select-tree" size="small">
      <el-option v-for="item in dataSource" :key="item.value" :label="item.label" :value="item.value"
                 style="display: none;"/>
      <el-tree ref="selecteltree" :current-node-key="modelValue"
               :data="getData"
               :expand-on-click-node="expandOnClickNode"
               :props="defaultProps"
               class="main-select-el-tree"
               default-expand-all
               highlight-current
               node-key="id"
               @node-click="handleNodeClick"/>
    </el-select>
  </div>
</template>

<script>
export default {
  computed: {
    getData() {
      console.log('selectTree', this.dataSource, this.config);
      let result = this.parseData(this.dataSource, '0');
      console.log('selectTree', result);
      return result;
    },
    modelValue: {
      get() {
        return (this.value && this.value !== 0) ? this.value + "" : null;
      },
      set(newValue) {
        this.$emit('input', newValue);
      },
    },
  },
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    dataSource: {
      type: Array,
      default: null
    },
    value: {
      type: [String, Number, Boolean, Object, Array],
      default: null,
    },
    config: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      expandOnClickNode: true,
      options: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
    }
  },
  methods: {
    // 四级菜单
    formatData(data) {
      let options = [];
      return options;
    },
    parseData(data, parentId = null) {
      if (!data) {
        return null;
      }
      const result = [];
      for (const item of data) {
        if (item.parentId === parentId) {
          const children = this.parseData(data, item.key);
          result.push({
            label: item.label,
            id: item.value,
            children: children.length > 0 ? children : null,
          });
        }
      }
      return result;
    },
    handleNodeClick(node) {
      this.modelValue = node.id;
      this.$refs.selectTree.blur();
    }
  }
}
</script>
<style>
.main-select-el-tree .el-tree-node .is-current > .el-tree-node__content {
  font-weight: bold;
  color: #409eff;
}

.main-select-el-tree .el-tree-node.is-current > .el-tree-node__content {
  font-weight: bold;
  color: #409eff;
}
</style>
