<template>
  <el-form ref="addFormRef" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="用户昵称" prop="userName">
      <el-input v-model="user.userName" />
    </el-form-item>
    <el-form-item label="手机号码" prop="phoneNumber">
      <el-input v-model="user.phoneNumber" maxlength="11" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="user.email" maxlength="50" />
    </el-form-item>
    <!-- <el-form-item label="性别">
            <el-radio-group v-model="user.sex">
              <el-radio label="0">男</el-radio>
              <el-radio label="1">女</el-radio>
            </el-radio-group>
          </el-form-item> -->
    <el-form-item>
      <el-button type="primary" size="default" @click="submit">保存</el-button>
      <el-button type="danger" size="default" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup name="userInfo">
import { updateUserProfile } from "@/api/system/user";
import store from "@/store";
import useTagsViewStore from "@/store/modules/tagsView";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

const { proxy } = getCurrentInstance();
const addFormRef = ref();
const router = useRouter();
const tagsView = useTagsViewStore(store);

const props = defineProps({
  user: {
    type: Object,
  },
});

// 表单校验
const rules = ref({
  userName: [{ required: true, message: "用户名称不能为空", trigger: "blur" }],
  // email: [
  //   { required: true, message: "邮箱地址不能为空", trigger: "blur"};
  //   {
  //     type: "email",
  //     message: "'请输入正确的邮箱地址",
  //     trigger: ["blur", "change"]
  //   }
  // ],
  // phoneNumber: [
  //   { required: true, message: "手机号码不能为空", trigger: "blur"};
  //   {
  //     pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
  //     message: "请输入正确的手机号码",
  //     trigger: "blur"
  //   }
  // ]
});

const submit = () => {
  addFormRef.value.validate((valid) => {
    if (valid) {
      updateUserProfile(props.user).then((response) => {
        if (response.code === 200) {
          proxy.msgSuccess("修改成功");
        } else {
          proxy.msgError(response.msg);
        }
      });
    }
  });
};
const close = () => {
  tagsView.delView(router.currentRoute);
  router.push({ path: "/index" });
};
</script>
