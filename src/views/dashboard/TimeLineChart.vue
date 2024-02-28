<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from "echarts";
import "echarts/theme/macarons";
// require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";
import { getLineChart } from "@/api/home";
import { nextTick } from "vue";

export default {
  name: "timeLineChart",
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "350px",
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
    chartData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      },
    },
  },
  mounted() {
    nextTick(() => {
      this.initChart();
    });
  },
  beforeUnmount() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      if (this.chartData.length > 0) {
        this.setOptions(this.chartData);
      } else {
        getLineChart().then((res) => {
          this.setOptions(res.data);
        });
      }
    },
    setOptions({ legend, series, xaxis } = {}) {
      this.chart.setOption({
        xAxis: xaxis,
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          padding: [5, 10],
        },
        yAxis: {
          axisTick: {
            show: false,
          },
        },
        legend: legend,
        series: series,
      });
    },
  },
};
</script>
