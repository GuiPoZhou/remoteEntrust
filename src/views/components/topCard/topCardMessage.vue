<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <div class="top-left">
        <el-image :src="iconSrc" style="vertical-align: middle;"></el-image>
        <span>消息提示</span>
      </div>
      <div class="top-right">
        <!--        <el-button type="danger" size="mini" round>{{99}}</el-button>-->
        <div class="floatStyle" @click="jumpMsg">
          <span class="wanringMsg">{{ nodeRead }}</span>
          <el-image :src="rightBtn" class="imgStyle"></el-image>
        </div>
      </div>
    </div>
    <div v-if="messageList.length > 0" class="box-center">
      <div class="text-center">
        <div v-for="item in messageList" class="text-box" @click="checkReport(item)">
          <span>{{ item.content + ',请点击查看' }}</span>
          <span>{{ dayjs().format('YYYY-MM-DD HH:mm:ss') }}</span>
        </div>
      </div>
    </div>
    <div v-else class="emptyMes">暂无数据</div>

    <reportDialog
        v-if="reportShow"
        ref="reportRef"
        :localData="localData"
        @close="reportShow = false"
    />
  </el-card>
</template>

<script setup>
import iconSrc from '@/assets/logos/icon_bell.png'
import dayjs from "dayjs";
import {ref, reactive, getCurrentInstance, onMounted, nextTick, onBeforeUnmount} from 'vue'
import rightBtn from '@/assets/logos/btn_chevron_right@2x.png'
import reportDialog from './reportDialog.vue'

const instance = getCurrentInstance()
// 获取 vue 实例相当于 this
const vm = instance['proxy']

let params = {
  userId: vm.$store.state.user.user.userId,
  pageSize: 1000,
  pageNum: 1
}
let messageList = ref([])
const getMessageList = () => {
  vm.$net('/message/list', 'get', params).then(res => {
    messageList.value = res.data
  })
}
getMessageList()
let nodeRead = ref(0)
const getNoRead = () => {
  vm.$net('/message/unReadCount', 'get', params).then(res => {
    console.log(res)
    if (res.code === 200) {
      nodeRead.value = res.data
    }
  })
}
getNoRead()
let fullMessageList = ref([])

// 将消息列表复制一份拼接在末尾，实现循环滚动
onMounted(() => {
  fullMessageList.value = [...messageList.value, ...messageList.value]
})
let reportShow = ref(false)
let localData = reactive({})
const checkReport = (item) => {
  hasRed(item.id)
  reportShow.value = true
  nextTick(() => {
    localData = item
    vm.$refs.reportRef.init(item)
  })
}
const hasRed = (ids) => {
  let params = {
    messageIdList: [ids]
  }
  vm.$net('/message/updateReadStatus', 'post', params).then(res => {
  })
}
// 跳转
const jumpMsg = () => {
  vm.$router.push({
    path: '/messageList'
  })
}
let setTime = null
// 5秒刷新消息列表
setTime = setInterval(() => {
  getMessageList()
  getNoRead()
}, 5000)

onBeforeUnmount(() => {
  clearInterval(setTime)
})

</script>

<style lang="less" scoped>
.box-card {
  height: 200px;
  width: 372px;
}

.clearfix {
  width: 100%;
  display: flex;
  align-items: center;

  .top-left {
    vertical-align: middle;
    text-align: center;
  }

  .top-right {
    flex: 1;
  }

  .imgStyle {
    width: 20px;
    height: 20px;
    vertical-align: middle;
    margin-right: 10px;
    cursor: pointer;

    :hover {
      border: 1px dashed grey;
    }
  }

  .floatStyle {
    float: right;
  }

  .wanringMsg {
    display: inline-block;
    width: 30px;
    height: 20px;
    line-height: 20px;
    background-color: #F56C6C;
    color: whitesmoke;
    border-radius: 10px;
    text-align: center;
    margin-right: 5px;
  }
}

.box-center {
  background: #f6f6f8;
  height: 8rem;
  border-radius: 4px;
  overflow-y: scroll;
  overflow-x: hidden;

  .text-center {
    width: 100%;
    height: 100%;

    .text-box {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 10px;

      span {
        display: inline-block;
        max-width: 80%;
        vertical-align: middle;
        margin-left: 20px;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      span:first-child {
        display: inline-block;
        max-width: 80%;
        vertical-align: middle;
        margin-left: 20px;
        font-weight: bolder;
      }

      span:last-child {
        margin-left: 16px;
        text-align: center;
        font-size: 14px;
        font-weight: 500;
        color: #999999;
      }
    }
  }
}

.emptyMes {
  text-align: center;
}
</style>
