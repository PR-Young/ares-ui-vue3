<template>
  <div class="dashboard-editor-container">
    <el-row>
      <el-form :inline="true" style="text-align: center">
        <el-form-item>
          <el-input
            style="width: 500px"
            v-model:value="queryParams.searchValue"
            placeholder="请输入"
            clearable
            size="small"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="ElIconSearch"
            size="mini"
            @click="handleQuery"
          ></el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px">
      <time-line-chart :chart-data="lineData" />
    </el-row>

    <!-- <el-row style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px">
            <line-chart :chart-data="lineChartData" />
          </el-row> -->

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
      <el-calendar v-model:value="today"> </el-calendar>
    </el-row>
  </div>
</template>

<script>
import { Search as ElIconSearch } from '@element-plus/icons'
import PanelGroup from './dashboard/PanelGroup.vue'
import LineChart from './dashboard/LineChart.vue'
import RaddarChart from './dashboard/RaddarChart.vue'
import PieChart from './dashboard/PieChart.vue'
import BarChart from './dashboard/BarChart.vue'
import TimeLineChart from './dashboard/TimeLineChart.vue'
import { getLineChartData, getLineChart, queryByKey } from '@/api/home'

export default {
  data() {
    return {
      today: new Date(),
      lineChartData: {
        expected: [],
        actual: [],
      },
      lineData: {},
      queryParams: {
        searchValue: undefined,
      },
      ElIconSearch,
    }
  },
  name: 'Index',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TimeLineChart,
  },
  created() {
    getLineChartData().then((res) => {
      this.lineChartData = res.data.newVisitis
    })
    getLineChart().then((res) => {
      this.lineData = res.data
    })
  },
  methods: {
    handleSetLineChartData(type) {
      getLineChartData().then((res) => {
        this.lineChartData = res.data[type]
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      queryByKey(this.queryParams).then((res) => {
        const data = {
          searchValue: this.queryParams.searchValue,
          data: res.data,
        }
        this.$router.push({ path: '/query/result', query: data })
      })
    },
  },
}
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
