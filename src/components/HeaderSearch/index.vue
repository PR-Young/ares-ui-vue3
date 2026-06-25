<template>
  <div :class="{ show: show }" class="header-search">
    <svg-icon
      class-name="search-icon"
      icon-class="search"
      @click.stop="click"
    />
    <el-select
      ref="headerSearchSelectRef"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="Search"
      class="header-search-select"
      @change="change"
    >
      <el-option
        v-for="option in options"
        :key="option.item.path"
        :value="option.item"
        :label="option.item.title.join(' > ')"
      />
    </el-select>
  </div>
</template>

<script setup name="HeaderSearch">
// fuse is a lightweight fuzzy-search module
// make search results more in line with expectations
import Fuse from "fuse.js";
import path from "path-browserify";
import store from "@/store";
import usePermissionStore from "@/store/modules/permission";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
const permission = usePermissionStore(store);

const router = useRouter();
const headerSearchSelectRef = ref();
const search = ref("");
const options = ref([]);
const searchPool = ref([]);
const show = ref(false);
const fuse = ref(undefined);
const routes = computed(() => {
  return permission.permissionRoutes;
});
watch(
  () => routes.value,
  () => {
    searchPool.value = generateRoutes(routes.value);
  },
);
watch(
  () => searchPool.value,
  (list) => {
    initFuse(list);
  },
);
watch(
  () => show.value,
  (value) => {
    if (value) {
      document.body.addEventListener("click", close);
    } else {
      document.body.removeEventListener("click", close);
    }
  },
);
onMounted(() => {
  searchPool.value = generateRoutes(routes.value);
});

const click = () => {
  show.value = !show.value;
  if (show.value) {
    headerSearchSelectRef.value && headerSearchSelectRef.value.focus();
  }
};
const close = () => {
  headerSearchSelectRef.value && headerSearchSelectRef.value.blur();
  options.value = [];
  show.value = false;
};
const change = async (val) => {
  router.push(val.path);
  search.value = "";
  options.value = [];
  await nextTick(() => {
    show.value = false;
  });
};
const initFuse = (list) => {
  fuse.value = new Fuse(list, {
    shouldSort: true,
    threshold: 0.4,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
      {
        name: "title",
        weight: 0.7,
      },
      {
        name: "path",
        weight: 0.3,
      },
    ],
  });
};
// Filter out the routes that can be displayed in the sidebar
// And generate the internationalized title
const generateRoutes = (routes, basePath = "/", prefixTitle = []) => {
  let res = [];

  for (const router of routes) {
    // skip hidden router
    if (router.hidden) {
      continue;
    }

    const data = {
      path: path.resolve(basePath, router.path),
      title: [...prefixTitle],
    };

    if (router.meta && router.meta.title) {
      data.title = [...data.title, router.meta.title];

      if (router.redirect !== "noRedirect") {
        // only push the routes with title
        // special case: need to exclude parent router without redirect
        res.push(data);
      }
    }

    // recursive child routes
    if (router.children) {
      const tempRoutes = generateRoutes(router.children, data.path, data.title);
      if (tempRoutes.length >= 1) {
        res = [...res, ...tempRoutes];
      }
    }
  }
  return res;
};
const querySearch = (query) => {
  if (query !== "") {
    options.value = fuse.value.search(query);
  } else {
    options.value = [];
  }
};
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;
  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    ::deep .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
