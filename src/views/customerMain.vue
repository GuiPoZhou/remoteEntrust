<template>
  <div class="customerMain">
    <!--顶部-->
    <div class="cm-top">
      <el-row :gutter="10" type="flex">
        <el-col :sm="6" :span="6" :xs="0" class="cm-top-left">
          <div class="cmt-left">
            <div class="cmt-left-top">
              <img class="user-avatar" src="@/assets/image/center.png"/>
              <span class="cmt-left-text">欢迎登录,{{ nickName }}</span>
            </div>
            <div class="setOrigin">
              <el-col :span="16" class="origin-left">
                <div class="origin-left-top">
                  <span class="phoneS">173****8541</span>
                  <el-tag type="warning">管理员</el-tag>
                  <p class="origin-left-bottom">
                    {{ localTime }}
                  </p>
                </div>
              </el-col>
              <el-col :span="8" class="origin-right">
                <el-button plain round size="small" type="primary">已登录</el-button>
              </el-col>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="cmt-center">
            <topCard></topCard>
          </div>
        </el-col>
        <el-col :span="6">
          <topMessage></topMessage>
        </el-col>
      </el-row>

    </div>
    <!--    中间内容区域-->
    <div class="cm-container">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import store from "@/store";
import logo from "@/assets/image/logo.png";
import {checkRole} from "@/utils/permission";
import topCard from '@/views/components/topCard/topCard'
import topMessage from '@/views/components/topCard/topCardMessage.vue'
import dayjs from "dayjs";

export default {
  data() {
    return {
      deptName: "-",
      nickName: "-",
      timeStatus: "早上好",
      localTime: '',
      logo,
      currentPath: "/remote/customerMain",
      menu: store.state.permission.addRoutes,
      staticData: {},
    };
  },
  components: {
    topCard,
    topMessage,
  },
  methods: {
    getStatic() {

    },
    /**
     * @author 焦政
     * @Description: 跳转
     * @date 2021/3/19
     */
    e_goPath(v) {
      console.log(v)
      window.localStorage.setItem('menuId', '2473')
      console.log(window.localStorage.getItem('menuId'))
      this.currentPath = v.path;
      this.$router.push(v);
    },
    //退出登录
    async logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          location.href = 'http://mis.topscomm.net:8931/cas/logout?service=http%3A%2F%2Fmis.topscomm.net%3A8931%2Fcas%2Flogin%3Fservice%3Dhttp%253A%252F%252F172.20.5.160%253A6001%252Fremote%252FcustomerMain%26createToken%3Dfalse'
        });
      });
    },
    getGreeting() {
      const now = dayjs()
      const hour = now.hour()

      if (hour >= 6 && hour < 9) {
        return '早上好'
      } else if (hour >= 9 && hour < 12) {
        return '上午好'
      } else if (hour >= 12 && hour < 14) {
        return '中午好'
      } else if (hour >= 14 && hour < 18) {
        return '下午好'
      } else {
        return '晚上好'
      }
    },

  },
  created() {
    this.timeStatus = this.getGreeting()
    setInterval(() => {
      this.localTime = dayjs().format('YYYY-MM-DD hh:mm:ss')
    }, 1000)
    console.log(this.$store.state.user)
    this.currentPath = this.$route.path;
    if (this.$store.state.user && this.$store.state.user.deptName) {
      this.deptName = this.$store.state.user.deptName;
    } else {
      this.deptName = "";
    }

    if (this.$store.state.user && this.$store.state.user.nickName) {
      this.nickName = this.$store.state.user.nickName;
    } else {
      this.nickName = "";
    }
  },
  mounted() {
    this.menu = store.state.permission.addRoutes;
    this.getStatic()
    window.localStorage.setItem('menuId', '2473')
    // 获取上方统计
  },
  watch: {
    $route(to, from) {
      this.currentPath = to.path;
      // console.log(store.getters && store.getters.nickName)
      // console.log(store.getters && store.getters.deptName)
    },
  },
};
</script>
<style lang="scss" scoped>
.customerMain {
  width: 100%;
  height: 100%;
  background: #f6f6f8;
  overflow-y: scroll;
  margin-top: 4px;

  .cm-top {
    width: 100%;
    //display: flex;
    //flex-direction: row;
    //align-items: center;
    //justify-content: space-between;
    .cm-top-left {
      display: flex;
      justify-content: flex-end;
    }

    .cmt-left {
      width: 372px;
      height: 200px;
      //margin-left: 50px;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      vertical-align: middle;
      background-image: linear-gradient(45deg, #E4EFFE, #A6CAFE);

      .cmt-left-top {
        width: 90%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }

      .user-avatar {
        width: 60px;
        height: 60px;
        margin-left: 1rem;
      }

      .setOrigin {
        width: 312px;
        height: 90px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 2px;
        margin-top: 10px;
        opacity: 1;

        .origin-left-top {
          flex-wrap: wrap;
          margin-top: 20px;
          display: flex;
          align-items: center;

          .phoneS {
            margin-left: 20px;
            margin-right: 24px;
            width: 93px;
            height: 22px;
            font-size: 16px;
            font-weight: 500;
            color: #333333;
          }
        }

        .origin-left-bottom {
          margin-left: 16px;
          text-align: center;
          width: 141px;
          height: 20px;
          font-size: 14px;
          font-weight: 500;
          color: #999999;
        }

        .origin-right {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .cmt-left-text {
        padding-left: 1rem;
        vertical-align: middle;
        width: 15rem;
        height: 30px;
        font-size: 18px;
        font-weight: 500;
        color: #333333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

    }

    .cmt-center {
      width: 100%;
      height: 200px;

      .reportStyle {
        width: 14vw
      }

      .cardPosition {

      }

      .cardStyle {
        border-radius: 4px;
        border: 1px solid #e6ebf5;
        background-color: #FFFFFF;
        overflow: hidden;
        color: #303133;
        -webkit-transition: 0.3s;
        margin-top: 6px;

        p {
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
        }
      }

      .center-title {
        height: 85px;
        //margin:0 auto;
        margin-top: 5px;
        width: 30px;
        display: flex;
        align-items: center;
        letter-spacing: 5px;
        vertical-align: middle;
        //border: 1px solid #000; /* 添加1px边框 */
        writing-mode: vertical-rl;
        font-size: 14px;
      }

      .message {
        width: auto;
        //position: absolute;
        //right: 5%;
      }
    }

  }

  .cm-container {
    width: 100%;
    overflow: auto;
  }
}
</style>
