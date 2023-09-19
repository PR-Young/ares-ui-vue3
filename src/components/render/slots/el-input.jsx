export default {
  prepend(h, conf, key) {
    return <template v-slot="prepend">{conf.__slot__[key]}</template>
  },
  append(h, conf, key) {
    return <template v-slot="append">{conf.__slot__[key]}</template>
  }
}
