<template>
  <div class="app-container">
    <el-row>
      <el-form :inline="true" style="text-align: center">
        <el-form-item>
          <el-input
            style="width: 500px"
            v-model="queryParams.searchValue"
            placeholder="请输入"
            clearable
            size="default"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="Search"
            size="default"
            @click="handleQuery"
          ></el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <template>
      <el-table :data="result.data" style="width: 100%">
        <el-table-column prop="name" label="name" width="180">
        </el-table-column>
        <el-table-column prop="key" label="key" width="180"> </el-table-column>
        <el-table-column prop="body" label="body"> </el-table-column>
        <el-table-column prop="content" label="content"> </el-table-column>
      </el-table>
    </template>
  </div>
</template>

<script setup name="QueryResult">
import { Search } from "@element-plus/icons-vue";
import { queryByKey } from "@/api/home";
import { useRouter } from "vue-router";
import { getCurrentInstance, onMounted, reactive, ref, watch } from "vue";

const router = useRouter();

// 遮罩层
const loading = ref(true);
// 查询参数
const queryParams = reactive({
  searchValue: undefined,
});
const result = ref({
  data: [],
});

onMounted(() => {
  const data = router.query && router.query.data;
  queryParams.searchValue = router.query && router.query.searchValue;
  result.value.data = data.data;
});

/** 搜索按钮操作 */
const handleQuery = () => {
  queryByKey(queryParams).then((res) => {
    result.value.data = res.data;
  });
};
</script>
