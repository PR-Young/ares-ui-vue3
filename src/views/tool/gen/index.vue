<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
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
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          size="default"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="ElIconSearch"
          size="default"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button :icon="ElIconRefresh" size="default" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <!-- <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                type="primary"
                icon="el-icon-download"
                size="default"
                @click="handleGenTable"

              >生成</el-button>
            </el-col>
          </el-row>-->

    <el-table v-loading="loading" :data="tableList">
      <el-table-column
        label="表名称"
        align="center"
        prop="TABLE_NAME"
        :show-overflow-tooltip="true"
        width="400"
      />
      <el-table-column
        label="表描述"
        align="center"
        prop="TABLE_COMMENT"
        :show-overflow-tooltip="true"
        width="400"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="CREATE_TIME"
        width="200"
      >
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.CREATE_TIME) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        prop="UPDATE_TIME"
        width="200"
      >
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.UPDATE_TIME) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template v-slot="scope">
          <el-button
            link
            size="default"
            :icon="ElIconView"
            @click="handlePreview(scope.row)"
            v-hasPermi="['tool:gen:preview']"
            >预览</el-button
          >
          <el-button
            link
            size="default"
            :icon="ElIconDownload"
            @click="handleGenTable(scope.row)"
            >生成代码</el-button
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
    <!-- 预览界面 -->
    <el-dialog
      :header="preview.title"
      v-model="preview.open"
      width="80%"
      top="5vh"
      append-to-body
    >
      <el-tabs v-model="preview.activeName">
        <el-tab-pane
          v-for="(value, key) in preview.data"
          :label="key.substring(key.lastIndexOf('/') + 1, key.indexOf('.vm'))"
          :name="key.substring(key.lastIndexOf('/') + 1, key.indexOf('.vm'))"
          :key="key"
        >
          <pre>{{ value }}</pre>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <import-table ref="import" @ok="handleQuery" />
  </div>
</template>

<script>
import {
  Search as ElIconSearch,
  Refresh as ElIconRefresh,
  View as ElIconView,
  Download as ElIconDownload,
} from "@element-plus/icons";
import { listDbTable, previewTable, delTable } from "@/api/tool/gen";
import importTable from "./importTable.vue";
import { downLoadZip } from "@/utils/zipdownload";
export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 唯一标识符
      uniqueId: "",
      // 选中数组
      ids: [],
      // 选中表数组
      tableNames: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 表数据
      tableList: [],
      // 日期范围
      dateRange: "",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tableName: undefined,
        tableComment: undefined,
      },
      // 预览参数
      preview: {
        open: false,
        title: "代码预览",
        data: {},
        activeName: "domain.java",
      },
      ElIconSearch,
      ElIconRefresh,
      ElIconView,
      ElIconDownload,
    };
  },
  name: "Gen",
  components: { importTable },
  created() {
    this.getList();
  },
  activated() {
    const time = this.$route.query.t;
    if (time != null && time != this.uniqueId) {
      this.uniqueId = time;
      this.resetQuery();
    }
  },
  methods: {
    /** 查询表集合 */
    getList() {
      this.loading = true;
      listDbTable(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.tableList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 生成代码操作 */
    handleGenTable(row) {
      const tableNames = row.TABLE_NAME;
      if (tableNames == "") {
        this.msgError("请选择要生成的数据");
        return;
      }
      downLoadZip("ares/tool/gen/genCode/" + tableNames, "code");
    },
    /** 打开导入表弹窗 */
    openImportTable() {
      this.$refs.import.show();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 预览按钮 */
    handlePreview(row) {
      previewTable(row.tableId).then((response) => {
        this.preview.data = response.data;
        this.preview.open = true;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.tableId);
      this.tableNames = selection.map((item) => item.tableName);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleEditTable(row) {
      const tableId = row.tableId || this.ids[0];
      this.$router.push({ path: "/genedit/edit", query: { tableId: tableId } });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const tableIds = row.tableId || this.ids;
      this.$confirm('是否确认删除表编号为"' + tableIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delTable(tableIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
  },
};
</script>
