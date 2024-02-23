<template>
  <el-dialog :close-on-click-modal="false" :visible.sync="dialogShow" append-to-body title="拍照" width="50%"
             @clos="close">
    <!-- 高拍仪视频预览区 -->
    <div id="comareamain">
      <img id="mainCam" alt="摄像头" style="width: 100%;height: 450px;">
    </div>
    <div id="ocxdiv" style="display: none;">
      <OBJECT id="ocxstreamimageId" classid="clsid:A4B4E9B5-78E6-4CE3-B8A1-4B36237943F8" height="270px"
              width="360px"></OBJECT>
    </div>
    <!-- 缩略图 -->
    <div class="suoluetu">
      <div v-for="(v, i) in suoluelist" :key="i" class="sl-list">
        <el-image :preview-src-list="[v]" :src="v" style="width: 100px; height: 100px"></el-image>
        <i class="el-icon-delete  kil-icon ki-delete" @click="deletesuolueImage(i)"></i>
      </div>
    </div>
    <div>
      <el-button size="small" @click="view1_scan(0)">主摄像头拍照</el-button>
      <el-button size="small" @click="view2_scan(1)">副摄像头拍照</el-button>
      <el-button size="small" @click="open_view1(0)">打开主摄像头</el-button>
      <!-- <el-button @click="close_view1(1)" size="small">关闭主摄像头</el-button> -->
      <el-button size="small" @click="open_view2(1)">打开副摄像头</el-button>
      <!-- <el-button @click="close_view2" size="small">关闭副摄像头</el-button> -->
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="handleOk">保存</el-button>
      <el-button size="small" @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import axios from 'axios'

export default {
  name: "photo-graphy",
  data() {
    return {
      dialogShow: false,
      view1_mode_list: [],
      view1_resolution_list: [],
      view2_mode_list: [],
      view2_resolution_list: [],
      imgBaselist: [],
      gpAPI: '',
      devIndex: -1,
      WebCamera: null,
      mainCam: null,
      affCam: null,
      suoluelist: []
    }
  },
  methods: {
    init() {
      this.dialogShow = true
      this.$nextTick(() => {
        var that = this
        this.mainCam = $.eloamWebCamera({
          initCamera: false, // 是否要初始化摄像头状态，如果为true,则会检查摄像头状态，如果是打开的，会将摄像头关闭
          hideDivImg: false,// 初始化是否要隐藏显示摄像头窗口;true 隐藏，打开摄像头会显示,关闭摄像头时会隐藏；false
          port: '38088',// CameraWebService 服务端口，默认38088
          ocxDivId: 'ocxdiv',// ocx 对应的div ID 为了
          ocxId: 'ocxstreamimageId',// ocx 对应的id;这个传ocx 的id
          imgMainDivId: 'comareamain',// 包含img div 的id,
          imgMainId: 'mainCam',// 非IE img id 显示预览
        }, function (data) {//成功回调
          that.openCom(0)
        }, function (err) {//失败回调
          console.log('失败', err)
        })
      })
    },
    //打开摄像头
    openCom(index) {
      var data = {
        devIndex: index // 摄像头下标 0主头；1副头
      }
      let label = ''
      var that = this
      index == 0 ? label = '主摄像头' : label = '副摄像头'
      this.$message.info(`${label}打开中...`)
      this.mainCam.openCamera(data, function (data) {
        that.$message.success(`${label}打开成功`)
        console.log('主摄像头打开成功', data)
      }, function (err) {
        console.log('主摄像头打开失败', err)
      })
    },
    //初始化
    defaultWebCamera() {
      return new Promise((re, rj) => {

      })
    },
    // 添加缩略图
    add_image(img_base64) {
      let img = document.createElement('img');
      img.src = "data:image/jpg;base64," + img_base64;
      img.style.width = '80px';
      img.style.height = '80px';
      document.getElementById('suoluetu').appendChild(img)
      this.imgBaselist.push(img.src)
      console.log(this.imgBaselist)
    },
    //删除
    deletesuolueImage(i) {
      this.$confirm('确定删除拍摄的图片?').then(_ => {
        this.suoluelist.splice(i, 1)
      })
    },
    // 主头拍照
    view1_scan(index) {
      var data = {
        devIndex: index,// 拍照摄像头
        rotate: '',//旋转角度
        cutpage: 0
      }
      var that = this
      this.mainCam.grabImageBase64(data, function (data) {
        let src = "data:image/jpg;base64," + data.photoBase64;
        that.suoluelist.push(src)
      }, function (err) {
        console.log(err)
      })
    },
    // 副头拍照
    view2_scan(index) {
      var data = {
        devIndex: index,// 拍照摄像头
        rotate: '',//旋转角度
        cutpage: 0
      }
      var that = this
      this.mainCam.grabImageBase64(data, function (data) {
        let src = "data:image/jpg;base64," + data.photoBase64;
        that.suoluelist.push(src)
      }, function (err) {
        console.log(err)
      })
    },
    // 打开主摄像头
    open_view1() {
      this.openCom(0)
    },
    // 关闭主摄像头
    close_view1() {
      let data = {"camidx": "0"}
      axios.post(this.gpAPI + "/video=close", JSON.stringify(data)).then(() => {
        document.getElementById('view1').src = ''
        console.log('关闭主摄像头成功')
      })
    },
    // 打开副摄像头
    open_view2() {
      this.openCom(1)
    },
    // 关闭副摄像头
    close_view2() {
      let data = {"camidx": "1"}
      axios.post(this.gpAPI + "/video=close", JSON.stringify(data)).then(() => {
        document.getElementById('view2').src = ''
        console.log('关闭副摄像头成功')
      })
    },
    handleOk() {
      if (this.suoluelist.length == 0) {
        this.$message.error('请添加图片')
        return
      }
      this.$emit('imgBaseList', this.suoluelist)
      this.close()
    },
    close() {
      this.mainCam = null
      this.$emit('close')
    },
  },
}
</script>

<style scoped>
.comareamain {
  width: 100%;
  height: 300px;
}

.comareaffCam {
  flex: 1;
  height: 300px;
}

.kil-icon {
  font-size: 16px;
  display: inline-block;
  margin-top: 10px;
  cursor: pointer;
}

.ki-upload {
  color: green;
  margin-right: 20px;
}

.ki-delete {
  color: red;
}


img[src=''],
img:not([src]) {
  opacity: 0;
}

#view {
  display: flex;
}

/* 视频预览 */
#view1,
#view2 {
  width: 50%;
  height: 300px;
  border: 1px solid #ccc;
  margin-right: 5px;
}

/* 缩略图 */
#suoluetu {
  width: 100%;
  height: 85px;
  border: 1px solid #ccc;
  margin-top: 10px;
  margin-bottom: 10px;
}

#suoluetu img {
  margin-right: 10px;
}

/* 操作按钮 */
#myactive {
  border: 1px solid yellowgreen;
  margin-top: 10px;
  padding: 10px 5px;
}

/* 操作日志 */
#mylog {
  border: 1px solid black;
  padding: 10px;
  margin-top: 10px;
  overflow: auto;
}

.suoluetu {
  width: 100%;
  border: 1px solid #ccc;
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 5px;
  border-radius: 5px;
}

.sl-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 10px;
  margin-bottom: 5px;
}</style>
