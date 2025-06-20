<template>
  <div class="app-container">
    <el-form ref="basicInfoForm" :model="info" label-width="150px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="根目录" prop="basePackage">
            <el-input placeholder="请输入基础包名" v-model="info.basePackage" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实体包名" prop="entityPackage">
            <el-input
              placeholder="请输入实体包名"
              v-model="info.entityPackage"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="dao包名" prop="daoPackage">
            <el-input placeholder="请输入dao包名" v-model="info.daoPackage" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="service包名" prop="servicePackage">
            <el-input
              placeholder="请输入service包名"
              v-model="info.servicePackage"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="controller包名" prop="controllerPackage">
            <el-input
              placeholder="请输入controller包名"
              v-model="info.controllerPackage"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="文件前缀" prop="filePrefix">
            <el-input placeholder="请输入文件前缀" v-model="info.filePrefix" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="文件后缀" prop="fileSuffix">
            <el-input placeholder="请输入文件后缀" v-model="info.fileSuffix" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="表前缀" prop="tablePrefix">
            <el-input placeholder="请输入表前缀" v-model="info.tablePrefix" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生成级别" prop="genLevel">
            <el-input placeholder="请输入生成级别" v-model="info.genLevel" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="作者" prop="author">
            <el-input placeholder="请输入作者名" v-model="info.author" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="" style="text-align: center">
      <el-button type="primary" @click="saveBasicInfo">确 定</el-button>
      <!-- <el-button @click="cancelDataScope">取 消</el-button> -->
    </div>
  </div>
</template>

<script setup name="BasicInfoForm">
import { getBasicInfo, updateBasicInfo } from "@/api/tool/gen";
import { ref, onMounted, getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance();
const loading = ref(true);
const info = ref({});

onMounted(() => {
  getBasicInfos();
});

const getBasicInfos = () => {
  loading.value = true;
  getBasicInfo().then((response) => {
    info.value = response.data;
    loading.value = false;
  });
};
const saveBasicInfo = () => {
  updateBasicInfo(info).then((response) => {
    if (response.code === 200) {
      proxy.msgSuccess("修改成功");
      getBasicInfos();
    } else {
      proxy.msgError(response.msg);
    }
  });
};
</script>
