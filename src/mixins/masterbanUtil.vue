<template>

</template>
<script lang="ts" setup>
import {ref, reactive, getCurrentInstance, onMounted, onBeforeMount} from 'vue'
import {net} from "@/api/requestList.js"

const vm = getCurrentInstance().proxy

let microProjectEntry: string = ref('')
let microElnEntry: string = ref('')

onBeforeMount(() => {
  microElnEntry = process.env.NODE_ENV === "production" ? '/subProject/' : `//${window.location.hostname}:7004`
  microElnEntry = process.env.NODE_ENV === "production" ? '/subEln/' : `//${window.location.hostname}:7005`
})

/**
 * @author Coder
 * @date 2023/3/28
 * @des 快速查询目标节点
 */
function getKevinFormNode(tree: Array, treeChildrenName: String | Number, sourceAttributeName: String | Number, sourceAttributeValue: String | Number) {
  let targetAttribute = {}
  if (Array.isArray(tree) && tree.length > 0) {
    tree.some(node => {
      if (node[sourceAttributeName] === sourceAttributeValue) {
        targetAttribute = node
        return true;
      } else if (node[treeChildrenName] !== undefined) {
        let temp = this.getKevinFormNode(node[treeChildrenName], treeChildrenName, sourceAttributeName, sourceAttributeValue, targetAttribute)
        if (Object.keys(temp).length > 0) {
          targetAttribute = temp
          return true
        }
      }
    })
  }
  return targetAttribute
}

function getPluginsForButtons(businessName, callback) {
  net('/formLayout/v2/getFormLayoutConfig', 'get', {id: businessName}).then(re => {
    if (re.data) {
      let formDataStr = re.data.configStr
      let resultDataStr = formDataStr.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      let info = JSON.parse(resultDataStr)
      let mainHomeButtons = []
      let mainTableButtons = []
      let mainTableSlotRender = []
      let mainDialogBottomButtons = []
      let engineList = []
      let businessCode = {}

      mainHomeButtons = info.mainHomeButtons.filter(item => {
        return vm.$checkPermi([item.perm]) || !item.perm
      })
      mainTableButtons = info.mainTableButtons.filter(item => {
        return vm.$checkPermi([item.perm]) || !item.perm
      })
      mainDialogBottomButtons = info.mainDialogBottomButtons
      mainTableSlotRender = info.mainTableSlotRender || []
      engineList = info.engineList || []
      businessCode = info.businessCode
      callback({
        mainHomeButtons,
        mainTableButtons,
        mainDialogBottomButtons,
        businessCode,
        mainTableSlotRender,
        engineList
      })
    } else {
      let mainHomeButtons = []
      let mainTableButtons = []
      let mainTableSlotRender = []
      let mainDialogBottomButtons = []
      let engineList = []
      let businessCode = {}
      callback({
        mainHomeButtons,
        mainTableButtons,
        mainDialogBottomButtons,
        businessCode,
        mainTableSlotRender,
        engineList
      })
    }

  })
}

defineExpose({
  getPluginsForButtons
})
</script>

<style lang="less" scoped>

</style>
