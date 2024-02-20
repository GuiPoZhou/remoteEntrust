<!--
 * @Autor: 焦政
 * @Date: 2021-06-16 17:28:17
 * @Description:
-->
<!-- @author Shiyn/   huangmx 20200807优化-->
<template>
  <div class="top-right-btn">
    <el-row>
      <el-tooltip
          content="设置列表"
          placement="right"
          style="margin:0 10px"
          title="设置列表"
          trigger="click"
          width="420"
      >
        <el-button
            circle
            :icon="Setting"
            size="small"
            @click="showConfig()"
        />
      </el-tooltip>
    </el-row>
  </div>
</template>
<script setup>
import {Setting} from '@element-plus/icons-vue'

let checkedColumns = ref([])
const {showSearch, boxData} = defineProps({
  showSearch: {
    type: Boolean,
    default: true
  },
  boxData: {
    type: Array,
    default: () => {
    }
  }
})
const emit = defineEmits(['showConfig'])

function showConfig() {
  emit('showConfig')
}
</script>
