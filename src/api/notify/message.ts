import request from "@/utils/request";

export function getNoticeNum() {
  return request({
    url: "/ares/system/notice/noticeNum",
    method: "get",
  });
}

export function getNotices() {
  return request({
    url: "/ares/system/notice/getNotices",
    method: "get",
  });
}
