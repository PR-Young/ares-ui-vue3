<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPaneRef" class="tags-view-wrapper">
      <router-link
        v-for="tag in visitedViews"
        :ref="getRefSetter('tag')"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        class="tags-view-item"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        {{ tag.title }}

        <span v-if="!isAffix(tag)" @click.prevent.stop="closeSelectedTag(tag)">
          <el-icon
            class="el-icon-close"
            style="width: 1em; height: 1em; vertical-align: text-bottom"
          >
            <Close />
          </el-icon>
        </span>
      </router-link>
    </scroll-pane>
    <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
    >
      <li @click="refreshSelectedTag(selectedTag)">刷新页面</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        关闭当前
      </li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<script setup>
import ScrollPane from "./ScrollPane.vue";
import path from "path-browserify";
import { Close } from "@element-plus/icons";
import store from "@/store";
import useTagsViewStore from "@/store/modules/tagsView";
import usePermissionStore from "@/store/modules/permission";
import {
  computed,
  nextTick,
  onBeforeUpdate,
  onMounted,
  reactive,
  ref,
  unref,
  watch,
} from "vue";
import { useRouter } from "vue-router";

const tagsView = useTagsViewStore(store);
const permission = usePermissionStore(store);

const router = useRouter();
const { currentRoute, push } = useRouter();
const scrollPaneRef = ref();

const visible = ref(false);
const top = ref(0);
let left = ref(0);
const selectedTag = ref({});
const affixTags = ref([]);
const $arrRefs = ref();

const visitedViews = computed(() => {
  return tagsView.visitedViews;
});
const routes = computed(() => {
  return permission.routes;
});

onMounted(() => {
  initTags();
  addTags();
});

watch(
  () => currentRoute.value,
  () => {
    addTags();
    moveToCurrentTag();
  },
);
watch(
  () => visible.value,
  (value) => {
    if (value) {
      document.body.addEventListener("click", closeMenu);
    } else {
      document.body.removeEventListener("click", closeMenu);
    }
  },
);

const isActive = (route) => {
  return route.path === currentRoute.value.path;
};
const isAffix = (tag) => {
  return tag.meta && tag.meta.affix;
};
const filterAffixTags = (routes, basePath = "/") => {
  let tags = [];
  routes.forEach((route) => {
    if (route.meta && route.meta.affix) {
      const tagPath = path.resolve(basePath, route.path);
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta },
      });
    }
    if (route.children) {
      const tempTags = filterAffixTags(route.children, route.path);
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags];
      }
    }
  });
  return tags;
};
const initTags = () => {
  affixTags.value = filterAffixTags(routes.value);
  for (const tag of affixTags.value) {
    // Must have tag name
    if (tag.name) {
      tagsView.addVisitedView(tag);
    }
  }
};
const addTags = () => {
  const { name } = currentRoute.value;
  if (name) {
    tagsView.addView(currentRoute.value);
  }
  return false;
};
const moveToCurrentTag = async () => {
  const tags = $arrRefs.value.tag;
  await nextTick(() => {
    for (const tag of tags) {
      if (tag.to.path === currentRoute.value.path) {
        scrollPaneRef.value.moveToTarget(tag, $arrRefs);
        // when query is different then update
        if (tag.to.fullPath !== currentRoute.value.fullPath) {
          tagsView.updateVisitedView(currentRoute.value);
        }
        break;
      }
    }
  });
};
const refreshSelectedTag = async (view) => {
  tagsView.delCachedView(view).then(async () => {
    const { fullPath } = view;
    await nextTick(() => {
      router.replace({
        path: "/redirect" + fullPath,
      });
    });
  });
};
const closeSelectedTag = (view) => {
  tagsView.delView(view).then(({ visitedViews }) => {
    if (isActive(view)) {
      toLastView(visitedViews, view);
    }
  });
};
const closeOthersTags = () => {
  router.push(selectedTag.value);
  tagsView.delOthersViews(selectedTag.value).then(() => {
    moveToCurrentTag();
  });
};
const closeAllTags = (view) => {
  tagsView.delAllViews().then(({ visitedViews }) => {
    if (affixTags.value.some((tag) => tag.path === view.path)) {
      return;
    }
    toLastView(visitedViews, view);
  });
};
const toLastView = (visitedViews, view) => {
  const latestView = visitedViews.slice(-1)[0];
  if (latestView) {
    router.push(latestView.fullPath);
  } else {
    // now the default is to redirect to the home page if there is no tags-view,
    // you can adjust it according to your needs.
    if (view.name === "Dashboard") {
      // to reload home page
      router.replace({ path: "/redirect" + view.fullPath });
    } else {
      router.push("/");
    }
  }
};
const openMenu = (tag, e) => {
  const menuMinWidth = 105;
  const offsetLeft = scrollPaneRef.value.$el.getBoundingClientRect().left; // container margin left
  const offsetWidth = scrollPaneRef.value.$el.offsetWidth; // container width
  const maxLeft = offsetWidth - menuMinWidth; // left boundary
  const cleft = e.clientX - offsetLeft + 15; // 15: margin right

  if (cleft > maxLeft) {
    left.value = maxLeft;
  } else {
    left.value = cleft;
  }

  top.value = e.clientY;
  visible.value = true;
  selectedTag.value = tag;
};
const closeMenu = () => {
  visible.value = false;
};
const getRefSetter = (refKey) => {
  return (ref) => {
    !$arrRefs.value && ($arrRefs.value = {});
    !$arrRefs[refKey] && ($arrRefs[refKey] = []);
    ref && $arrRefs[refKey].push(ref);
  };
};

onBeforeUpdate(() => {
  $arrRefs.value && ($arrRefs.value = {});
});
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.12),
    0 0 3px 0 rgba(0, 0, 0, 0.04);

  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;

      &:first-of-type {
        margin-left: 15px;
      }

      &:last-of-type {
        margin-right: 15px;
      }

      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;

        &::before {
          content: "";
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;

      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }

      &:hover {
        background-color: #b4bccc;
        color: #fff;
        width: 12px !important;
        height: 12px !important;
      }
    }
  }
}
</style>
