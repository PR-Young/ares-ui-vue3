<template>
  <div>
    <header style="padding: 60px 15px 48px 50px; height: 200px">
      <div class="explain">
        <h1>My Web</h1>
        <h4 style="padding-top: 20px">This is for learn</h4>
      </div>
    </header>
    <div class="index-wrapper">
      <el-row
        v-for="item of contents"
        :key="item.id"
        style="padding-bottom: 10px"
      >
        <el-col>
          <el-card class="box-card" shadow="hover">
            <template v-slot:header>
              <div class="clearfix">
                <el-row>
                  <el-col :span="12">
                    <h3>{{ item.title }}</h3>
                    <h5>{{ item.name }}</h5>
                    <h6 style="color: #727272">{{ item.createTime }}</h6>
                  </el-col>
                  <el-col :span="12">
                    <!-- <span>{{ item.title }} {{item.name}} {{ item.createTime }}</span> -->
                    <el-button
                      style="float: right; padding: 3px -1px"
                      link
                      @click="$parent.location('/details/' + item.id)"
                      >阅读原文</el-button
                    >
                  </el-col>
                </el-row>
              </div>
            </template>
            <div class="text item" style="height: 260px">
              <p class="blog-content-1" v-html="item.content"></p>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <!-- <ul>
              <li class="blog-wrapper" v-for="item of contents" :key="item.id" @click="$parent.location('/details/' + item.id)">
                <p class="blog-time">{{ item.createTime }}</p>
                <h3 class="blog-title">{{ item.title }}</h3>
                <h5 style="margin-bottom:10px">—{{item.name}}</h5>
                <div class="blog-content">
                  <p class="blog-content-1" v-html=item.content  ></p>
                   <span
                    class="blog-more"
                    @click="$parent.location('/details/' + item.id)"
                    >阅读原文</span
                  > 
                </div>
                <div class="blog-tag">
                  <ul>
                    <li v-text="typeFormat(item.type)" ></li>
                  </ul>
                </div> 
              </li>
            </ul> -->
    </div>
  </div>
</template>

<script>
import { getContents } from '@/api/blog'
export default {
  name: 'Index',
  data() {
    return {
      contents: [],
      typeOptions: [],
    }
  },
  created() {
    this.getContents()
    // this.getDicts("article_types").then((response) => {
    //   this.typeOptions = response.data;
    // });
  },
  methods: {
    getContents() {
      this.contents = getContents().then((res) => {
        this.contents = res.data
      })
    },
    typeFormat(type) {
      return this.selectDictLabel(this.typeOptions, type)
    },
  },
}
</script>

<style scoped>
.index-wrapper {
  max-width: 1200px;
  margin: 30px auto 40px;
}
.blog-wrapper {
  margin-bottom: 30px;
  padding: 12px 12px 0;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 1px 2px rgba(151, 151, 151, 0.58);
  height: 300px;
  cursor: pointer;
}
.blog-time {
  line-height: 24px;
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: bold;
  color: #727272;
  overflow: hidden;
}
.blog-title {
  margin-bottom: 5px;
  font-size: 24px;
  line-height: 32px;
  color: #3f51b5;
}
.blog-content {
  word-break: break-all;
  padding-bottom: 20px;
  line-height: 1.5;
}
.blog-content-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 12;
  -webkit-box-orient: vertical;
}
.blog-more {
  display: inline-block;
  padding: 0 6px;
  font-weight: 500;
  color: #3f51b5 !important;
  border: none !important;
  border-radius: 3px;
  cursor: pointer;
}
.blog-tag {
  position: relative;
  margin: 0 -12px;
  padding: 12px 20px 8px;
  border-top: 1px solid #ddd;
}
.blog-tag li {
  display: inline-block;
  margin: 0 8px 8px 0;
  border-radius: 2px;
  background: #8bc34a;
  padding: 0 16px;
  line-height: 28px;
  color: rgba(255, 255, 255, 0.8);
}
</style>
