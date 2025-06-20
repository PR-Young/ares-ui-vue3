<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="登录地址" prop="ipaddr">
        <el-input
          v-model="queryParams.ipaddr"
          placeholder="请输入登录地址"
          clearable
          size="default"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户名称" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名称"
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
          >搜索</el-button
        >
        <el-button :icon="Refresh" size="default" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="dataList.slice((pageNum - 1) * pageSize, pageNum * pageSize)"
      style="width: 100%"
    >
      <el-table-column label="序号" type="index" align="center">
        <template v-slot="scope">
          <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="会话编号"
        align="center"
        prop="tokenId"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="登录名称"
        align="center"
        prop="userName"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="部门名称" align="center" prop="deptName" />
      <el-table-column
        label="主机"
        align="center"
        prop="ipaddr"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="登录地点" align="center" prop="loginLocation" />
      <el-table-column label="浏览器" align="center" prop="browser" />
      <el-table-column label="操作系统" align="center" prop="os" />
      <el-table-column
        label="登录时间"
        align="center"
        prop="loginTime"
        width="180"
      >
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.loginTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template v-slot="scope">
          <el-button
            size="default"
            link
            :icon="Delete"
            @click="handleForceLogout(scope.row)"
            v-hasPermi="['monitor:online:forceLogout']"
            >强退</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="pageNum"
      v-model:limit="pageSize"
    />
  </div>
</template>

<script setup name="Online">
import { Search, Refresh, Delete } from "@element-plus/icons-vue";
import { list, forceLogout } from "@/api/monitor/online";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";

const { proxy } = getCurrentInstance();
const addFormRef = ref();
// 遮罩层
const loading = ref(true);
// 总条数
const total = ref(0);
// 表格数据
const dataList = ref([]);
const pageNum = ref(1);
const pageSize = ref(10);
// 查询参数
const queryParams = reactive({
  ipaddr: undefined,
  userName: undefined,
});

onMounted(() => {
  getList();
});

/** 查询登录日志列表 */
const getList = () => {
  loading.value = true;
  list(queryParams).then((response) => {
    dataList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
};
/** 搜索按钮操作 */
const handleQuery = () => {
  pageNum.value = 1;
  getList();
};
/** 重置按钮操作 */
const resetQuery = () => {
  proxy.resetForm("queryForm");
  handleQuery();
};
/** 强退按钮操作 */
const handleForceLogout = (row) => {
  proxy
    .$confirm('是否确认强退名称为"' + row.userName + '"的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return forceLogout(row.tokenId);
    })
    .then(() => {
      getList();
      proxy.msgSuccess("强退成功");
    })
    .catch(function () {});
};
</script>
