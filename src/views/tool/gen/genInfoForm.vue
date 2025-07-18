<template>
  <el-form ref="genInfoForm" :model="info" :rules="rules" label-width="150px">
    <el-row>
      <el-col :span="12">
        <el-form-item prop="tplCategory">
          <template v-slot:label>
            <span>生成模板</span>
          </template>
          <el-select v-model="info.tplCategory">
            <el-option label="单表（增删改查）" value="crud" />
            <el-option label="树表（增删改查）" value="tree" />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="packageName">
          <template v-slot:label>
            <span>
              生成包路径
              <el-tooltip
                content="生成在哪个java包下，例如 com.system"
                placement="top"
              >
                <el-icon><el-icon-question /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-input v-model="info.packageName" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="moduleName">
          <template v-slot:label>
            <span>
              生成模块名
              <el-tooltip
                content="可理解为子系统名，例如 system"
                placement="top"
              >
                <el-icon><el-icon-question /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-input v-model="info.moduleName" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="businessName">
          <template v-slot:label>
            <span>
              生成业务名
              <el-tooltip
                content="可理解为功能英文名，例如 user"
                placement="top"
              >
                <el-icon><el-icon-question /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-input v-model="info.businessName" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="functionName">
          <template v-slot:label>
            <span>
              生成功能名
              <el-tooltip content="用作类描述，例如 用户" placement="top">
                <el-icon><el-icon-question /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-input v-model="info.functionName" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row v-show="info.tplCategory == 'tree'">
      <h4 class="form-header">其他信息</h4>
      <el-col :span="12">
        <el-form-item>
          <template v-slot:label>
            <span>
              树编码字段
              <el-tooltip
                content="树显示的编码字段名， 如：dept_id"
                placement="top"
              >
                <el-icon><el-icon-question /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-select v-model="info.treeCode" placeholder="请选择">
            <el-option
              v-for="column in info.columns"
              :key="column.columnName"
              :label="column.columnName + '：' + column.columnComment"
              :value="column.columnName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <template v-slot:label>
            <span>
              树父编码字段
              <el-tooltip
                content="树显示的父编码字段名， 如：parent_Id"
                placement="top"
              >
                <el-icon><el-icon-question /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-select v-model="info.treeParentCode" placeholder="请选择">
            <el-option
              v-for="column in info.columns"
              :key="column.columnName"
              :label="column.columnName + '：' + column.columnComment"
              :value="column.columnName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <template v-slot:label>
            <span>
              树名称字段
              <el-tooltip
                content="树节点的显示名称字段名， 如：dept_name"
                placement="top"
              >
                <el-icon><el-icon-question /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-select v-model="info.treeName" placeholder="请选择">
            <el-option
              v-for="column in info.columns"
              :key="column.columnName"
              :label="column.columnName + '：' + column.columnComment"
              :value="column.columnName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup name="BasicInfoForm">
import { QuestionFilled } from "@element-plus/icons-vue";
import { ref, onMounted } from "vue";

const props = defineProps({
  info: {
    type: Object,
    default: null,
  },
});

const rules = ref({
  tplCategory: [{ required: true, message: "请选择生成模板", trigger: "blur" }],
  packageName: [
    { required: true, message: "请输入生成包路径", trigger: "blur" },
  ],
  moduleName: [
    { required: true, message: "请输入生成模块名", trigger: "blur" },
  ],
  businessName: [
    { required: true, message: "请输入生成业务名", trigger: "blur" },
  ],
  functionName: [
    { required: true, message: "请输入生成功能名", trigger: "blur" },
  ],
});

onMounted(() => {});
</script>
