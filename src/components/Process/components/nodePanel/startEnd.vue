<template>
  <div>
    <x-form ref="xForm" v-model:propData="formData" :config="formConfig">
      <template #executionListener>
        <el-badge :model-value="executionListenerLength">
          <el-button
            size="default"
            @click="dialogName = 'executionListenerDialog'"
            >编辑</el-button
          >
        </el-badge>
      </template>
    </x-form>
    <executionListenerDialog
      v-if="dialogName === 'executionListenerDialog'"
      :element="element"
      :modeler="modeler"
      @close="finishExecutionListener"
    />
  </div>
</template>

<script>
import mixinPanel from '../../common/mixinPanel'
import mixinExecutionListener from '../../common/mixinExecutionListener'
import { commonParse } from '../../common/parseElement'
export default {
  mixins: [mixinPanel, mixinExecutionListener],
  data() {
    return {
      formData: {},
    }
  },
  computed: {
    formConfig() {
      const _this = this
      return {
        inline: false,
        item: [
          {
            xType: 'input',
            name: 'id',
            label: '节点 id',
            rules: [{ required: true, message: 'Id 不能为空' }],
          },
          {
            xType: 'input',
            name: 'name',
            label: '节点名称',
          },
          {
            xType: 'input',
            name: 'documentation',
            label: '节点描述',
          },
          {
            xType: 'slot',
            name: 'executionListener',
            label: '执行监听器',
          },
          {
            xType: 'input',
            name: 'initiator',
            label: '发起人',
            show: !!_this.showConfig.initiator,
          },
          {
            xType: 'input',
            name: 'formKey',
            label: '表单标识key',
            show: !!_this.showConfig.formKey,
          },
        ],
      }
    },
  },
  watch: {
    'formData.initiator': function (val) {
      //if (val === '') val = null
      // 默认设置流程发起人
      if (val === '') val = 'INITIATOR'
      this.updateProperties({ 'flowable:initiator': val })
    },
    'formData.formKey': function (val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:formKey': val })
    },
  },
  created() {
    // this.updateProperties({ 'flowable:initiator': 'INITIATOR' })
    this.formData = commonParse(this.element)
  },
}
</script>
