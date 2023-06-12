<template>
  <div id="tag">
    <header>
      <div class="explain">
        <h1>Tag</h1>
      </div>
      <div></div>
    </header>
    <el-tabs stretch @tab-click="handleClick">
      <el-tab-pane v-for="tag of tagList" :key="tag.id" :label="tag.name">
        <div
          v-for="archive of archivesList"
          :key="archive.id"
          style="color: black"
        >
          <h3 class="archive-separator">{{ archive.time }}</h3>
          <div class="archives-list">
            <div
              class="archives-item"
              v-for="item of archive.archives"
              :key="item.id"
            >
              <p class="archives-time">{{ item.time }}</p>
              <h3 class="archives-title">{{ item.title }}</h3>
              <div class="archives-operation">
                <p class="archives-tag">{{ item.tag }}</p>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <div class="archives-wrapper">
      <!-- <div v-for="archive of archivesList" :key="archive.id">
              <h3 class="archive-separator">{{ archive.time }}</h3>
              <div class="archives-list">
                <div
                  class="archives-item"
                  v-for="item of archive.archives"
                  :key="item.id"
                >
                  <p class="archives-time">{{ item.time }}</p>
                  <h3 class="archives-title">{{ item.title }}</h3>
                  <div class="archives-operation">
                    <p class="archives-tag">{{ item.tag }}</p>
                  </div>
                </div>
              </div>
            </div> -->
    </div>
  </div>
</template>

<script>
import { getArchives, getTagList } from '@/api/blog'
export default {
  name: 'Tag',
  data() {
    return {
      isshowTagModel: false,
      archivesList: [],
      tagList: [],
    }
  },
  created() {
    this.getTags()
    this.getArchives('0')
  },
  methods: {
    getArchives() {
      this.archivesList = getArchives('0')
    },
    getTags() {
      this.tagList = getTagList()
    },
    showTagModel() {
      this.isshowTagModel = !this.isshowTagModel
    },
    selectTag(event) {},
    handleClick(tab, event) {
      console.log(tab, event)
      this.archivesList = getArchives(tab.index)
    },
  },
}
</script>

<style scope>
.el-tabs__header {
  padding: 0;
  position: relative;
  margin: 0 -15px;
  background: #3f51b5;
  color: white;
}
.el-tabs__item {
  padding: 0 20px;
  height: 40px;
  box-sizing: border-box;
  line-height: 40px;
  display: inline-block;
  list-style: none;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  position: relative;
}
.tag-model {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}
.tag-wrapper {
  width: 70%;
  display: flex;
  flex-wrap: wrap;
  background: #fff;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
}
.tag-wrapper p {
  padding: 0 15px;
  margin: 5px;
  line-height: 32px;
  cursor: pointer;
}
.tag-active {
  color: #fff;
  background: #ff4081;
  border-radius: 0.2em;
}
.explain {
  position: relative;
}
.tag-more {
  position: absolute;
  bottom: 0px;
  right: 0px;
  background: #3f51b5;
  width: 60px;
  text-align: center;
  line-height: 40px;
  height: 44px;
  cursor: pointer;
}
header {
  padding: 60px 10px 0px 40px;
  height: 160px;
}
.archives-wrapper {
  margin: 0px auto 40px;
  min-height: calc(100vh - 270px);
}
.archive-separator {
  margin: 10px 0;
  color: #3f51b5;
  font-size: 16px;
  font-weight: bold;
  margin-top: 30px;
}
.main-wrapper {
  flex: 1;
  background: #f6f6f6;
  padding: 0 15px;
}
.archives-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}
.archives-item {
  width: calc(50% - 10px);
  box-sizing: border-box;
  padding: 16px 20px 0;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 1px 2px rgba(151, 151, 151, 0.58);
  margin-bottom: 20px;
}
.archives-time {
  margin: 0 0 10px;
  line-height: 14px;
  font-size: 13px;
  font-weight: bold;
  color: #727272;
  overflow: hidden;
}
.archives-title {
  font-size: 18px;
  margin-bottom: 0;
  padding-bottom: 16px;
}
.archives-operation {
  border-top: 1px solid #ddd;
  display: flex;
  padding: 12px 20px 8px;
  margin: 0 -20px;
}
.archives-tag {
  border-radius: 2px;
  background: #8bc34a;
  padding: 0 16px;
  line-height: 28px;
  color: rgba(255, 255, 255, 0.8);
}
.tag-list {
  display: flex;
  height: 44px;
  margin-top: 8px;
  line-height: 44px;
  overflow: hidden;
  flex-wrap: wrap;
}
.tag-list p {
  padding: 0 12px;
  color: rgba(255, 255, 255, 0.8);
}
.tag-list p:hover {
  cursor: pointer;
}
.tag-active {
  border-bottom: 2px solid #ff4081;
}
</style>
