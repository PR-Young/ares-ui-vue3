<template>
  <div class="app-container">
    <el-card v-show="msgList.length == 0" shadow="always">
      <el-alert title="没有新的公告信息" type="info" center show-icon>
      </el-alert>
    </el-card>

    <el-timeline>
      <el-timeline-item
        v-for="msg in msgList"
        :timestamp="parseTime(msg.createTime, '{y}-{m}-{d}')"
        :key="msg.id"
        :icon="msg.noticeType == 1 ? 'el-icon-position' : 'el-icon-message'"
        size="large"
        :type="msg.noticeType == 1 ? 'primary' : 'warning'"
        placement="top"
      >
        <el-card shadow="always">
          <template v-slot:header>
            <div class="clearfix">
              <span>{{ msg.noticeTitle }}</span>
              <span style="float: right; padding: 3px 0"
                >{{ msg.creator }} - {{ msg.createTime }}</span
              >
            </div>
          </template>
          <p style="padding-left: 20px" v-html="msg.noticeContent" />
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script setup name="Message">
import { getNotices } from "@/api/notify/message";
import store from "@/store";
import useUserStore from "@/store/modules/user";
import { ref, onMounted } from "vue";
const user = useUserStore(store);

const msgList = ref([]);

onMounted(() => {
  getList();
  user.GetNoticeNumber();
});

const getList = () => {
  getNotices().then((response) => {
    msgList.value = response.data;
  });
};
</script>
