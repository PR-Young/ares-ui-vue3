<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="文章标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入文章标题"
          clearable
          size="default"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文章作者" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入文章标题"
          clearable
          size="default"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文章类别" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择">
          <el-option
            v-for="item in typeOptions"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select>
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
          v-hasPermi="['articles:edit']"
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
          v-hasPermi="['articles:edit']"
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
          v-hasPermi="['articles:delete']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          :icon="ElIconDownload"
          size="mini"
          @click="handleExport"
          v-hasPermi="['articles:export']"
          >导出</el-button
        >
      </el-col>
    </el-row>

    <el-table
      border
      v-loading="loading"
      :data="articlesList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="文章标题"
        align="center"
        prop="title"
        fixed
        width="200"
      />
      <el-table-column
        label="文章作者"
        align="center"
        prop="name"
        width="120"
      />
      <el-table-column
        label="文章内容"
        align="center"
        prop="content"
        width="300"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="文章类别"
        align="center"
        prop="type"
        width="200"
        :formatter="typeFormat"
      />
      <el-table-column
        label="状态"
        align="center"
        prop="status"
        width="120"
        :formatter="statusFormat"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="修改时间"
        align="center"
        prop="modifyTime"
        width="180"
      >
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.modifyTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        fixed="right"
        width="180"
      >
        <template v-slot="scope">
          <el-button
            size="mini"
            type="text"
            :icon="ElIconEdit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['articles:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            :icon="ElIconDelete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['articles:delete']"
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

    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入文章标题" />
        </el-form-item>
        <el-form-item label="文章作者" prop="name">
          <el-input v-model="form.name" placeholder="请输入文章作者" />
        </el-form-item>
        <el-form-item label="文章类别" prop="type">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option
              v-for="item in typeOptions"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <Editor v-model="form.content" />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer" style="padding-top: 20px">
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
  listArticles,
  getArticles,
  delArticles,
  addArticles,
  updateArticles,
  exportArticles,
} from '@/api/articles'
import Editor from '@/components/Editor/index.vue'

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
      // 岗位表格数据
      articlesList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      typeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        name: undefined,
        type: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: '文章标题不能为空', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '文章作者不能为空', trigger: 'blur' },
        ],
        content: [
          { required: true, message: '文章内容不能为空', trigger: 'blur' },
        ],
        type: [
          { required: true, message: '文章类别不能为空', trigger: 'blur' },
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
  name: 'Articles',
  components: {
    Editor,
  },
  created() {
    this.getDicts('article_status').then((response) => {
      this.statusOptions = response.data
    })
    this.getDicts('article_types').then((response) => {
      this.typeOptions = response.data
    })
    this.getList()
  },
  methods: {
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type)
    },
    /** 查询岗位列表 */
    getList() {
      this.loading = true
      listArticles(this.queryParams).then((response) => {
        this.articlesList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        content: undefined,
        name: undefined,
        status: '1',
        title: undefined,
        type: undefined,
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
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加文章'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getArticles(id).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '修改文章'
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateArticles(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addArticles(this.form).then((response) => {
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
      const ids = row.id || this.ids
      this.$confirm('是否确认删除文章编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(function () {
          return delArticles(ids)
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
      this.$confirm('是否确认导出所有文章数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(function () {
          return exportArticles(queryParams)
        })
        .then((response) => {
          this.download(response.msg)
        })
        .catch(function () {})
    },
  },
}
</script>
