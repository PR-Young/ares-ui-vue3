<template>
  <!-- eslint-disable vue/require-component-is -->
  <component :is="type" v-bind="linkProps()">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  props: {
    to: {
      type: [String,Object],
      required: true,
    },
  },
  computed:{
    isExt(){
      return isExternal(this.to)
    },
    type(){
      if (this.isExt.value) {
        return 'a'
      }
      return 'router-link'
    }
  },
  methods: {
    linkProps() {
      if (this.isExt.value) {
        return {
          href: this.to,
          target: '_blank',
          rel: 'noopener',
        }
      }
      return {
        to: this.to,
      }
    },
  },
}
</script>
