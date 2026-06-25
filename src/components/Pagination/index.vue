<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      v-bind="$attrs"
      :background="background"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup name="Pagination">
import { computed } from "vue";
import { scrollTo } from "@/utils/scroll-to";

const emit = defineEmits(["update:page", "update:limit", "pagination"]);

const props = defineProps({
  total: {
    required: true,
    type: Number,
  },
  page: {
    type: Number,
    default: 1,
  },
  limit: {
    type: Number,
    default: 20,
  },
  pageSizes: {
    type: Array,
    default() {
      return [10, 20, 30, 50];
    },
  },
  layout: {
    type: String,
    default: "total, sizes, prev, pager, next, jumper",
  },
  background: {
    type: Boolean,
    default: true,
  },
  autoScroll: {
    type: Boolean,
    default: true,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
});
const currentPage = computed({
  get() {
    return props.page;
  },
  set(val) {
    emit("update:page", val);
  },
});
const pageSize = computed({
  get() {
    return props.limit;
  },
  set(val) {
    emit("update:limit", val);
  },
});

const handleSizeChange = (val) => {
  emit("pagination", { page: props.currentPage, limit: val });
  if (props.autoScroll) {
    scrollTo(0, 800);
  }
};
const handleCurrentChange = (val) => {
  emit("pagination", { page: val, limit: props.pageSizes });
  if (props.autoScroll) {
    scrollTo(0, 800);
  }
};
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
}
.pagination-container.hidden {
  display: none;
}
</style>
