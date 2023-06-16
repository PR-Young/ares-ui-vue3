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
          v-model:value="queryParams.noticeTitle"
          placeholder="请输入公告标题"
          clearable
          size="small"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="noticeType">
        <el-select
          v-model:value="queryParams.noticeType"
          placeholder="公告类型"
          clearable
          size="small"
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
          v-hasPermi="['notice:edit']"
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
          v-hasPermi="['notice:edit']"
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
            size="mini"
            type="text"
            :icon="ElIconView"
            @click="handleShowDetail(scope.row)"
            >查看</el-button
          >
          <el-button
            size="mini"
            type="text"
            :icon="ElIconEdit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['notice:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            :icon="ElIconDelete"
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
    <el-dialog :title="title" v-model:value="open" width="880px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="公告标题" prop="noticeTitle">
              <el-input
                v-model:value="form.noticeTitle"
                placeholder="请输入公告标题"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公告类型" prop="noticeType">
              <el-select v-model:value="form.noticeType" placeholder="请选择">
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
              <el-radio-group v-model:value="form.noticeStatus">
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
                v-model:value="form.deadline"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择到期时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容">
              <Editor v-model:value="form.noticeContent" />
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

    <el-dialog
      :title="title"
      v-model:value="showDetail"
      width="880px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="公告标题" prop="noticeTitle">
              <el-input
                disabled
                v-model:value="form.noticeTitle"
                placeholder="请输入公告标题"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公告类型" prop="noticeType">
              <el-select
                disabled
                v-model:value="form.noticeType"
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
              <el-radio-group v-model:value="form.noticeStatus">
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
                v-model:value="form.deadline"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择到期时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容">
              <Editor v-model:value="form.noticeContent" />
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

<script>
import {
  Search as ElIconSearch,
  Refresh as ElIconRefresh,
  Plus as ElIconPlus,
  Edit as ElIconEdit,
  Delete as ElIconDelete,
  View as ElIconView,
} from '@element-plus/icons'
import {
  listNotice,
  getNotice,
  delNotice,
  editNotice,
} from '@/api/system/notice'
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
      // 公告表格数据
      noticeList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      showDetail: false,
      // 类型数据字典
      statusOptions: [],
      // 状态数据字典
      typeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        noticeTitle: undefined,
        createBy: undefined,
        status: undefined,
        sortColumn: undefined,
        sortAsc: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        noticeTitle: [
          { required: true, message: '公告标题不能为空', trigger: 'blur' },
        ],
        noticeType: [
          { required: true, message: '公告类型不能为空', trigger: 'blur' },
        ],
        deadline: [
          { required: true, message: '到期时间不能为空', trigger: 'blur' },
        ],
      },
      ElIconSearch,
      ElIconRefresh,
      ElIconPlus,
      ElIconEdit,
      ElIconDelete,
      ElIconView,
    }
  },
  name: 'Notice',
  components: {
    Editor,
  },
  created() {
    this.getList()
    this.getDicts('sys_notice_status').then((response) => {
      this.statusOptions = response.data
    })
    this.getDicts('sys_notice_type').then((response) => {
      this.typeOptions = response.data
    })
  },
  methods: {
    sortChange(data) {
      const { prop, order } = data
      this.queryParams.sortColumn = prop
      this.queryParams.sortAsc = order === null ? 'descending' : order
      this.getList()
    },
    /** 查询公告列表 */
    getList() {
      this.loading = true
      listNotice(this.queryParams).then((response) => {
        this.noticeList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 公告状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.noticeStatus)
    },
    // 公告状态字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.noticeType)
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
        noticeTitle: undefined,
        noticeType: undefined,
        noticeContent: undefined,
        deadline: undefined,
        noticeStatus: '0',
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
      this.title = '添加公告'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const noticeId = row.id || this.ids
      getNotice(noticeId).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '修改公告'
      })
    },
    handleShowDetail(row) {
      this.reset()
      const noticeId = row.id || this.ids
      getNotice(noticeId).then((response) => {
        this.form = response.data
        this.showDetail = true
        this.title = '公告详情'
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            editNotice(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            editNotice(this.form).then((response) => {
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
      const noticeIds = row.id || this.ids
      this.$confirm(
        '是否确认删除公告编号为"' + noticeIds + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(function () {
          return delNotice(noticeIds)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(function () {})
    },
  },
}
</script>

<style>
.p-style {
  -webkit-line-clamp: 1;
  display: -webkit-box;
}
</style>
