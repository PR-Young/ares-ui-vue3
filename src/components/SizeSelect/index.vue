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

<script>
import store from "@/store";
import useAppStore from "@/store/modules/app";
import useTagsViewStore from "@/store/modules/tagsView";
const app = useAppStore(store);
const tagsView = useTagsViewStore(store);
export default {
  data() {
    return {
      sizeOptions: [
        { label: "Default", value: "default" },
        { label: "Medium", value: "medium" },
        { label: "Small", value: "small" },
        { label: "Mini", value: "mini" },
      ],
    };
  },
  computed: {
    size() {
      return app.size;
    },
  },
  methods: {
    handleSetSize(size) {
      // this.$ELEMENT.size = size;
      app.setSize(size);
      this.refreshView();
      this.$message({
        message: "Switch Size Success",
        type: "success",
      });
    },
    refreshView() {
      // In order to make the cached page re-rendered
      tagsView.delAllCachedViews(this.$route);

      const { fullPath } = this.$route;

      this.$nextTick(() => {
        this.$router.replace({
          path: "/redirect" + fullPath,
        });
      });
    },
  },
};
</script>
