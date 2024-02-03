<template>
  <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      append-to-body
      width="400px"
      @open="open"
  >
    <el-upload
        ref="upload"
        :auto-upload="false"
        :limit="1"
        :on-change="handleChange"
        accept=""
        action=""
        drag
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <div slot="tip" class="el-upload__tip">
        <!-- <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的数据 -->
        <!-- <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link> -->
      </div>
      <div slot="tip" class="el-upload__tip" style="color: red">
        提示：每次只能上传一个文件！
      </div>
    </el-upload>
    <div slot="footer" class="dialog-footer">
      <el-button :disabled="isUpload" type="primary" @click="submitFileForm"
      >上传
      </el-button
      >
      <el-button @click="upload.open = false">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  downloadAgreementList,
  downloadAgreement,
  uploadAgreement,
} from "@/api/entrust/entrustConfirm";

export default {
  data() {
    return {
      //已经上传的文件
      uploadFile: null,
      isUpload: false,
    };
  },

  props: {
    upload: {
      type: Object,
    },
    rowData: {
      type: Object,
      default: () => ({}),
    },
  },

  methods: {
    open() {
      this.isUpload = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.$emit("importTemplate");
    },
    //获取上传的文件
    handleChange(file, fileList) {
      // console.log("file", file);
      this.uploadFile = file.raw;
      this.isUpload = false;
    },
    // 提交上传文件
    submitFileForm() {
      const formData = new FormData();
      formData.append("file", this.uploadFile);
      //点击上传的时候，置为true，代表禁止点击
      this.isUpload = true;
      //先上传
      uploadAgreement(this.rowData.idCode, formData)
          .then((response) => {
            //等上传完成，置为false，代表可以点击
            this.isUpload = false;
            if (response.code === 200) {
              // console.log("先上传", response.data);
              this.msgSuccess("上传成功");
              this.upload.open = false;
              this.$refs.upload.clearFiles();
              this.$emit("afterImport");
            } else {
              this.$message({type: "error", message: response.msg});
            }
          })
          .catch((err) => {
          });
      this.$refs.upload.clearFiles();
    },
  },
};
</script>
