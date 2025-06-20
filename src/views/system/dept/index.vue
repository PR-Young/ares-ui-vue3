<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="部门名称">
        <el-input
          v-model="queryParams.deptName"
          placeholder="请输入部门名称"
          clearable
          size="default"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="queryParams.status"
          placeholder="部门状态"
          clearable
          size="default"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          class="filter-item"
          type="primary"
          :icon="Search"
          size="default"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button
          class="filter-item"
          type="primary"
          :icon="Plus"
          size="default"
          @click="handleAdd"
          v-hasPermi="['system:dept:add']"
          >新增</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="deptList"
      row-key="deptId"
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        prop="deptName"
        label="部门名称"
        width="260"
      ></el-table-column>
      <el-table-column
        prop="orderNum"
        label="排序"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        :formatter="statusFormat"
        width="100"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
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
      >
        <template v-slot="scope">
          <el-button
            size="default"
            type="primary"
            link
            :icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:dept:edit']"
            >修改</el-button
          >
          <el-button
            size="default"
            type="primary"
            link
            :icon="Plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:dept:add']"
            >新增</el-button
          >
          <el-button
            v-if="scope.row.parentId != 0"
            size="default"
            type="primary"
            link
            :icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:dept:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="addFormRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24" v-if="form.parentId !== 0">
            <el-form-item label="上级部门" prop="parentId">
              <treeselect
                v-model="form.parentId"
                :options="deptOptions"
                :normalizer="normalizer"
                placeholder="选择上级部门"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门名称" prop="deptName">
              <el-input v-model="form.deptName" placeholder="请输入部门名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number
                v-model="form.orderNum"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-input
                v-model="form.leader"
                placeholder="请输入负责人"
                maxlength="20"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input
                v-model="form.phone"
                placeholder="请输入联系电话"
                maxlength="11"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="form.email"
                placeholder="请输入邮箱"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                  >{{ dict.dictLabel }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Dept">
import { Search, Plus, Edit, Delete } from "@element-plus/icons-vue";
import {
  listDept,
  getDept,
  delDept,
  addDept,
  updateDept,
} from "@/api/system/dept";
import Treeselect from "vue3-treeselect";
import "vue3-treeselect/dist/vue3-treeselect.css";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

const { proxy } = getCurrentInstance();
const addFormRef = ref();
const router = useRouter();
// 遮罩层
const loading = ref(true);
// 表格树数据
const deptList = ref([]);
// 部门树选项
const deptOptions = ref([]);
// 弹出层标题
const title = ref();
// 是否显示弹出层
const open = ref(false);
// 状态数据字典
const statusOptions = ref([]);
// 查询参数
const queryParams = reactive({
  deptName: undefined,
  status: undefined,
});
// 表单参数
const form = ref({});
// 表单校验
const rules = ref({
  parentId: [{ required: true, message: "上级部门不能为空", trigger: "blur" }],
  deptName: [{ required: true, message: "部门名称不能为空", trigger: "blur" }],
  orderNum: [{ required: true, message: "菜单顺序不能为空", trigger: "blur" }],
  email: [
    {
      type: "email",
      message: "'请输入正确的邮箱地址",
      trigger: ["blur", "change"],
    },
  ],
  phone: [
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
});

onMounted(() => {
  getList();
  proxy.getDicts("sys_normal_disable").then((response) => {
    statusOptions.value = response.data;
  });
});

/** 查询部门列表 */
const getList = () => {
  loading.value = true;
  listDept(queryParams).then((response) => {
    deptList.value = proxy.handleTree(response.data, "deptId");
    loading.value = false;
  });
};
/** 转换部门数据结构 */
const normalizer = (node) => {
  if (node.children && !node.children.length) {
    delete node.children;
  }
  return {
    id: node.deptId,
    label: node.deptName,
    children: node.children,
  };
};
/** 查询部门下拉树结构 */
const getTreeselect = () => {
  listDept().then((response) => {
    deptOptions.value = proxy.handleTree(response.data, "deptId");
  });
};
// 字典状态字典翻译
const statusFormat = (row, column) => {
  return proxy.selectDictLabel(statusOptions.value, row.status);
};
// 取消按钮
const cancel = () => {
  open.value = false;
  reset();
};
// 表单重置
const reset = () => {
  form.value = {
    deptId: undefined,
    parentId: undefined,
    deptName: undefined,
    orderNum: undefined,
    leader: undefined,
    phone: undefined,
    email: undefined,
    status: "0",
  };
  proxy.resetForm("form");
};
/** 搜索按钮操作 */
const handleQuery = () => {
  getList();
};
/** 新增按钮操作 */
const handleAdd = (row) => {
  reset();
  getTreeselect();
  if (row != undefined) {
    form.value.parentId = row.deptId;
  }
  open.value = true;
  title.value = "添加部门";
};
/** 修改按钮操作 */
const handleUpdate = (row) => {
  reset();
  getTreeselect();
  getDept(row.deptId).then((response) => {
    form.value = response.data;
    open.value = true;
    title.value = "修改部门";
  });
};
/** 提交按钮 */
const submitForm = () => {
  addFormRef.value.validate((valid) => {
    if (valid) {
      if (form.value.deptId != undefined) {
        updateDept(form).then((response) => {
          if (response.code === 200) {
            proxy.msgSuccess("修改成功");
            open.value = false;
            getList();
          } else {
            proxy.msgError(response.msg);
          }
        });
      } else {
        addDept(form).then((response) => {
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
  proxy
    .$confirm('是否确认删除名称为"' + row.deptName + '"的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return delDept(row.deptId);
    })
    .then(() => {
      getList();
      proxy.msgSuccess("删除成功");
    })
    .catch(function () {});
};
</script>
