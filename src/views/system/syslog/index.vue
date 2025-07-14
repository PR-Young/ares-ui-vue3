<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="IP" prop="hostIp">
        <el-input
          v-model="queryParams.hostIp"
          placeholder="请输入IP"
          clearable
          size="default"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名"
          clearable
          size="default"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="请求方式" prop="requestMethod">
        <el-select
          v-model="queryParams.requestMethod"
          placeholder="请求方式"
          clearable
          style="width: 120px"
          size="default"
        >
          <el-option
            v-for="dict in methodOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
      border
      v-loading="loading"
      :data="logList"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="IP"
        align="center"
        prop="hostIp"
        :show-overflow-tooltip="true"
        width="200"
        fixed=""
      />
      <el-table-column
        label="用户名"
        align="center"
        prop="userName"
        width="200"
      />
      <el-table-column
        label="url地址"
        align="center"
        prop="url"
        :show-overflow-tooltip="true"
        width="300"
      />
      <el-table-column
        label="操作参数"
        align="center"
        prop="operParams"
        :show-overflow-tooltip="true"
        width="300"
      />
      <el-table-column
        label="请求方式"
        align="center"
        prop="requestMethod"
        :formatter="methodFormat"
        width="300"
      />
      <el-table-column
        label="错误"
        align="center"
        prop="notes"
        :show-overflow-tooltip="true"
        width="300"
      />
      <el-table-column
        label="请求时间"
        align="center"
        prop="createTime"
        sortable="custom"
        width="200"
      >
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="200"
        fixed="right"
      >
        <template v-slot="scope">
          <el-button
            size="default"
            type="primary"
            link
            :icon="View"
            @click="handleShowDetail(scope.row)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改公告对话框 -->
    <el-dialog :title="title" v-model="showDetail" width="880px" append-to-body>
      <el-form ref="addFormRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="IP" prop="hostIp">
              <el-input v-model="form.hostIp" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="form.userName" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="URL" prop="url">
              <el-input v-model="form.url" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作参数" prop="operParams">
              <el-input v-model="form.operParams" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求方式" prop="requestMethod">
              <el-select v-model="form.requestMethod">
                <el-option
                  v-for="dict in methodOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="错误信息">
              <el-input
                type="textarea"
                :rows="3"
                v-model="form.notes"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer" style="padding-top: 20px">
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="SysLog">
import { Search, Refresh, View as ElIconView } from "@element-plus/icons-vue";
import { listLog } from "@/api/system/log";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

const { proxy } = getCurrentInstance();
const addFormRef = ref();

// 遮罩层
const loading = ref(true);
// 选中数组
const ids = ref([]);
// 非单个禁用
const single = ref(true);
// 非多个禁用
const multiple = ref(true);
// 总条数
const total = ref(0);
// 公告表格数据
const logList = ref([]);
// 弹出层标题
const title = ref();
// 是否显示弹出层
const open = ref(false);
const showDetail = ref(false);
// 状态数据字典
const methodOptions = ref([]);
// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  hostIp: undefined,
  userName: undefined,
  requestMethod: undefined,
  sortColumn: undefined,
  sortAsc: undefined,
});
// 表单参数
const form = ref({});
// 表单校验
const rules = ref({});

onMounted(() => {
  getList();
  proxy.getDicts("sys_log_method").then((response) => {
    methodOptions.value = response.data;
  });
});

const sortChange = (data) => {
  const { prop, order } = data;
  queryParams.sortColumn = prop;
  queryParams.sortAsc = order === null ? "descending" : order;
  getList();
};
/** 查询公告列表 */
const getList = () => {
  loading.value = true;
  listLog(queryParams).then((response) => {
    logList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
};
// 公告状态字典翻译
const methodFormat = (row, column) => {
  return proxy.selectDictLabel(methodOptions.value, row.requestMethod);
};
// 取消按钮
const cancel = () => {
  showDetail.value = false;
};
// 表单重置
const reset = () => {
  form.value = {
    id: undefined,
    noticeTitle: undefined,
    noticeType: undefined,
    noticeContent: undefined,
    deadline: undefined,
    noticeStatus: "0",
  };
  proxy.resetForm("addFormRef");
};
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};
/** 重置按钮操作 */
const resetQuery = () => {
  proxy.resetForm("queryForm");
  handleQuery();
};
// 多选框选中数据
const handleSelectionChange = (selection) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};
const handleShowDetail = (row) => {
  reset();
  form.value = row;
  showDetail.value = true;
  title.value = "日志详情";
};
/** 删除按钮操作 */
const handleDelete = (row) => {
  const logIds = row.id || ids;
  proxy
    .$confirm('是否确认删除编号为"' + logIds + '"的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return proxy.delNotice(logIds.value);
    })
    .then(() => {
      getList();
      proxy.msgSuccess("删除成功");
    })
    .catch(function () {});
};
</script>

<style>
.p-style {
  -webkit-line-clamp: 1;
  display: -webkit-box;
}
</style>
