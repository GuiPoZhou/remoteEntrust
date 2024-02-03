<template>
  <div class="app-container">
    <el-menu
        active-text-color="#ffd04b"

        class="el-menu-demo"
        mode="horizontal"
        router
        @select="handleSelect"
    >
      <el-menu-item index="/indexCustomer">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>企业端首页</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/entrust">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>委托报检</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/users">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>用户管理</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/company">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>企业信息</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/system">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>系统管理</span>
        </template>
      </el-menu-item>
    </el-menu>
    <el-main>
      <router-view></router-view>
    </el-main>
  </div>
</template>

<script>
export default {
  name: "Index",
  components: {},
  data() {
    return {};
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
  },
  computed: {},
  created() {
  },
  mounted() {
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-main {
  padding: 0px;
}
</style>
