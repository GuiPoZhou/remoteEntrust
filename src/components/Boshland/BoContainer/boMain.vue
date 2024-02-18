<template>
  <div class="bo-main">
    <div ref="foxCont" class="topnavs">
      <!--tabs标签页-->
      <div ref="foxTabs" class="fp-tabs">
        <slot name="botabs"></slot>
      </div>
      <!--搜索栏-->
      <div ref="foxSearch" class="fp-search">
        <slot name="bosearch"></slot>
      </div>
      <div ref="foxButton" class="fp-button">
        <slot name="bobutton"></slot>
      </div>
    </div>
    <!--表格-->
    <div class="fp-tables">
      <slot name="tableArea">
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "pageContent",
  mounted() {
    /**
     * 1、clientHeight
     * 网页(内容)可见区域高：document.body.clientHeight 即页面浏览器中可以看到内容的这个区域的高度，一般是最后一个工具条以下到状态栏以上的这个区域，与页面内容无关。
     *
     * 注意：IE、Opera 认为 scrollHeight 是网页内容实际高度，可以小于 clientHeight。
     *
     * 2、offsetHeight
     *
     * 网页可见区域高：document.body.offsetHeight (包括边线的宽)
     *
     * 二者联系：
     *
     * NS、 FF 认为 offsetHeight 和 scrollHeight 都是网页内容高度，只不过当网页内容高度小于等于 clientHeight 时，scrollHeight 的值是 clientHeight，而 offsetHeight 可以小于 clientHeight。
     */
    this.$nextTick(() => {
      //顶部Tab所占高度
      let rightMainTopNavTabHeight = this.$refs.foxTabs.clientHeight;
      //顶部搜索所占高度
      let rightMainTopNavSearchHeight = this.$refs.foxSearch.clientHeight;
      //顶部按钮所占高度
      // let rightMainTopNavButtonHeight = this.$refs.foxButton.clientHeight;
      //顶部总高度
      let boMainNavHeight =
          rightMainTopNavTabHeight +
          rightMainTopNavSearchHeight + 40
      this.$store.commit("set_boMainNavHeight", boMainNavHeight);
    });
    var that = this;
    // 浏览器窗口变化 实时监听
    // window.addEventListener(
    //     "resize",
    //     () => {
    //         setTimeout(() => {
    //             that.$nextTick(() => {
    //                 //顶部Tab所占高度
    //                 let rightMainTopNavTabHeight = that.$refs.foxTabs.clientHeight;
    //                 //顶部搜索所占高度
    //                 let rightMainTopNavSearchHeight = that.$refs.foxSearch.clientHeight;
    //                 //顶部按钮所占高度
    //                 //顶部总高度
    //                 let boMainNavHeight =
    //                     rightMainTopNavTabHeight +
    //                     rightMainTopNavSearchHeight + 40;
    //                 that.$store.commit("set_boMainNavHeight", boMainNavHeight);
    //             });
    //         }, 1000)
    //
    //     },
    //     false
    // );
  },
  methods: {
    calculateReset() {
      this.$nextTick(() => {
        //顶部Tab所占高度
        let rightMainTopNavTabHeight = this.$refs.foxTabs.clientHeight;
        //顶部搜索所占高度
        let rightMainTopNavSearchHeight = this.$refs.foxSearch.clientHeight;
        //顶部按钮所占高度
        // let rightMainTopNavButtonHeight = this.$refs.foxButton.clientHeight;
        //顶部总高度
        let boMainNavHeight =
            rightMainTopNavTabHeight +
            rightMainTopNavSearchHeight + 40
        this.$store.commit("set_boMainNavHeight", boMainNavHeight);
      });
    },
  },
};
</script>

<style scoped>
.bo-main {
}

.fp-tabs {
  height: auto;
}

.topnavs {
  background-color: #fff;
  border-radius: 6px;
}

:deep(.fp-tabs) .el-tabs__nav-wrap::after {
  background-color: #f1f2f3 !important;
  height: 1px !important;
}

:deep(.fp-tabs) .el-tabs__item.is-top:nth-child(2) {
  padding: 0 16px;
}

:deep(.fp-tabs) .el-tabs__active-bar {
  /*width: 80px !important;*/
  /*left: -20px;*/
}

:deep(.fp-tabs) .el-tabs__header {
  margin: 0;
}

.fp-search {
  padding: 10px 16px 15px 16px;
}

:deep(.fp-search) .intBor {
  /*border: 1px solid #dcdee1;*/
  /*border-radius: 2px;*/
  /*width: 250px;*/
  /*height: 35px;*/
  /*padding-left: 15px;*/
  /*margin-right: 16px;*/
  /*margin-bottom: 15px;*/
}

:deep(.fp-search) .datebox {
  width: 330px;
}

:deep(.fp-search) .dateboxs1 {
  width: 350px;
}

:deep(.fp-search) .el-range-editor--medium.el-input__inner {
  /*border: none;*/
  height: 31px;
}

:deep(.fp-search) .searchform {
  display: flex;
  justify-content: space-between;
  flex-flow: wrap;
  justify-content: normal;
}

:deep(.fp-search) .el-form-item--medium .el-form-item__label {
  /*padding: 0;*/
  line-height: 35px;
}

:deep(.fp-search) .el-form-item {
  margin-bottom: 6px;
}

:deep(.fp-search) .el-form-item--medium .el-form-item__content {
  flex: 2;
  height: 100%;
  line-height: 35px;
}

:deep(.fp-search) .el-form-item__label {
  color: #384354;
  font-weight: normal;
}

:deep(.fp-search) .searchform .el-form-item {
  display: flex;
  align-items: center;
}

:deep(.fp-search) .el-input--medium .el-input__inner {
  /* height: 32px; */
  height: 30px;
  line-height: 0;
  /*border: none;*/
  /*padding: 0;*/
  position: relative;
  /*width: 90%;*/
}

/* 搜索区域下的 el-select 样式 */
:deep(.fp-search) .el-select {
  width: 100%;
  /*padding-left: 10px;*/
}

:deep(.fp-search) .el-input__suffix {
  right: 0px;
}

:deep(.fp-search) .el-button--primary {
  background: #3377ff;
}

:deep(.fp-search) .el-button--medium {
  padding: 9px 20px;
  border-radius: 2px;
}

.fp-button {
  padding: 0px 16px;
  padding-bottom: 5px;
}

.fp-tables {
  padding: 10px 16px;
  margin-top: 10px;
  background-color: #fff;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}
</style>
