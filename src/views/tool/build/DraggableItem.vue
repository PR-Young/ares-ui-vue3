<script lang="jsx">
import * as Vue from 'vue'
import {VueDraggableNext as draggable} from 'vue-draggable-next'
import render from '@/components/render/render'

const components = {
  itemBtns(h, currentItem, index, list) {
    const copyItem = this.$attrs.onCopyItem
    const deleteItem = this.$attrs.onDeleteItem
    return [
      <span
        class="drawing-item-copy"
        title="复制"
        onClick={(event) => {
          copyItem(currentItem, list)
          event.stopPropagation()
        }}
      >
        <el-icon><CopyDocument /></el-icon>
      </span>,
      <span
        class="drawing-item-delete"
        title="删除"
        onClick={(event) => {
          deleteItem(index, list)
          event.stopPropagation()
        }}
      >
        <el-icon><Delete /></el-icon>
      </span>,
    ]
  },
}
const layouts = {
  colFormItem(h, currentItem, index, list) {debugger
    currentItem = Vue.toRaw(currentItem);
    list = Vue.toRaw(list);
    const activeItem = Vue.toRaw(this).$attrs.onActiveItem
    const config = currentItem.__config__
    const child = renderChildren.apply(Vue.toRaw(this), Vue.toRaw(arguments))
    let className =
    Vue.toRaw(this).activeId === config.formId
        ? 'drawing-item active-from-item'
        : 'drawing-item'
    if (Vue.toRaw(this).formConf.unFocusedComponentBorder) className += ' unfocus-bordered'
    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null
    if (config.showLabel === false) labelWidth = '0'
    return (
      <el-col
        span={config.span}
        class={className}
        nativeOnClick={(event) => {
          activeItem(currentItem)
          event.stopPropagation()
        }}
      >
        <el-form-item
          label-width={labelWidth}
          label={config.showLabel ? config.label : ''}
          required={config.required}
        >
          <render
            key={config.renderKey}
            conf={currentItem}
            onInput={(event) => {
              config['defaultValue'] = event
            }}
          >
            {child}
          </render>
        </el-form-item>
        {components.itemBtns.apply(Vue.toRaw(this), Vue.toRaw(arguments))}
      </el-col>
    )
  },
  rowFormItem(h, currentItem, index, list) {debugger
    const activeItem = this.$attrs.onActiveItem
    const config = currentItem.__config__
    const className =
      this.activeId === config.formId
        ? 'drawing-row-item active-from-item'
        : 'drawing-row-item'
    let child = renderChildren.apply(this, arguments)
    if (currentItem.type === 'flex') {
      child = (
        <el-row
          type={currentItem.type}
          justify={currentItem.justify}
          align={currentItem.align}
        >
          {child}
        </el-row>
      )
    }
    return (
      <el-col span={config.span}>
        <el-row
          gutter={config.gutter}
          class={className}
          nativeOnClick={(event) => {
            activeItem(currentItem)
            event.stopPropagation()
          }}
        >
          <span class="component-name">{config.componentName}</span>
          <draggable
            list={config.children || []}
            animation={340}
            group="componentsGroup"
            class="drag-wrapper"
          >
            {child}
          </draggable>
          {components.itemBtns.apply(this, arguments)}
        </el-row>
      </el-col>
    )
  },
  raw(h, currentItem, index, list) {
    const config = currentItem.__config__
    const child = renderChildren.apply(this, arguments)
    return (
      <render
        key={config.renderKey}
        conf={currentItem}
        onInput={(event) => {
          config['defaultValue'] = event
        }}
      >
        {child}
      </render>
    )
  },
}

function renderChildren(h, currentItem, index, list) {debugger
  currentItem = Vue.toRaw(currentItem)
  const config = currentItem.__config__
  if (!Array.isArray(config.children)) return null
  return config.children.map((el, i) => {
    const layout = layouts[el.__config__.layout]
    if (layout) {
      return layout.call(this, Vue.h, el, i, config.children)
    }
    return layoutIsNotFound.call(this)
  })
}

function layoutIsNotFound() {
  throw new Error(`没有与${this.currentItem.__config__.layout}匹配的layout`)
}

export default {
  components: {
    render,
    draggable,
  },
  props: ['currentItem', 'index', 'drawingList', 'activeId', 'formConf'],
  render() {
    const layout = layouts[this.currentItem.__config__.layout]

    if (layout) {
      return layout.call(
        this,
        Vue.h,
        this.currentItem,
        this.index,
        this.drawingList
      )
    }
    return layoutIsNotFound.call(this)
  },
}
</script>
