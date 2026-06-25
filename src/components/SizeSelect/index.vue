<template>
  <el-dropdown trigger="click" @command="handleSetSize">
    <div>
      <svg-icon class-name="size-icon" icon-class="size" />
    </div>
    <template v-slot:dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item of sizeOptions"
          :key="item.value"
          :disabled="size === item.value"
          :command="item.value"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import store from "@/store";
import useAppStore from "@/store/modules/app";
import useTagsViewStore from "@/store/modules/tagsView";
import { computed, getCurrentInstance, nextTick, ref } from "vue";
import { useRouter } from "vue-router";
const app = useAppStore(store);
const tagsView = useTagsViewStore(store);
const router = useRouter();
const { proxy } = getCurrentInstance();

const sizeOptions = ref([
  { label: "Default", value: "default" },
  { label: "Small", value: "small" },
  { label: "Large", value: "large" },
]);

const size = computed(() => {
  return app.size;
});

const handleSetSize = (size) => {
  // this.$ELEMENT.size = size;
  app.setSize(size);
  refreshView();
  proxy.$message({
    message: "Switch Size Success",
    type: "success",
  });
};
const refreshView = async () => {
  // In order to make the cached page re-rendered
  tagsView.delAllCachedViews(router.currentRoute.value);

  const { fullPath } = router.currentRoute.value;

  await nextTick(() => {
    router.replace({
      path: "/redirect" + fullPath,
    });
  });
};
</script>
