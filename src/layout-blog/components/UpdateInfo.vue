<template>
  <div id="details">
    <header></header>
    <div class="details-wrapper">
      <el-row>
        <el-col :span="12">
          <div class="article-title">{{ detail.title }}</div>
        </el-col>
        <el-col :span="12">
          <div
            style="
              float: right;
              font-size: large;
              font-weight: bold;
              padding: 10px 1px 1px 1px;
              cursor: pointer;
            "
          ></div>
        </el-col>
      </el-row>
      <div class="article-time">{{ detail.time }}</div>
      <mavon-editor
        class="md"
        :value="detail.mdContent"
        :subfield="false"
        :defaultOpen="'preview'"
        :toolbarsFlag="false"
        :editable="false"
        :scrollStyle="true"
        :ishljs="true"
      ></mavon-editor>
    </div>
  </div>
</template>

<script>
import { getUpdateInfo } from '@/api/blog'
export default {
  name: 'UpdateInfo',
  data() {
    return {
      detail: {
        id: '1',
        title: '版本信息',
        time: '2020-07-31',
        mdContent: '',
      },
      codeStyle: 'monokai-sublime', //设置主题 ，
    }
  },
  created() {
    this.getUpdateInfo()
  },
  methods: {
    getUpdateInfo() {
      getUpdateInfo().then((res) => {
        this.detail.mdContent = res.data
      })
    },
  },
}
</script>

<style scoped>
header {
  height: 200px;
}
.md {
  box-shadow: none;
}
.v-note-wrapper.shadow {
  box-shadow: none !important;
}
.v-note-wrapper .v-note-panel .v-note-show .v-show-content,
.v-note-wrapper .v-note-panel .v-note-show .v-show-content-html {
  background: #fff !important;
}
#editor {
  margin: auto;
  width: 100%;
  height: 580px;
  margin: 15px 0;
}
.details-wrapper {
  max-width: 960px;
  margin: -110px auto 50px;
  min-height: 100px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 10px 30px;
  padding: 35px;
  background: rgb(255, 255, 255);
  border-radius: 4px;
  box-sizing: border-box;
  min-height: calc(100vh - 120px);
}
.article-title {
  font-size: 36px;
  line-height: 48px;
  font-weight: 400;
  color: rgb(33, 33, 33);
}
.article-time {
  line-height: 14px;
  font-size: 13px;
  font-weight: bold;
  color: rgb(114, 114, 114);
  margin: 8px 0px 10px;
  overflow: hidden;
}
.v-note-wrapper {
  z-index: 0 !important;
}
</style>
