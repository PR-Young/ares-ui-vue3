<template>
  <div class="app-container">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item
        v-for="item in categorys"
        :title="item.dictLabel"
        :name="item.dictValue"
        :key="item.id"
      >
        <el-row :gutter="40" class="panel-group">
          <el-col
            v-for="flow in flowList"
            :key="flow.id"
            :xs="12"
            :sm="12"
            :lg="6"
            class="card-panel-col"
          >
            <div class="card-panel" @click="handleStartProcess(flow)">
              <div :class="'card-panel-icon-wrapper icon-log'">
                <svg-icon icon-class="link" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  {{ flow.flowName }}
                  <el-tag size="default">v{{ flow.version }}</el-tag>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup name="Workbench">
import { activeFlowList } from "@/api/aresflow/process";
import { onMounted, ref, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
// 遮罩层
const loading = ref(true);
const flowList = ref([]);
const flowData = ref([]);
const categorys = ref([]);
const activeNames = ref(["1"]);

onMounted(() => {
  proxy.getDicts("sys_process_category").then((res) => {
    categorys.value = res.data;
  });
  getList();
});

const categoryFormat = (row, column) => {
  return proxy.selectDictLabel(categorys.value, row.category);
};
/** 查询流程定义列表 */
const getList = () => {
  loading.value = true;
  flowList.value = [];
  activeFlowList().then((response) => {
    flowData.value = response.data;
    flowData.value.forEach((data) => {
      if (activeNames.value.includes(data.category)) {
        flowList.value.push(data);
      }
    });
    console.log(flowList);
    loading.value = false;
  });
};
/**  发起流程申请 */
const handleStartProcess = (row) => {
  router.push({
    path: "/aresflow/task/record/index",
    query: {
      flowCode: row.flowCode,
      defId: row.id,
      handleType: "start",
    },
  });
};
const handleChange = (val) => {
  console.log(val);
  flowList.value = [];
  flowData.value.forEach((data) => {
    if (val.includes(data.category)) {
      flowList.value.push(data);
    }
  });
};
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-peoples {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-job {
        background: #f4516c;
      }

      .icon-log {
        background: #34bfa3;
      }
    }

    .icon-peoples {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-job {
      color: #f4516c;
    }

    .icon-log {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 40px 40px 10px 10px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 20px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }
  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;
    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
