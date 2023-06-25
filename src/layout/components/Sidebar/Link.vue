<template>
  <component :is="type" v-bind="linkProps()">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  props: {
    to: {
      type: String,
      required: true,
    },
  },
  computed:{
    type(){
      if (isExternal(this.to)) {
        return 'a'
      }
      return 'router-link'
    }
  },
  methods: {
    linkProps() {
      if (isExternal(this.to)) {
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
