<template>
  <el-form ref="addFormRef" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input
        v-model="user.oldPassword"
        placeholder="请输入旧密码"
        type="password"
      />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input
        v-model="user.newPassword"
        placeholder="请输入新密码"
        type="password"
      />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input
        v-model="user.confirmPassword"
        placeholder="请确认密码"
        type="password"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="submit">保存</el-button>
      <el-button type="danger" size="default" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup name="resertPwd">
import { updateUserPwd } from "@/api/system/user";
import store from "@/store";
import useTagsViewStore from "@/store/modules/tagsView";
import { useRouter } from "vue-router";
import { ref, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
const tagsView = useTagsViewStore(store);
const router = useRouter();
const addFormRef = ref();
const test = ref("1test");
const user = ref({
  oldPassword: undefined,
  newPassword: undefined,
  confirmPassword: undefined,
});
// 表单校验
const rules = ref({
  oldPassword: [{ required: true, message: "旧密码不能为空", trigger: "blur" }],
  newPassword: [
    { required: true, message: "新密码不能为空", trigger: "blur" },
    {
      min: 6,
      max: 20,
      message: "长度在 6 到 20 个字符",
      trigger: "blur",
    },
  ],
  confirmPassword: [
    { required: true, message: "确认密码不能为空", trigger: "blur" },
    {
      required: true,
      validator: (rule, value, callback) => {
        if (user.value.newPassword !== value) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
});
const equalToPassword = (rule, value, callback) => {
  if (user.value.newPassword !== value) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};

const submit = () => {
  addFormRef.value.validate((valid) => {
    if (valid) {
      updateUserPwd(user.value.oldPassword, user.value.newPassword).then(
        (response) => {
          if (response.code === 200) {
            proxy.msgSuccess("修改成功");
          } else {
            proxy.msgError(response.msg);
          }
        }
      );
    }
  });
};
const close = () => {
  tagsView.delView(router.currentRoute);
  router.push({ path: "/index" });
};
</script>
