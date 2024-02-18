<template>
  <div class="bo-main">
    <div ref="foxCont" class="topnavs">
      <!--tabs标签页-->
      <div ref="foxTabs" class="fp-tabs">
        <slot name="botabs"></slot>
      </div>
      <!--搜索栏-->
      <div ref="foxSearch" class="fp-search-dongtai">
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

.ffp-search-dongtai .el-form--inline .el-form-item {
  width: 100%;
}

.fp-search-dongtai {
  padding: 10px 16px 15px 16px;
}

.fp-search-dongtai .el-form-item__content {
  width: calc(100% - 120px);
}

.fp-search-dongtai .el-date-editor.el-input,
.fp-search-dongtai .el-date-editor.el-input__inner {
  width: 100% !important;
}

.el-date-editor--datetimerange.el-input,
.el-date-editor--datetimerange.el-input__inner {
  width: 220px;
}

:deep(.fp-search-dongtai) .el-select {
  width: 100%;
}

.fp-search-dongtai .el-autocomplete {
  width: 100%;
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
