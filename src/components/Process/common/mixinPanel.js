import xcrud from "xcrud-vue3";
import golbalConfig from "xcrud-vue3/package/common/config";
import showConfig from "../flowable/showConfig";
import * as Vue from "vue";

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
      labelWidth: "auto",
      // size: 'mini'
    },
  },
});
export default {
  components: { xForm: xcrud.xForm },
  props: {
    modeler: {
      type: Object,
      required: true,
    },
    element: {
      type: Object,
      required: true,
    },
    categorys: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    "formData.id": function (val) {
      this.updateProperties({ id: val });
    },
    "formData.name": function (val) {
      this.updateProperties({ name: val });
    },
    "formData.documentation": function (val) {
      if (!val) {
        this.updateProperties({ documentation: [] });
        return;
      }
      const documentationElement = this.modeler
        .get("moddle")
        .create("bpmn:Documentation", { text: val });
      this.updateProperties({ documentation: [documentationElement] });
    },
  },
  methods: {
    updateProperties(properties) {
      const modeling = this.modeler.get("modeling");
      modeling.updateProperties(Vue.toRaw(this.element), Vue.toRaw(properties));
    },
  },
  computed: {
    elementType() {
      const bizObj = this.element.businessObject;
      return bizObj.eventDefinitions && bizObj.eventDefinitions.length > 0
        ? bizObj.eventDefinitions[0].$type
        : bizObj.$type;
    },
    showConfig() {
      return showConfig[this.elementType] || {};
    },
  },
};
