import axios, { AxiosResponse } from "axios";
import { getToken } from "@/utils/auth";

const mimeMap = {
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  zip: "application/zip",
};

const baseUrl = import.meta.env.VITE_APP_BASE_API;

export function downLoadZip(str: any, filename: any) {
  const url = baseUrl + str;
  axios({
    method: "get",
    url: url,
    responseType: "blob",
    headers: { Authorization: "Bearer " + getToken() },
  }).then((res) => {
    resolveBlob(res, mimeMap.zip);
  });
}

/**
 * 解析blob响应内容并下载
 * @param {*} res blob响应内容
 * @param {String} mimeType MIME类型
 */
export function resolveBlob(res: AxiosResponse<any, any>, mimeType: string) {
  const aLink = document.createElement("a");
  const blob = new Blob([res.data], { type: mimeType });
  // //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
  const patt = new RegExp("filename=([^;]+\\.[^\\.;]+);*");
  const contentDisposition = decodeURI(res.headers["content-disposition"]);
  const result = patt.exec(contentDisposition) as any;
  let fileName = result[1];
  fileName = fileName.replace(/\"/g, "");
  aLink.href = URL.createObjectURL(blob);
  aLink.setAttribute("download", fileName); // 设置下载文件名称
  document.body.appendChild(aLink);
  aLink.click();
  document.body.appendChild(aLink);
}
