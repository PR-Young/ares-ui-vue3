<template>
  <div class="dashboard-editor-container">
    <el-row>
      <el-col>
        <el-form :inline="true" style="text-align: center">
          <el-form-item>
            <el-input
              style="width: 500px"
              v-model="queryParams.searchValue"
              placeholder="请输入"
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
            ></el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <!-- <el-row style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px">
      <time-line-chart :chart-data="lineData" />
    </el-row> -->

    <el-row style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-calendar v-model="today"> </el-calendar>
    </el-row>
  </div>
</template>

<script setup name="Index">
import { Search } from "@element-plus/icons-vue";
import PanelGroup from "./dashboard/PanelGroup.vue";
import LineChart from "./dashboard/LineChart.vue";
import RaddarChart from "./dashboard/RaddarChart.vue";
import PieChart from "./dashboard/PieChart.vue";
import BarChart from "./dashboard/BarChart.vue";
import TimeLineChart from "./dashboard/TimeLineChart.vue";
import { getLineChartData, getLineChart, queryByKey } from "@/api/home";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const today = new Date();
const lineChartData = ref({
  expected: [],
  actual: [],
});
const lineData = ref({});
const queryParams = reactive({
  searchValue: undefined,
});

onMounted(() => {
  getLineChartData().then((res) => {
    lineChartData.value = res.data.newVisitis;
  });
  getLineChart().then((res) => {
    lineData.value = res.data;
  });
});

const handleSetLineChartData = (type) => {
  getLineChartData().then((res) => {
    lineChartData.value = res.data[type];
  });
};
/** 搜索按钮操作 */
const handleQuery = () => {
  queryByKey(queryParams).then((res) => {
    const data = {
      searchValue: queryParams.searchValue,
      data: res.data,
    };
    router.push({ path: "/query/result", query: data });
  });
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
