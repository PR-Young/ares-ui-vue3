<template>
  <div class="app-container">
    <el-tabs type="card" tab-position="left">
      <el-tab-pane label="交换器">
        <el-row class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              :icon="ElIconPlus"
              size="mini"
              @click="addExchange"
              >新增</el-button
            >
          </el-col>
        </el-row>
        <el-table v-loading="loading" border :data="exchangeList">
          <el-table-column label="name" align="center" prop="name" />
          <el-table-column label="type" align="center" prop="type" />
          <el-table-column label="vhost" align="center" prop="vhost" />
          <el-table-column
            label="message_stats"
            align="center"
            prop="message_stats"
            :formatter="stringFormat"
          />
          <el-table-column
            label="durable"
            align="center"
            prop="durable"
            :formatter="stringFormat"
          />
          <el-table-column
            label="internal"
            align="center"
            prop="internal"
            :formatter="stringFormat"
          />
          <el-table-column
            label="auto_delete"
            align="center"
            prop="auto_delete"
            :formatter="stringFormat"
          />
          <el-table-column
            label="操作"
            align="center"
            width="100"
            class-name="small-padding fixed-width"
          >
            <template v-slot="scope">
              <el-button
                size="mini"
                type="text"
                :icon="ElIconDelete"
                @click="handleExchangeDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="队列">
        <el-row class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              :icon="ElIconPlus"
              size="mini"
              @click="addQueue"
              >新增</el-button
            >
          </el-col>
        </el-row>
        <el-table v-loading="loading" border :data="queueList">
          <el-table-column label="name" align="center" prop="name" />
          <el-table-column label="node" align="center" prop="node" />
          <el-table-column label="vhost" align="center" prop="vhost" />
          <el-table-column label="consumers" align="center" prop="consumers" />
          <el-table-column label="messages" align="center" prop="messages" />
          <el-table-column
            label="durable"
            align="center"
            prop="durable"
            :formatter="stringFormat"
          />
          <el-table-column
            label="state"
            align="center"
            prop="state"
            :formatter="stringFormat"
          />
          <el-table-column
            label="auto_delete"
            align="center"
            prop="auto_delete"
            :formatter="stringFormat"
          />
          <el-table-column
            label="操作"
            align="center"
            width="200"
            class-name="small-padding fixed-width"
          >
            <template v-slot="scope">
              <el-button
                size="mini"
                type="text"
                :icon="ElIconView"
                @click="handleDetail(scope.row)"
                >详情</el-button
              >
              <el-button
                size="mini"
                type="text"
                :icon="ElIconDelete"
                @click="handleQueueDelete(scope.row)"
                >删除</el-button
              >
              <el-button
                size="mini"
                type="text"
                :icon="ElIconKey"
                @click="purgeQueue(scope.row)"
                >清空队列</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog :title="title" v-model:value="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px">
        <el-row>
          <el-col :span="12" v-if="showExchangeType">
            <el-form-item label="交换器类别" prop="exchangeType">
              <el-select
                v-model:value="form.exchangeType"
                clearable
                size="default"
                style="width: 250px"
              >
                <el-option key="DIRECT" label="DIRECT" value="DIRECT" />
                <el-option key="TOPIC" label="TOPIC" value="TOPIC" />
                <el-option key="HEADERS" label="HEADERS" value="HEADERS" />
                <el-option key="FANOUT" label="FANOUT" value="FANOUT" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="showExchangeName">
            <el-form-item label="交换器名称" prop="exchangeName">
              <el-input v-model:value="form.exchangeName" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="showQueueName">
            <el-form-item label="队列名称" prop="queueName">
              <el-input v-model:value="form.queueName" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="showRoutingKey">
            <el-form-item label="路由KEY" prop="routingKey">
              <el-input v-model:value="form.routingKey" />
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

<script>
import {
  Plus as ElIconPlus,
  Delete as ElIconDelete,
  View as ElIconView,
  Key as ElIconKey,
} from '@element-plus/icons'
import {
  getExchangeList,
  getQueueList,
  getQueueBindings,
  addExchange,
  deleteExchange,
  addQueue,
  deleteQueue,
  purgeQueue,
} from '@/api/tool/rabbitMq'
export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      exchangeList: [],
      queueList: [],
      form: {},
      title: undefined,
      open: false,
      showExchangeType: true,
      showExchangeName: true,
      showQueueName: true,
      showRoutingKey: true,
      operatorType: undefined,
      ElIconPlus,
      ElIconDelete,
      ElIconView,
      ElIconKey,
    }
  },
  name: 'RabbitMQ',
  created() {
    this.getExchanges()
    this.getQueues()
  },
  methods: {
    stringFormat(row, column) {
      let value = row[column.property]
      if (value === null) {
        return ''
      }
      if (value instanceof Object) {
        return JSON.stringify(value)
      }
      return String(value)
    },
    getExchanges() {
      this.loading = true
      getExchangeList().then((response) => {
        this.exchangeList = response.data
        this.loading = false
      })
    },
    getQueues() {
      this.loading = true
      getQueueList().then((response) => {
        this.queueList = response.data
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
        exchangeType: undefined,
        exchangeName: undefined,
        queueName: undefined,
        routingKey: undefined,
      }
      this.resetForm('form')
    },
    addExchange() {
      this.reset()
      this.open = true
      this.title = '添加交换器'
      this.operatorType = 1
      this.showExchangeType = true
      this.showExchangeName = true
      this.showQueueName = false
      this.showRoutingKey = false
    },
    addQueue() {
      this.reset()
      this.open = true
      this.title = '添加队列'
      this.operatorType = 2
      this.showExchangeType = false
      this.showExchangeName = false
      this.showQueueName = true
      this.showRoutingKey = false
    },
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.operatorType === 1) {
            addExchange(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess('操作成功')
                this.open = false
                this.getExchanges()
              } else {
                this.msgError(response.msg)
              }
            })
          } else if (this.operatorType === 2) {
            addQueue(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess('操作成功')
                this.open = false
                this.getQueues()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    handleExchangeDelete(row) {
      let params = {
        exchangeType: row.type,
        exchangeName: row.name,
        queueName: '',
        routingKey: '',
      }
      deleteExchange(params).then((response) => {
        if (response.code === 200) {
          this.msgSuccess('删除成功')
          this.getExchanges()
        } else {
          this.msgError(response.msg)
        }
      })
    },
    handleQueueDelete(row) {
      let params = {
        exchangeType: '',
        exchangeName: '',
        queueName: row.name,
        routingKey: '',
      }
      deleteQueue(params).then((response) => {
        if (response.code === 200) {
          this.msgSuccess('删除成功')
          this.getQueues()
        } else {
          this.msgError(response.msg)
        }
      })
    },
    purgeQueue(row) {
      let params = {
        exchangeType: '',
        exchangeName: '',
        queueName: row.name,
        routingKey: '',
      }
      purgeQueue(params).then((response) => {
        if (response.code === 200) {
          this.msgSuccess('操作成功')
          this.getQueues()
        } else {
          this.msgError(response.msg)
        }
      })
    },
    handleDetail(row) {
      let params = {
        vhost: row.vhost,
        queueName: row.name,
      }
      this.$router.push({
        name: 'Bindings',
        path: '/mq/bindings',
        params: params,
      })
    },
  },
}
</script>
