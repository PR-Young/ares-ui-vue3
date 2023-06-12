<template>
  <el-row :gutter="40" class="panel-group">
    <el-col
      v-for="panelGroup in panelGroups"
      :key="panelGroup.type"
      :xs="12"
      :sm="12"
      :lg="6"
      class="card-panel-col"
    >
      <div class="card-panel" @click="handleSetLineChartData(panelGroup.type)">
        <div :class="'card-panel-icon-wrapper icon-' + panelGroup.icon">
          <svg-icon
            :icon-class="panelGroup.icon"
            class-name="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ panelGroup.name }}</div>
          <count-to
            :start-val="panelGroup.startVal"
            :end-val="panelGroup.endVal"
            :duration="panelGroup.duration"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { $on, $off, $once, $emit } from '../../utils/gogocodeTransfer'
import CountTo from 'vue-count-to'
import { getPanelGroups } from '@/api/home'

export default {
  components: {
    CountTo,
  },
  data() {
    return {
      panelGroups: [],
    }
  },
  created() {
    getPanelGroups().then((res) => {
      this.panelGroups = res.data
    })
  },
  methods: {
    handleSetLineChartData(type) {
      $emit(this, 'handleSetLineChartData', type)
    },
  },
  emits: ['handleSetLineChartData'],
}
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
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
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
