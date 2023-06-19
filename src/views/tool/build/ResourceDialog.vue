<template>
  <div>
    <el-dialog
      v-bind="$attrs"
      title="外部资源引用"
      width="600px"
      :close-on-click-modal="false"
      @open="onOpen"
      @close="onClose"
    >
      <el-input
        v-for="(item, index) in resources"
        :key="index"
        v-model="resources[index]"
        class="url-item"
        placeholder="请输入 css 或 js 资源路径"
        :prefix-icon="ElIconLink"
        clearable
      >
        <template v-slot:append>
          <el-button :icon="ElIconDelete" @click="deleteOne(index)" />
        </template>
      </el-input>
      <el-button-group class="add-item">
        <el-button
          plain
          @click="addOne('https://lib.baomitu.com/jquery/1.8.3/jquery.min.js')"
        >
          jQuery1.8.3
        </el-button>
        <el-button plain @click="addOne('https://unpkg.com/http-vue-loader')">
          http-vue-loader
        </el-button>
        <el-button :icon="ElIconCirclePlusoutline" plain @click="addOne('')">
          添加其他
        </el-button>
      </el-button-group>
      <template v-slot:footer>
        <div>
          <el-button @click="close"> 取消 </el-button>
          <el-button type="primary" @click="handelConfirm"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  Link as ElIconLink,
  Delete as ElIconDelete,
  CirclePlus as ElIconCirclePlusoutline,
} from '@element-plus/icons'
import { deepClone } from '@/utils/index'

export default {
  data() {
    return {
      resources: null,
      ElIconLink,
      ElIconDelete,
      ElIconCirclePlusoutline,
    }
  },
  components: {},
  inheritAttrs: false,
  props: ['originResource'],
  computed: {},
  watch: {},
  created() {},
  methods: {
    onOpen() {
      this.resources = this.originResource.length
        ? deepClone(this.originResource)
        : ['']
    },
    onClose() {},
    close() {
      $emit(this, 'update:visible', false)
    },
    handelConfirm() {
      const results = this.resources.filter((item) => !!item) || []
      $emit(this, 'save', results)
      this.close()
      if (results.length) {
        this.resources = results
      }
    },
    deleteOne(index) {
      this.resources.splice(index, 1)
    },
    addOne(url) {
      if (this.resources.indexOf(url) > -1) {
        this.$message('资源已存在')
      } else {
        this.resources.push(url)
      }
    },
  },
  emits: ['update:visible', 'save'],
  mounted() {
    inheriltClassAndStyle.call(this)
    inheriltClassAndStyle.call(this)
    inheriltClassAndStyle.call(this)
  },
}
</script>

<style lang="scss" scoped>
.add-item {
  margin-top: 8px;
}
.url-item {
  margin-bottom: 12px;
}
</style>
