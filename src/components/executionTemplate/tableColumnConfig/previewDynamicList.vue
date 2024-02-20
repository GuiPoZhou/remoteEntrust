<template>
  <div>
    <listContainer ref="listContainer" :businessConfigId="businessConfigId">
      <template slot="botabs">
        <!-- 这里放业务类别的tabs -->
      </template>
      <template slot="bobutton">
        <!-- 这里放业务的button -->
        <el-button size="small" type="primary" @click="getSelection">获取已选中信息</el-button>
      </template>
      <template slot="tableColumn.entrust_code" scope="row">
        <!-- 这里放需特殊处理列的逻辑,插槽名称通过列表配置获取,规则为tableColumn.[列的id] -->
        {{ row.slotScopt.entrust_code }}
      </template>
      <template slot="action" scope="row">
        <!-- 这里放需特殊处理列的逻辑,插槽名称通过列表配置获取,规则为tableColumn.[列的id] -->
        <el-link type="primary" @click="getSelection">测试操作按钮</el-link>
      </template>
    </listContainer>
  </div>
</template>

<script>
import listContainer from '@/components/executionTemplate/tableColumnConfig/listContainer';

export default {
  name: "previewDynamicList",
  components: {
    listContainer
  },
  props: {},
  data() {
    return {
      businessConfigId: null,
    }
  },
  //计算属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    getSelection() {
      console.log(this.$refs.listContainer.getSelection())
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.businessConfigId = this.$route.query && this.$route.query.businessConfigId;
  },
  //生命周期 - 创建之前
  beforeCreate() {
  },
  //生命周期 - 挂载之前
  beforeMount() {
  },
  //生命周期 - 更新之前
  beforeUpdate() {
  },
  //生命周期 - 更新之后
  updated() {
  },
  //生命周期 - 销毁之前
  beforeDestroy() {
  },
  //生命周期 - 销毁完成
  destroyed() {
  },
  //如果页面有keep-alive缓存功能，这个函数会触发
  activated() {
  }
};
</script>

<style scoped>

</style>
