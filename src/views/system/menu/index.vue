<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="菜单名称">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入菜单名称"
          clearable
          size="default"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="状态">
              <el-select v-model="queryParams.status" placeholder="菜单状态" clearable size="default">
                <el-option
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>-->
      <el-form-item>
        <el-button
          type="primary"
          :icon="Search"
          size="default"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button type="primary" :icon="Plus" size="default" @click="handleAdd"
          >新增</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="menuList"
      row-key="id"
      border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        prop="name"
        label="菜单名称"
        :show-overflow-tooltip="true"
        width="200"
        fixed=""
      ></el-table-column>
      <el-table-column prop="icon" label="图标" align="center" width="100">
        <template v-slot="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column
        prop="perms"
        label="权限标识"
        width="100"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="path"
        label="路由地址"
        width="150"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="url"
        label="组件路径"
        width="200"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="visible"
        label="是否可见"
        width="100"
        :formatter="visibleFormat"
      ></el-table-column>
      <el-table-column prop="order" label="排序" width="60"></el-table-column>
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
        width="200"
        fixed="right"
      >
        <template v-slot="scope">
          <el-button
            size="default"
            type="primary"
            link
            :icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['menu:edit']"
            >修改</el-button
          >
          <el-button
            size="default"
            type="primary"
            link
            :icon="Plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['menu:edit']"
            >新增</el-button
          >
          <el-button
            size="default"
            type="primary"
            link
            :icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['menu:delete']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="addFormRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <treeselect
                v-model="form.pid"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="type">
              <el-radio-group v-model="form.type">
                <el-radio
                  v-for="item in typeOptions"
                  :label="item.id"
                  :key="item.id"
                  >{{ item.value }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.type != 2" label="菜单图标">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <template v-slot:reference>
                  <el-input
                    v-model="form.icon"
                    placeholder="点击选择图标"
                    readonly
                  >
                    <template v-slot:prefix v-if="form.icon">
                      <svg-icon
                        :icon-class="form.icon"
                        class="el-input__icon"
                        style="height: 32px; width: 16px"
                      />
                    </template>
                    <template v-slot:prefix v-else>
                      <el-icon class="el-input__icon"><Search /></el-icon>
                    </template>
                  </el-input>
                </template>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="order">
              <el-input-number
                v-model="form.order"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.type != 2" label="路由地址" prop="path">
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.type == 1">
            <el-form-item label="组件路径" prop="url">
              <el-input v-model="form.url" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.type != 0" label="权限标识">
              <el-input
                v-model="form.perms"
                placeholder="请权限标识"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.type != 2" label="是否可见">
              <el-select v-model="form.visible" placeholder="请选择">
                <el-option
                  v-for="item in visibleOptions"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
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

<script setup name="Menu">
import { Search, Plus, Edit, Delete } from "@element-plus/icons-vue";
import {
  listMenu,
  getMenu,
  delMenu,
  addMenu,
  updateMenu,
} from "@/api/system/menu";
import Treeselect from "vue3-treeselect";
import "vue3-treeselect/dist/vue3-treeselect.css";
import IconSelect from "@/components/IconSelect/index.vue";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

const { proxy } = getCurrentInstance();
const addFormRef = ref();
const router = useRouter();

// 遮罩层
const loading = ref(true);
// 菜单表格树数据
const menuList = ref([]);
// 菜单树选项
const menuOptions = ref([]);
// 弹出层标题
const title = ref();
// 是否显示弹出层
const open = ref(false);
// 显示状态数据字典
const visibleOptions = ref([
  { dictValue: 0, dictLabel: "显示" },
  { dictValue: 1, dictLabel: "隐藏" },
]);
// 菜单状态数据字典
const statusOptions = ref([]);
// 查询参数
const queryParams = reactive({
  menuName: undefined,
  visible: undefined,
});
const typeOptions = ref([
  // { id: 0, value: "目录"};
  { id: 1, value: "菜单" },
  { id: 2, value: "按钮" },
]);
// 表单参数
const form = ref({});
// 表单校验
const rules = ref({
  name: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }],
  order: [{ required: true, message: "菜单顺序不能为空", trigger: "blur" }],
  path: [{ required: true, message: "路由地址不能为空", trigger: "blur" }],
});

onMounted(() => {
  getList();
  // proxy.getDicts("sys_show_hide").then(response => {
  //   visibleOptions = response.data;
  // });
  // proxy.getDicts("sys_normal_disable").then(response => {
  //   statusOptions = response.data;
  // });
});

// 选择图标
const selected = (name) => {
  form.value.icon = name;
};
/** 查询菜单列表 */
const getList = () => {
  loading.value = true;
  listMenu(queryParams).then((response) => {
    menuList.value = proxy.handleTree(response.data, "id");
    loading.value = false;
  });
};
/** 转换菜单数据结构 */
const normalizer = (node) => {
  if (node.children && !node.children.length) {
    delete node.children;
  }
  return {
    id: node.id,
    label: node.name,
    children: node.children,
  };
};
/** 查询菜单下拉树结构 */
const getTreeselect = () => {
  listMenu().then((response) => {
    menuOptions.value = [];
    const menu = { id: "0", name: "主类目", children: [] };
    menu.children = proxy.handleTree(response.data, "id");
    menuOptions.value.push(menu);
  });
};
// 显示状态字典翻译
const visibleFormat = (row, column) => {
  return proxy.selectDictLabel(visibleOptions.value, row.visible);
};
// 菜单状态字典翻译
const statusFormat = (row, column) => {
  if (row.type == 2) {
    return "";
  }
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
    id: undefined,
    pId: undefined,
    name: undefined,
    icon: undefined,
    type: 1,
    order: undefined,
    visible: 0,
    perms: "#",
    url: "#",
  };
  proxy.resetForm("addFormRef");
};
/** 搜索按钮操作 */
const handleQuery = () => {
  getList();
};
/** 新增按钮操作 */
const handleAdd = (row) => {
  reset();
  getTreeselect();
  if (row != null) {
    form.value.pid = row.id;
  }
  open.value = true;
  title.value = "添加菜单";
};
/** 修改按钮操作 */
const handleUpdate = (row) => {
  reset();
  getTreeselect();
  getMenu(row.id).then((response) => {
    form.value = response.data;
    open.value = true;
    title.value = "修改菜单";
  });
};
/** 提交按钮 */
const submitForm = () => {
  addFormRef.value.validate((valid) => {
    if (valid) {
      if (form.value.id != undefined) {
        updateMenu(form.value).then((response) => {
          if (response.code === 200) {
            proxy.msgSuccess("修改成功");
            open.value = false;
            getList();
          } else {
            proxy.msgError(response.msg);
          }
        });
      } else {
        addMenu(form.value).then((response) => {
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
    .$confirm('是否确认删除名称为"' + row.name + '"的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(function () {
      return delMenu(row.id);
    })
    .then(() => {
      getList();
      proxy.msgSuccess("删除成功");
    })
    .catch(function () {});
};
</script>
