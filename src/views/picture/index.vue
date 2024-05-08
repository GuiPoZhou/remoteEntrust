<template>
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <el-menu-item v-for="(item,index) in renderList" :index="index.toString()">{{ '测试' + index }}</el-menu-item>
  </el-menu>
  <el-row>
    <component :is="component"></component>
  </el-row>
</template>

<script setup>
import g1 from './webGl/g1.vue'

let renderList = [
  g1,
]
let component = ref(renderList[0])
let activeIndex = ref('0')

function handleSelect() {
  component.value = renderList[activeIndex.value]
}
</script>

<style lang="less" scoped>

</style>