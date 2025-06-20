<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="公告标题" prop="noticeTitle">
        <el-input
          v-model="queryParams.noticeTitle"
          placeholder="请输入公告标题"
          clearable
          size="default"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="noticeType">
        <el-select
          v-model="queryParams.noticeType"
          placeholder="公告类型"
          clearable
          size="default"
          style="width: 120px"
        >
          <el-option
            v-for="dict in typeOptions"
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          :icon="Plus"
          size="default"
          @click="handleAdd"
          v-hasPermi="['notice:edit']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          :icon="Edit"
          size="default"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['notice:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          :icon="Delete"
          size="default"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['notice:delete']"
          >删除</el-button
        >
      </el-col>
    </el-row>

    <el-table
      border
      v-loading="loading"
      :data="noticeList"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="公告标题"
        align="center"
        prop="noticeTitle"
        :show-overflow-tooltip="true"
        width="200"
        fixed=""
      />
      <el-table-column
        label="公告类型"
        align="center"
        prop="noticeType"
        :formatter="typeFormat"
        width="200"
      />
      <el-table-column
        label="公告内容"
        align="center"
        prop="noticeContent"
        :show-overflow-tooltip="true"
        width="300"
      >
        <!-- <template slot-scope="scope">
                <p class="p-style" v-html="scope.row.noticeContent"></p>
              </template> -->
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        prop="noticeStatus"
        :formatter="statusFormat"
        width="300"
      />
      <el-table-column
        label="到期时间"
        align="center"
        prop="deadline"
        width="200"
      >
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.deadline) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
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
          <el-button
            size="default"
            type="primary"
            link
            :icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['notice:edit']"
            >修改</el-button
          >
          <el-button
            size="default"
            type="primary"
            link
            :icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['notice:delete']"
            >删除</el-button
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
    <el-dialog :title="title" v-model="open" width="880px" append-to-body>
      <el-form ref="addFormRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="公告标题" prop="noticeTitle">
              <el-input
                v-model="form.noticeTitle"
                placeholder="请输入公告标题"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公告类型" prop="noticeType">
              <el-select v-model="form.noticeType" placeholder="请选择">
                <el-option
                  v-for="dict in typeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.noticeStatus">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                  >{{ dict.dictLabel }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="到期时间">
              <el-date-picker
                v-model="form.deadline"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择到期时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容">
              <Editor v-model="form.noticeContent" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer" style="padding-top: 20px">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog :title="title" v-model="showDetail" width="880px" append-to-body>
      <el-form ref="addFormRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="公告标题" prop="noticeTitle">
              <el-input
                disabled
                v-model="form.noticeTitle"
                placeholder="请输入公告标题"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公告类型" prop="noticeType">
              <el-select
                disabled
                v-model="form.noticeType"
                placeholder="请选择"
              >
                <el-option
                  v-for="dict in typeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.noticeStatus">
                <el-radio
                  disabled
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                  >{{ dict.dictLabel }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="到期时间">
              <el-date-picker
                disabled
                v-model="form.deadline"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择到期时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容">
              <Editor v-model="form.noticeContent" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer" style="padding-top: 20px"></div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Notice">
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  View,
} from "@element-plus/icons-vue";
import {
  listNotice,
  getNotice,
  delNotice,
  editNotice,
} from "@/api/system/notice";
import Editor from "@/components/Editor/index.vue";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

const { proxy } = getCurrentInstance();
const addFormRef = ref();
const router = useRouter();

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
const noticeList = ref([]);
// 弹出层标题
const title = ref();
// 是否显示弹出层
const open = ref(false);
const showDetail = ref(false);
// 类型数据字典
const statusOptions = ref([]);
// 状态数据字典
const typeOptions = ref([]);
// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  noticeTitle: undefined,
  createBy: undefined,
  status: undefined,
  sortColumn: undefined,
  sortAsc: undefined,
});
// 表单参数
const form = ref({});
// 表单校验
const rules = ref({
  noticeTitle: [
    { required: true, message: "公告标题不能为空", trigger: "blur" },
  ],
  noticeType: [
    { required: true, message: "公告类型不能为空", trigger: "blur" },
  ],
  deadline: [{ required: true, message: "到期时间不能为空", trigger: "blur" }],
});

onMounted(() => {
  getList();
  proxy.getDicts("sys_notice_status").then((response) => {
    statusOptions.value = response.data;
  });
  proxy.getDicts("sys_notice_type").then((response) => {
    typeOptions.value = response.data;
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
  listNotice(queryParams).then((response) => {
    noticeList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
};
// 公告状态字典翻译
const statusFormat = (row, column) => {
  return proxy.selectDictLabel(statusOptions.value, row.noticeStatus);
};
// 公告状态字典翻译
const typeFormat = (row, column) => {
  return proxy.selectDictLabel(typeOptions.value, row.noticeType);
};
// 取消按钮
const cancel = () => {
  open.value = false;
  reset();
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
  proxy.resetForm("form");
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
/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  open.value = true;
  title.value = "添加公告";
};
/** 修改按钮操作 */
const handleUpdate = (row) => {
  reset();
  const noticeId = row.id || ids;
  getNotice(noticeId).then((response) => {
    form.value = response.data;
    open.value = true;
    title.value = "修改公告";
  });
};
const handleShowDetail = (row) => {
  reset();
  const noticeId = row.id || ids;
  getNotice(noticeId).then((response) => {
    form.value = response.data;
    showDetail.value = true;
    title.value = "公告详情";
  });
};
/** 提交按钮 */
const submitForm = () => {
  addFormRef.value.validate((valid) => {
    if (valid) {
      if (form.value.id != undefined) {
        editNotice(form).then((response) => {
          if (response.code === 200) {
            proxy.msgSuccess("修改成功");
            open.value = false;
            getList();
          } else {
            proxy.msgError(response.msg);
          }
        });
      } else {
        editNotice(form).then((response) => {
          if (response.code === 200) {
            proxy.msgSuccess("新增成功");
            open.value = false;
            getList();
          } else {
            proxy.msgError(response.msg);
          }
        });
      }
    }
  });
};
/** 删除按钮操作 */
const handleDelete = (row) => {
  const noticeIds = row.id || ids;
  proxy
    .$confirm('是否确认删除公告编号为"' + noticeIds + '"的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return delNotice(noticeIds);
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
