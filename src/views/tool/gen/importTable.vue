<template>
  <!-- 导入表 -->
  <el-dialog
    title="导入表"
    v-model="visible"
    width="800px"
    top="5vh"
    append-to-body
  >
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="表名称" prop="tableName">
        <el-input
          v-model="queryParams.tableName"
          placeholder="请输入表名称"
          clearable
          size="default"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="表描述" prop="tableComment">
        <el-input
          v-model="queryParams.tableComment"
          placeholder="请输入表描述"
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
    <el-row>
      <el-table
        @row-click="clickRow"
        ref="tableRef"
        :data="dbTableList"
        @selection-change="handleSelectionChange"
        height="260px"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="tableName" label="表名称"></el-table-column>
        <el-table-column prop="tableComment" label="表描述"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-row>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleImportTable">确 定</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="">
import { Search, Refresh } from "@element-plus/icons-vue";
import { listDbTable, importTable } from "@/api/tool/gen";
import { ref, reactive, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

// 遮罩层
const visible = ref(false);
// 选中数组值
const tables = ref([]);
// 总条数
const total = ref(0);
// 表数据
const dbTableList = ref([]);
// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  tableName: undefined,
  tableComment: undefined,
});
const tableRef = ref();

const emit = defineEmits(["ok"]);

// 显示弹框
const show = () => {
  getList();
  visible.value = true;
};
const clickRow = (row) => {
  tableRef.value.table.toggleRowSelection(row);
};
// 多选框选中数据
const handleSelectionChange = (selection) => {
  tables.value = selection.map((item) => item.tableName);
};
// 查询表数据
const getList = () => {
  listDbTable(queryParams).then((res) => {
    if (res.code === 200) {
      dbTableList.value = res.rows;
      total.value = res.total;
    }
  });
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
/** 导入按钮操作 */
const handleImportTable = () => {
  importTable({ tables: tables.value.join(",") }).then((res) => {
    proxy.msgSuccess(res.msg);
    if (res.code === 200) {
      visible.value = false;
      emit(this, "ok");
    }
  });
};
</script>
