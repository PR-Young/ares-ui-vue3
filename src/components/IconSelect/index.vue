<template>
  <div class="icon-body">
    <el-input
      v-model:value="name"
      style="position: relative"
      clearable
      placeholder="请输入图标名称"
      @clear="filterIcons"
      @input="filterIcons"
    >
      <template v-slot:suffix>
        <el-icon class="el-input__icon"><el-icon-search /></el-icon>
      </template>
    </el-input>
    <div class="icon-list">
      <div
        v-for="(item, index) in iconList"
        :key="index"
        @click="selectedIcon(item)"
      >
        <svg-icon :icon-class="item" style="height: 30px; width: 16px" />
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Search as ElIconSearch } from '@element-plus/icons'
import { $on, $off, $once, $emit } from '../../utils/gogocodeTransfer'
import icons from './requireIcons'
export default {
  components: {
    ElIconSearch,
  },
  name: 'IconSelect',
  data() {
    return {
      name: '',
      iconList: icons,
    }
  },
  methods: {
    filterIcons() {
      if (this.name) {
        this.iconList = this.iconList.filter((item) => item.includes(this.name))
      } else {
        this.iconList = icons
      }
    },
    selectedIcon(name) {
      $emit(this, 'selected', name)
      document.body.click()
    },
    reset() {
      this.name = ''
      this.iconList = icons
    },
  },
  emits: ['selected'],
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.icon-body {
  width: 100%;
  padding: 10px;
  .icon-list {
    height: 200px;
    overflow-y: scroll;
    div {
      height: 30px;
      line-height: 30px;
      margin-bottom: -5px;
      cursor: pointer;
      width: 33%;
      float: left;
    }
    span {
      display: inline-block;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
  }
}
</style>
