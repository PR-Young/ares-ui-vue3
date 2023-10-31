<template>
  <div class="app-container">
    <el-row class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          :icon="ElIconPlus"
          size="default"
          @click="addBinding"
          >新增</el-button
        >
      </el-col>
    </el-row>
    <el-table v-loading="loading" border :data="bindlingList">
      <el-table-column label="source" align="center" prop="source" />
      <el-table-column label="destination" align="center" prop="destination" />
      <el-table-column
        label="destination_type"
        align="center"
        prop="destination_type"
      />
      <el-table-column
        label="properties_key"
        align="center"
        prop="properties_key"
      />
      <el-table-column label="routing_key" align="center" prop="routing_key" />
      <el-table-column label="vhost" align="center" prop="vhost" />
      <el-table-column
        label="操作"
        align="center"
        width="180"
        class-name="small-padding fixed-width"
      >
        <template v-slot="scope">
          <el-button
            size="default"
            link
            :icon="ElIconDelete"
            @click="romoveBinding(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="交换器类别" prop="exchangeType">
              <el-select
                v-model="form.exchangeType"
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
          <el-col :span="12">
            <el-form-item label="交换器名称" prop="exchangeName">
              <el-select
                v-model="form.exchangeName"
                clearable
                size="default"
                style="width: 250px"
              >
                <el-option
                  v-for="exchange in exchangeData"
                  :key="exchange.name"
                  :label="exchange.name"
                  :value="exchange.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="队列名称" prop="queueName">
              <el-input
                v-model="form.queueName"
                readonly
                style="width: 250px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="路由KEY" prop="routingKey">
              <el-input v-model="form.routingKey" style="width: 250px" />
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
} from "@element-plus/icons";
import {
  getQueueBindings,
  getExchangeList,
  getQueueList,
  addBinding,
  removeBinding,
} from "@/api/tool/rabbitMq";
import path from "path";
import { forceLogout } from "@/api/monitor/online";
export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      form: {},
      title: undefined,
      open: false,
      bindlingList: [],
      exchangeData: [],
      queueData: [],
      data: {},
      ElIconPlus,
      ElIconDelete,
    };
  },
  name: "Bindings",
  created() {
    let params = this.$route.params;
    this.data = params;
    this.getBindings(params);
    this.form = {
      exchangeType: undefined,
      exchangeName: undefined,
      queueName: params.queueName,
      routingKey: undefined,
    };
  },
  methods: {
    getBindings(params) {
      getQueueBindings(params).then((response) => {
        if (response.code === 200) {
          this.bindlingList = response.data;
          this.loading = false;
        } else {
          this.msgError(response.msg);
        }
      });
    },
    getDatas() {
      getExchangeList().then((response) => {
        if (response.code === 200) {
          this.exchangeData = response.data;
        }
      });
    },
    addBinding() {
      this.open = true;
      this.title = "新增绑定关系";
      this.getDatas();
    },
    romoveBinding(row) {
      let params = {
        exchangeType: "",
        exchangeName: row.source,
        queueName: row.destination,
        routingKey: row.routing_key,
      };
      removeBinding(params).then((response) => {
        if (response.code === 200) {
          this.getBindings(this.data);
          this.loading = false;
        } else {
          this.msgError(response.msg);
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        exchangeType: undefined,
        exchangeName: undefined,
        queueName: this.data.queueName,
        routingKey: undefined,
      };
      this.resetForm("form");
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          addBinding(this.form).then((response) => {
            if (response.code === 200) {
              this.msgSuccess("操作成功");
              this.open = false;
            } else {
              this.msgError(response.msg);
            }
          });
        }
      });
    },
  },
};
</script>
