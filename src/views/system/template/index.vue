<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="模版名称" prop="subject">
        <el-input
          v-model="queryParams.subject"
          placeholder="请输入模版名称"
          clearable
          size="default"
          style="width: 240px"
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
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button :icon="ElIconRefresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          :icon="ElIconPlus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['sysTemplate:edit']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          :icon="ElIconEdit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['sysTemplate:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          :icon="ElIconDelete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['sysTemplate:delete']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          :icon="ElIconDownload"
          size="mini"
          @click="handleExport"
          v-hasPermi="['sysTemplate:export']"
          >导出</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      border
      :data="templateList"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="模版名称"
        align="center"
        prop="name"
        fixed
        width="200"
      />
      <el-table-column
        label="模版标题"
        align="center"
        prop="subject"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="模版内容"
        align="center"
        prop="text"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="模版html"
        align="center"
        prop="html"
        width="300"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="模版参数" align="center" prop="param" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        sortable="custom"
        width="180"
      >
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
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
            size="mini"
            link
            :icon="ElIconEdit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['sysTemplate:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            link
            :icon="ElIconDelete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['sysTemplate:delete']"
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="模版名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入模版名称" />
        </el-form-item>
        <el-form-item label="模版标题" prop="subject">
          <el-input v-model="form.subject" placeholder="请输入模版标题" />
        </el-form-item>
        <el-form-item label="模版内容" prop="text">
          <el-input
            v-model="form.text"
            type="textarea"
            placeholder="请输入模版内容"
          />
        </el-form-item>
        <el-form-item label="模版html" prop="html">
          <el-input
            v-model="form.html"
            type="textarea"
            placeholder="请输入模版内容"
          />
        </el-form-item>
        <el-form-item label="模版参数" prop="param">
          <el-input
            v-model="form.param"
            type="textarea"
            placeholder="请输入模版参数"
          />
        </el-form-item>
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

<script>
import {
  Search as ElIconSearch,
  Refresh as ElIconRefresh,
  Plus as ElIconPlus,
  Edit as ElIconEdit,
  Delete as ElIconDelete,
  Download as ElIconDownload,
} from '@element-plus/icons'
import {
  listTemplate,
  getTemplate,
  delTemplate,
  addTemplate,
  updateTemplate,
  exportTemplate,
} from '@/api/system/template'

export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 参数表格数据
      templateList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 类型数据字典
      typeOptions: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        sortColumn: undefined,
        sortAsc: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: '模版名称不能为空', trigger: 'blur' },
        ],
        subject: [
          { required: true, message: '模版标题不能为空', trigger: 'blur' },
        ],
        html: [
          { required: true, message: '模版内容不能为空', trigger: 'blur' },
        ],
      },
      ElIconSearch,
      ElIconRefresh,
      ElIconPlus,
      ElIconEdit,
      ElIconDelete,
      ElIconDownload,
    }
  },
  name: 'Template',
  created() {
    this.getList()
  },
  methods: {
    sortChange(data) {
      const { prop, order } = data
      this.queryParams.sortColumn = prop
      this.queryParams.sortAsc = order === null ? 'descending' : order
      this.getList()
    },
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listTemplate(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.templateList = response.rows
          this.total = response.total
          this.loading = false
        }
      )
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        name: undefined,
        subject: undefined,
        text: undefined,
        html: undefined,
        param: undefined,
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加参数'
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const templateId = row.id || this.ids
      getTemplate(templateId).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '修改参数'
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateTemplate(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addTemplate(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const templateIds = row.id || this.ids
      this.$confirm(
        '是否确认删除参数编号为"' + templateIds + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(function () {
          return delTemplate(templateIds)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(function () {})
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有参数数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(function () {
          return exportTemplate(queryParams)
        })
        .then((response) => {
          this.download(response.msg)
        })
        .catch(function () {})
    },
  },
}
</script>
