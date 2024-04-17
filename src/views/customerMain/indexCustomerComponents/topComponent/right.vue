<template>
  <el-card class="box-card">
    <div slot="header" class="header">
      <span style="font-size: 12px">委托统计</span>
      <el-date-picker
          v-model="createTime"
          class="date-picker"
          size="small"
          style="width: 150px;height: 21px"
          type="date"
          clearable
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="changeTime">
      </el-date-picker>
    </div>
    <div v-show="showSkin">
      <el-skeleton :throttle="500"
                   animated
      />
    </div>
    <div v-show="!showSkin" id="container"></div>
  </el-card>
</template>

<script setup>

import {ref, reactive, getCurrentInstance, onMounted} from 'vue'

const instance = getCurrentInstance()
// 获取vue实例相当于this
const vm = instance['proxy']
import {Pie} from '@antv/g2plot';

let data = ref([])
let createTime = ref('')
let piePlot;
let showSkin = ref(true)

function getStatic(prarms) {
  vm.$net('/v1/entrustRemoteAgreement/indexData', 'get', prarms).then(res => {
    if (res.code === 200) {
      data.value = res.data;
      console.log(data)
      if (!piePlot) {
        getPie()
        showSkin.value = false
      } else {
        piePlot.changeData(res.data)
      }

    }
  });
}
function changeTime(t) {
  getStatic({createTime: t})
}
function getPie() {
  piePlot = new Pie('container', {
    height: 170,
    appendPadding: 5,
    data: data.value,
    angleField: 'count',
    legend: {
      position: 'bottom',
      itemHeight: 5,
      itemSpacing: 0,
      flipPage: false,
    },
    colorField: 'lable',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      content: '',
      style: {
        fontSize: 12,
        textAlign: 'center',
      },
    },
    interactions: [{type: 'element-active'}],
  });
  piePlot.render()
}
onMounted(() => {
  getStatic(createTime.value)
})

</script>
<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.box-card {
  animation: .5s;
}

.date-picker {
  position: relative;
  top: -8px;
}
</style>
