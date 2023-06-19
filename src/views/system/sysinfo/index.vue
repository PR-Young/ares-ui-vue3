<template>
  <mavon-editor
    class="md"
    v-model="detail.mdContent"
    :subfield="true"
    :defaultOpen="'preview'"
    :toolbarsFlag="true"
    :editable="true"
    :scrollStyle="true"
    :ishljs="true"
    @save="save"
  ></mavon-editor>
</template>

<script>
import { getUpdateInfo, save } from '@/api/blog'
export default {
  name: 'AresUpdateInfo',
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
    save() {
      const data = { content: this.detail.mdContent }
      save(data).then((res) => {
        console.log(res)
        if (res.data) {
          this.msgSuccess('保存成功')
        } else {
          this.msgError('保存失败')
        }
      })
      //console.log(this.detail.mdContent);
    },
  },
}
</script>

<style scoped>
.md {
  box-shadow: none;
  min-height: 600px;
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
</style>
