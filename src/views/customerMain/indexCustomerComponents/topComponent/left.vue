<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span class="titleLeft">委托报检</span>
    </div>
    <div class="cardContent">
      <!--      <div class="carBox" v-for="item in menus">-->
      <!--        <el-card @click.native="jumpDialog(item)" class="cardStyle">-->
      <!--          <div class="container">-->
      <!--            <img src="@/assets/image/u117.png" class="img-style" alt="">-->
      <!--            <p class="textStyle">{{item.configName}}</p>-->
      <!--          </div>-->
      <!--        </el-card>-->
      <!--      </div>-->
      <div v-if="menus.length > 4" class="smallBox">

        <div v-for="(item,index) in menus" style="">
          <div class="smallCarBox" @click="jumpDialog(item)" @click.native="jumpDialog(item)">
            <div :style="{ backgroundImage: 'url(' + smBg[index % bg.length] + ')' }" class="smallCenter">
              <div class="smallCard">{{ item.configName }}</div>
            </div>
          </div>
        </div>


      </div>
      <div v-else>
        <el-row :gutter="10">
          <el-col v-for="(item,index) in menus" :span="6">
            <div :style="{ backgroundImage: 'url(' + bg[index % bg.length] + ')' }" class="bigCarBox"
                 @click="jumpDialog(item)">
              <p class="bigCard">{{ item.configName }}</p>
              <p class="isMore">点击添加委托</p>
            </div>
          </el-col>
        </el-row>
      </div>

    </div>
  </el-card>
</template>

<script setup>
import {ref, reactive, getCurrentInstance} from 'vue'
// 大图
import blue from '@/assets/image/btn_entrust_blue_clipdrop-cleanup.png'
import green from '@/assets/image/btn_entrust_green_clipdrop-cleanup.png'
import orange from '@/assets/image/btn_entrust_orange_clipdrop-cleanup.png'
import purple from '@/assets/image/btn_entrust_purple_clipdrop-cleanup.png'
//小图
import entrust1 from '@/assets/image/smallEntrust/btn_entrust_01.png'
import entrust2 from '@/assets/image/smallEntrust/btn_entrust_02.png'
import entrust3 from '@/assets/image/smallEntrust/btn_entrust_03.png'
import entrust4 from '@/assets/image/smallEntrust/btn_entrust_04.png'
// 背景图集合
const bg = ref([blue, green, orange, purple])
const smBg = ref([entrust1, entrust2, entrust3, entrust4])
const instance = getCurrentInstance()
// 获取vue实例相当于this
const vm = instance['proxy']
let menus = ref([])
vm.$net('/template/execution/run/getBusinessConfig/ENTRUSTMENT_AGREEMENT_PRE', 'get').then(re => {
  console.log(re, 're')
  menus.value = re.data
  vm.$store.commit('set_menu', re.data)
})

const jumpDialog = (item) => {
  console.log('跳转')
  vm.$router.push({
    path: '/bottomT',
    name: 'bottomT',
    query: {  // 传递路由参数
      itemId: item.id // 假设需要传递一个名为 itemId 的参数，值为 item.id
    }
  })
}
</script>
<style lang="less" scoped>
.clearfix {
  display: flex;
  justify-content: space-between;
}

.titleLeft {
  flex: 1;
  font-size: 12px;
}

.cardContent {

  .bigCarBox {
    overflow-x: hidden;
    cursor: pointer;
    height: 180px;
    background: no-repeat;
    overflow: hidden;

    p:first-child {
      color: white;
      font-size: 20px;
    }

    p:last-child {
      font-size: 12px;
      color: #3D3D3D;
    }

    p {
      position: relative;
      left: 2rem;
      top: 2rem;
    }
  }

  .smallBox {
    height: 100%;
    display: flex;
    flex-direction: row;
    overflow-x: scroll;
    overflow-y: hidden;

    margin-top: 2rem;

    > div {
      width: 12.5%;
      white-space: nowrap;
      margin: 0 1rem;
    }
  }

  .smallCarBox {
    width: 80px;
    height: 120px;
    cursor: pointer;
    white-space: nowrap;

    .smallCenter {
      white-space: nowrap;
      width: 100%;
      height: 100%;
      background: no-repeat;

      .smallCard {
        position: relative;
        left: 0.7rem;
        top: 5.5rem;
      }
    }
  }
}

.box-card {
  height: 260px;
}

.cardStyle {
  //height: 90px;
  //margin-top: -5px;
  //margin-bottom: 5px;
  //cursor: pointer;
  //:hover {
  //  animation: .5s;
  //}
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.textStyle {
  margin-top: 10px;
}

.img-style {
  width: 20px;
  height: 20px;
}
</style>
