import xcrud from 'xcrud-vue3'
import golbalConfig from 'xcrud-vue3/package/common/config'
golbalConfig.set({
  input: {
    // size: 'mini'
  },
  select: {
    // size: 'mini'
  },
  colorPicker: {
    showAlpha: true,
  },
  xform: {
    form: {
      labelWidth: 'auto',
      // size: 'mini'
    },
  },
})
export default {
  components: { xForm: xcrud.xForm },
}
