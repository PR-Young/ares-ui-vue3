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
            size="mini"
            type="text"
            :icon="ElIconView"
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
    <el-dialog
      :title="title"
      v-model="showDetail"
      width="880px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
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

<script>
import {
  Search as ElIconSearch,
  Refresh as ElIconRefresh,
  View as ElIconView,
} from '@element-plus/icons'
import { listLog } from '@/api/system/log'

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
      logList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      showDetail: false,
      // 状态数据字典
      methodOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        hostIp: undefined,
        userName: undefined,
        requestMethod: undefined,
        sortColumn: undefined,
        sortAsc: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      ElIconSearch,
      ElIconRefresh,
      ElIconView,
    }
  },
  name: 'SysLog',
  created() {
    this.getList()
    this.getDicts('sys_log_method').then((response) => {
      this.methodOptions = response.data
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
      listLog(this.queryParams).then((response) => {
        this.logList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 公告状态字典翻译
    methodFormat(row, column) {
      return this.selectDictLabel(this.methodOptions, row.requestMethod)
    },
    // 取消按钮
    cancel() {
      this.showDetail = false
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
    handleShowDetail(row) {
      this.reset()
      this.form = row
      this.showDetail = true
      this.title = '日志详情'
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const logIds = row.id || this.ids
      this.$confirm('是否确认删除编号为"' + logIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
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
