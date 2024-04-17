<template>
  <div>
    <!--    顶部-->
    <div class="center">
      <!--      左侧logo-->
      <img alt="" src="@/assets/image/u117.png" style="width: 50px;height: 50px">
      <!--      中间菜单-->
      <div class="centerStyle">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="1" @click="backIndex">首页</el-menu-item>
          <el-submenu index="2">
            <template slot="title">委托报检</template>
            <el-menu-item v-for="item in $store.state.menu.menus" :key="item.id"
                          :index="item.id.toString()"
                          align="center"
            >
              {{ item.configName }}
            </el-menu-item>
          </el-submenu>
          <el-menu-item v-if="false" index="3">审核管理</el-menu-item>
          <!--            <el-menu-item index="4" >企业管理</el-menu-item>-->
        </el-menu>
      </div>
      <div class="rightStyle">

        <!--      右侧账号-->
        <el-dropdown
            class="avatar-container right-menu-item hover-effect"
            placement:="bottom-end"
            trigger="click"
        >
          <div class="avatar-wrapper">
            {{ $store.state.user.user.nickName }}
            <i class="el-icon-caret-bottom"/>
          </div>
          <el-dropdown-menu slot="dropdown">
            <!--              <router-link to="/remote/company">-->
            <!--                <el-dropdown-item>个人信息</el-dropdown-item>-->
            <!--              </router-link>-->
            <el-dropdown-item divided @click.native="logout">
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

    </div>
    <div class="dividerStyle dividerStyle--horizontal"></div>
    <!--    <el-divider></el-divider>-->
    <!--    中间内容区域-->
    <div class="">
      <router-view></router-view>
    </div>

  </div>
</template>
<script>
export default {
  name: 'newEntrust'
}
</script>
<script setup>
import {ref, reactive, getCurrentInstance, watch} from 'vue'

const instance = getCurrentInstance()
// 获取vue实例相当于this
const vm = instance['proxy']
let activeIndex = ref(null)
const backIndex = () => {

}

function logout() {
  vm.$confirm("确定注销并退出系统吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    vm.$store.dispatch("LogOut").then(() => {
      location.href = 'http://mis.topscomm.net:8931/cas/logout?service=http%3A%2F%2Fmis.topscomm.net%3A8931%2Fcas%2Flogin%3Fservice%3Dhttp%253A%252F%252F172.20.5.160%253A6001%252Fremote%252FcustomerMain%26createToken%3Dfalse'

    });
  });
}

vm.$net('/template/execution/run/getBusinessConfig/ENTRUSTMENT_AGREEMENT_PRE', 'get').then(re => {
  if (vm.$store.state.menu.menus.length === 0) {
    console.log(re, 're')
    vm.$store.commit('set_menu', re.data)
  }

})
watch(() => vm.$route.query, (val) => {
  if (val.itemId) {
    activeIndex.value = val.itemId.toString()
  }
}, {immediate: true})

function handleSelect(index) {
  console.log(index)
  if (index == 1) {
    vm.$router.push({
      path: '/'
    })
  } else if (index == 4) {
    vm.$router.push({
      path: '/remote/company'
    })
  } else {
    vm.$router.push({
      path: '/bottomT',
      name: 'bottomT',
      query: {  // 传递路由参数
        itemId: index // 假设需要传递一个名为 itemId 的参数，值为 item.id
      }
    })
  }

}
</script>
<style lang="less" scoped>
.center {
  vertical-align: middle;
  display: flex;
  align-items: center;

  .avatar-container {
  }

  img {
    margin-left: 5px;
  }

}

.dividerStyle--horizontal {
  display: block;
  height: 1px;
  width: 100%;
  padding-bottom: 5px;
}

.dividerStyle {
  background-color: #DCDFE6;
  position: relative;
}

.centerStyle {
  display: flex;
  align-items: start;
}

.rightStyle {
  display: flex;
  align-items: center;
  margin-left: auto;

  .el-menu-demo {
    display: inline-block;
  }
}

</style>
