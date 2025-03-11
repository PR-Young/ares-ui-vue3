<template>
  <component
    v-if="!!components[item.tag] && !item.disTag"
    :is="components[item.tag]"
    :conf="conf"
    :item="item"
    v-bind="$attrs"
    :form-data="conf.model"
    v-model="conf.model[item.vModel]"
  >
    <template v-for="(val, name) in item.__slot__" v-slot:[name]>
      {{ val }}
    </template>
  </component>
  <component
    v-else
    :is="item.disTag ?? item.tag"
    v-bind="$attrs"
    :form-data="conf.model"
    v-model="conf.model[item.vModel]"
  >
    <template v-for="(val, name) in item.__slot__" v-slot:[name]>
      {{ val }}
    </template>
  </component>
</template>

<script setup>
import {
  defineAsyncComponent,
  computed,
  ref,
  watch,
  inject,
  reactive,
  h,
  toRefs,
} from "vue";

let components = {};

const elModules = import.meta.glob("./Elements/FormItems/My*/index.vue", {
  eager: true,
  import: "default",
});
const aiModules = import.meta.glob("@/views/aiform/Ai*/index.vue", {
  eager: true,
  import: "default",
});
for (const path in elModules) {
  let cname = elModules[path].name;
  components[cname] = elModules[path];
}
for (const path in aiModules) {
  let cname = aiModules[path].name;
  components[cname] = aiModules[path];
}

const props = defineProps({
  item: Object,
  attrs: Object,
  conf: Object,
});
let vm = ref(props.item.defaultValue);
if (props.conf !== undefined) {
  console.log(
    "props.item.defaultValue",
    props.item.defaultValue,
    props.item.tag
  );
  if (props.conf.model[props.item.vModel] === undefined)
    props.conf.model[props.item.vModel] = ref(props.item.defaultValue);
  vm.value = props.conf.model[props.item.vModel];
}
const editModelValue = function (e) {
  //  console.log(e);
  vm.value = e;
};
</script>