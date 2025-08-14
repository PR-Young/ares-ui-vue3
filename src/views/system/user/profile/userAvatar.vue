<template>
  <div>
    <img
      v-bind:src="options.img"
      @click="editCropper()"
      title="点击上传头像"
      class="img-circle img-lg"
    />
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-row>
        <el-col :xs="24" :md="12" :style="{ height: '350px' }">
          <vue-cropper
            ref="cropperRef"
            :img="options.img"
            :info="true"
            :autoCrop="options.autoCrop"
            :autoCropWidth="options.autoCropWidth"
            :autoCropHeight="options.autoCropHeight"
            :fixedBox="options.fixedBox"
            @realTime="realTime"
          />
        </el-col>
        <el-col :xs="24" :md="12" :style="{ height: '350px' }">
          <div class="avatar-upload-preview">
            <img :src="previews.url" :style="previews.img" />
          </div>
        </el-col>
      </el-row>
      <br />
      <el-row>
        <el-col :lg="2" :md="2">
          <el-upload
            action="#"
            :http-request="requestUpload"
            :show-file-list="false"
            :before-upload="beforeUpload"
          >
            <el-button size="default">
              上传
              <el-icon class="el-icon--right"><Upload /></el-icon>
            </el-button>
          </el-upload>
        </el-col>
        <el-col :lg="{ span: 1, offset: 2 }" :md="2">
          <el-button
            :icon="Plus"
            size="default"
            @click="changeScale(1)"
          ></el-button>
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :md="2">
          <el-button
            :icon="ElIconMinus"
            size="default"
            @click="changeScale(-1)"
          ></el-button>
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :md="2">
          <el-button
            :icon="ElIconRefreshLeft"
            size="default"
            @click="rotateLeft()"
          ></el-button>
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :md="2">
          <el-button
            :icon="ElIconRefreshRight"
            size="default"
            @click="rotateRight()"
          ></el-button>
        </el-col>
        <el-col :lg="{ span: 2, offset: 6 }" :md="2">
          <el-button type="primary" size="default" @click="uploadImg()"
            >提 交</el-button
          >
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script setup name="updateAvatar">
import {
  Upload as ElIconUpload,
  Plus,
  Minus as ElIconMinus,
  RefreshLeft as ElIconRefreshLeft,
  RefreshRight as ElIconRefreshRight,
} from "@element-plus/icons-vue";
import store from "@/store";
import "vue-cropper/dist/index.css";
import { VueCropper } from "vue-cropper";
import { uploadAvatar } from "@/api/system/user";
import useUserStore from "@/store/modules/user";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
const user = useUserStore(store);
const { proxy } = getCurrentInstance();
// 是否显示弹出层
const open = ref(false);
// 弹出层标题
const title = ref("修改头像");
const options = ref({
  img: user.avatar.url, //裁剪图片的地址
  autoCrop: true, // 是否默认生成截图框
  autoCropWidth: 200, // 默认生成截图框宽度
  autoCropHeight: 200, // 默认生成截图框高度
  fixedBox: true, // 固定截图框大小 不允许改变
});
const previews = ref({});
const cropperRef = ref();

defineOptions({
  user: {
    type: Object,
  },
});

// 编辑头像
const editCropper = () => {
  open.value = true;
};
// 覆盖默认的上传行为
const requestUpload = () => {};
// 向左旋转
const rotateLeft = () => {
  cropperRef.value.rotateLeft();
};
// 向右旋转
const rotateRight = () => {
  cropperRef.value.rotateRight();
};
// 图片缩放
const changeScale = (num) => {
  num = num || 1;
  cropperRef.value.changeScale(num);
};
// 上传预处理
const beforeUpload = (file) => {
  if (file.type.indexOf("image/") == -1) {
    proxy.msgError("文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。");
  } else {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      options.value.img = reader.result;
    };
  }
};
// 上传图片
const uploadImg = () => {
  cropperRef.value.getCropBlob((data) => {
    let formData = new FormData();
    formData.append("avatarfile", data);
    uploadAvatar(formData).then((response) => {
      if (response.code === 200) {
        open.value = false;
        options.value.img =
          import.meta.env.VITE_APP_BASE_API +
          "/ares/system/user/profile/" +
          response.imgUrl;
        proxy.msgSuccess("修改成功");
      } else {
        proxy.msgError(response.msg);
      }
      cropperRef.value.clearCrop();
    });
  });
};
// 实时预览
const realTime = (data) => {
  previews.value = data;
};
</script>
