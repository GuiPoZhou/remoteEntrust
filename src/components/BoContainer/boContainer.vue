<template>
  <div
      class="bo-container"
      style="height: 100% "
  >
    <div class="fp-area">
      <!-- 内容区域 -->
      <div
          :style="{ height:  + '100%px' }"
          class="fp-contentarea"
          @scroll.passive="getScroll($event)"
      >
        <slot name="boMain"></slot>
      </div>
      <!-- 页签区域 -->
      <div ref="fpPage" class="fp-pagearea">
        <pagination
            v-show="total > 0"
            :limit.sync="pageSize"
            :page.sync="pageNum"
            :total="total"
            @pagination="e_changePage"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pageTitle: {
      typeof: String,
      default: "",
    },
    total: {
      typeof: Number,
      default: 0,
    },
  },
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      contentHeight: 0,
    };
  },
  watch: {
    /*
     *@author: 焦政
     *@date: 2022-02-16 15:18:49
     *@description:在当前页面刷新 大概率会出现$store中数据获取不到的情况 如果中间内容高度为负数了，那就重新再计算一下
     */
    contentHeight(val) {
      if (val < 0) {
        this.calculateContentHeight();
      }
    },
  },
  mounted() {
    this.calculateContentHeight();
    var that = this;
    // 浏览器窗口变化 实时监听
//     window.addEventListener(
//       "resize",
//       () => {
//         setTimeout(()=>{
// that.calculateContentHeight();
//         },1000)
//
//       },
//       false
//     );
  },
  methods: {
    getScroll(e) {
      // console.log("滚动信息", event.target.scrollTop);
    },
    resetPage() {
      this.pageNum = 1;
      this.pageSize = 10;
    },
    /*
     *@author: 焦政
     *@date: 2022-02-18 13:34:16
     *@description:更改頁碼
     */
    e_changePage(e) {
      this.$emit("changePage", {...e});
    },
    /*
     *@author: 焦政
     *@date: 2022-02-16 15:16:44
     *@description:计算中间内容高度
     */
    calculateContentHeight() {
      this.$nextTick(() => {
        this.contentHeight =
            this.$store.state.boshland.boContainerHeight -
            this.$refs.fpPage.clientHeight -
            20;
        this.$store.commit("set_boMainHeight", this.contentHeight);
      });
    },
  },
};
</script>

<style>
.bo-container {
  padding: 10px;
  overflow: hidden;
}

.fp-area {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.fp-titlearea {
  width: 100%;
  height: 2rem;
  background-color: #f1f2f4;
  line-height: 2rem;
  border-bottom: 1px solid #dcdee1;
}

.fp-pagearea {
  padding: 0 0px;
  height: 2.5rem;
  line-height: 2.5rem;
  background-color: #fff;
  /*border-top: 1px solid #dcdee1;*/
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

.fp-contentarea {
  overflow: auto;
  /*background: #ffffff;*/
}

.fp-contentarea::-webkit-scrollbar {
  display: none;
}

.fpt-val {
  font-size: 0.85rem;
  margin-left: 8px;
  color: #162337;
}

.fpp-total {
  font-size: 0.8rem;
  margin-left: 8px;
}

.fp-pagearea .pagination-container {
  height: 48px !important;
}

.fp-pagearea .el-pagination .el-select .el-input .el-input__inner {
  height: 24px;
}

.fp-pagearea .pagination-container .el-pagination {
  top: 8px;
}


</style>
