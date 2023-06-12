<template>
  <div id="archives">
    <header style="80px 15px 48px 50px;height:200px">
      <div class="explain">
        <h1>Archives</h1>
        <h5></h5>
      </div>
    </header>
    <div class="archives-wrapper">
      <div v-for="archive of archiveDatas" :key="archive.id">
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
    </div>
  </div>
</template>

<script>
import { getArchives } from '@/api/blog'
export default {
  name: 'Archives',
  data() {
    return { archiveDatas: [] }
  },
  created() {
    this.getArchives()
  },
  methods: {
    getArchives() {
      this.archiveDatas = getArchives()
    },
  },
}
</script>

<style scoped>
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
</style>
