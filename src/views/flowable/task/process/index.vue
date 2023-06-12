<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="名称" prop="name">
        <el-input
          v-model:value="queryParams.name"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始时间" prop="deployTime">
        <el-date-picker
          clearable
          size="small"
          v-model:value="queryParams.deployTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择时间"
        >
        </el-date-picker>
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
          plain
          :icon="ElIconPlus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:deployment:add']"
          >新增流程</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          :icon="ElIconDelete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:deployment:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          :icon="ElIconDownload"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:deployment:export']"
          >导出</el-button
        >
      </el-col>
      <!-- <right-toolbar
              :showSearch.sync="showSearch"
              @queryTable="getList"
            ></right-toolbar> -->
    </el-row>

    <el-table
      v-loading="loading"
      :data="myProcessList"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="流程编号"
        align="center"
        prop="procInsId"
        width="200px"
        fixed
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="流程名称"
        align="center"
        prop="procDefName"
        width="200px"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="流程类别"
        align="center"
        prop="category"
        width="100px"
        :formatter="categoryFormat"
      />
      <el-table-column label="流程版本" align="center" width="80px">
        <template v-slot="scope">
          <el-tag size="medium">v{{ scope.row.procDefVersion }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="提交时间"
        align="center"
        prop="createTime"
        width="180"
      />
      <el-table-column label="流程状态" align="center" width="100">
        <template v-slot="scope">
          <el-tag v-if="scope.row.finishTime == null" size="mini"
            >进行中</el-tag
          >
          <el-tag type="success" v-if="scope.row.finishTime != null" size="mini"
            >已完成</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        label="耗时"
        align="center"
        prop="duration"
        width="180"
      />
      <el-table-column label="当前节点" align="center" prop="taskName" />
      <el-table-column label="办理" align="center">
        <template v-slot="scope">
          <label v-if="scope.row.assigneeName"
            >{{ scope.row.assigneeName }}
            <el-tag type="info" size="mini">{{
              scope.row.deptName
            }}</el-tag></label
          >
          <label v-if="scope.row.candidate">{{ scope.row.candidate }}</label>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template v-slot="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              更多操作<el-icon class="el-icon--right"
                ><el-icon-arrow-down
              /></el-icon>
            </span>
            <template v-slot:dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  :icon="ElIconTickets"
                  @click="handleFlowRecord(scope.row)"
                >
                  详情
                </el-dropdown-item>
                <el-dropdown-item
                  :icon="ElIconCircleClose"
                  @click="handleStop(scope.row)"
                >
                  取消申请
                </el-dropdown-item>
                <el-dropdown-item
                  :icon="ElIconDelete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:deployment:remove']"
                >
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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

    <!-- 发起流程 -->
    <el-dialog :title="title" v-model:value="open" width="60%" append-to-body>
      <el-table v-loading="processLoading" fit :data="definitionList" border>
        <el-table-column label="流程名称" align="center" prop="name" />
        <el-table-column label="流程版本" align="center">
          <template v-slot="scope">
            <el-tag size="medium">v{{ scope.row.version }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="流程分类"
          align="center"
          prop="category"
          :formatter="categoryFormat"
        />
        <el-table-column
          label="操作"
          align="center"
          width="300"
          class-name="small-padding fixed-width"
        >
          <template v-slot="scope">
            <el-button
              size="mini"
              type="text"
              :icon="ElIconEditOutline"
              @click="handleStartProcess(scope.row)"
              >发起流程</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="processTotal > 0"
        :total="processTotal"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="listDefinition"
      />
    </el-dialog>
  </div>
</template>

<script>
import {
  ArrowDown as ElIconArrowDown,
  Search as ElIconSearch,
  Refresh as ElIconRefresh,
  Plus as ElIconPlus,
  Delete as ElIconDelete,
  Download as ElIconDownload,
  Tickets as ElIconTickets,
  CircleClose as ElIconCircleClose,
  EditOutline as ElIconEditOutline,
} from '@element-plus/icons'
import {
  getDeployment,
  delDeployment,
  addDeployment,
  updateDeployment,
  exportDeployment,
  flowRecord,
} from '@/api/flowable/finished'
import {
  myProcessList,
  stopProcess,
  applyFlowList,
} from '@/api/flowable/process'
import { listDefinition } from '@/api/flowable/definition'
export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      processLoading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      processTotal: 0,
      // 我发起的流程列表数据
      myProcessList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      src: '',
      definitionList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        category: null,
        key: null,
        tenantId: null,
        deployTime: null,
        derivedFrom: null,
        derivedFromRoot: null,
        parentDeploymentId: null,
        engineVersion: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      categorys: [],
      ElIconSearch,
      ElIconRefresh,
      ElIconPlus,
      ElIconDelete,
      ElIconDownload,
      ElIconTickets,
      ElIconCircleClose,
      ElIconEditOutline,
    }
  },
  components: {
    ElIconArrowDown,
  },
  name: 'Deploy',
  created() {
    this.getDicts('sys_process_category').then((res) => {
      this.categorys = res.data
    })
    this.getList()
  },
  methods: {
    categoryFormat(row, column) {
      return this.selectDictLabel(this.categorys, row.category)
    },
    /** 查询流程定义列表 */
    getList() {
      this.loading = true
      myProcessList(this.queryParams).then((response) => {
        this.myProcessList = response.rows
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
        id: null,
        name: null,
        category: null,
        key: null,
        tenantId: null,
        deployTime: null,
        derivedFrom: null,
        derivedFromRoot: null,
        parentDeploymentId: null,
        engineVersion: null,
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
      this.ids = selection.map((item) => item.procInsId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true
      this.title = '发起流程'
      this.listDefinition()
    },
    listDefinition() {
      applyFlowList(this.queryParams).then((response) => {
        this.definitionList = response.rows
        this.processTotal = response.total
        this.processLoading = false
      })
    },
    /**  发起流程申请 */
    handleStartProcess(row) {
      this.$router.push({
        path: '/flowable/task/record/index',
        query: {
          deployId: row.deploymentId,
          procDefId: row.id,
          finished: true,
        },
      })
    },
    /**  取消流程申请 */
    handleStop(row) {
      const params = {
        instanceId: row.procInsId,
      }
      stopProcess(params).then((res) => {
        this.msgSuccess(res.msg)
        this.getList()
      })
    },
    /** 流程流转记录 */
    handleFlowRecord(row) {
      this.$router.push({
        path: '/flowable/task/record/index',
        query: {
          procInsId: row.procInsId,
          deployId: row.deployId,
          taskId: row.taskId,
          finished: false,
        },
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getDeployment(id).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '修改流程定义'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateDeployment(this.form).then((response) => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addDeployment(this.form).then((response) => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      debugger
      const ids = row.procInsId || this.ids
      this.$confirm(
        '是否确认删除流程定义编号为"' + ids + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(function () {
          return delDeployment(ids)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有流程定义数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(function () {
          return exportDeployment(queryParams)
        })
        .then((response) => {
          this.download(response.msg)
        })
    },
  },
}
</script>
