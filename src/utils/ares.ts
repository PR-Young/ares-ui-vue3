/**
 * 通用js方法封装处理
 */

const baseURL = import.meta.env.VITE_APP_BASE_API;

// 日期格式化
export function parseTime(time: string | number | Date, pattern: string) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = pattern || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    } else if (typeof time === "string") {
      time = time.replace(new RegExp(/-/gm), "/");
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(
    /{(y|m|d|h|i|s|a)+}/g,
    (result: string | any[], key: string) => {
      let value = formatObj[key];
      // Note: getDay() returns 0 on Sunday
      if (key === "a") {
        return ["日", "一", "二", "三", "四", "五", "六"][value];
      }
      if (result.length > 0 && value < 10) {
        value = "0" + value;
      }
      return value || 0;
    },
  );
  return time_str;
}

// 表单重置
export function resetForm(formRef: any) {
  formRef.value?.resetFields();
}

// 添加日期范围
export function addDateRange(params: any, dateRange: any) {
  const search = params;
  search.beginTime = "";
  search.endTime = "";
  if (null != dateRange && "" != dateRange) {
    search.beginTime = dateRange[0];
    search.endTime = dateRange[1];
  }
  return search;
}

// 回显数据字典
export function selectDictLabel(datas: any, value: string) {
  const actions: any[] = [];
  Object.keys(datas).map((key) => {
    if (datas[key].dictValue == "" + value) {
      actions.push(datas[key].dictLabel);
      return false;
    }
  });
  return actions.join("");
}

// 通用下载方法
export function download(response: BlobPart, fileName: string) {
  //window.location.href = baseURL + "/common/download?fileName=" + encodeURI(fileName) + "&delete=" + true;
  const blob = new Blob([response]);
  if ("download" in document.createElement("a")) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName + ".xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }
}

// 字符串格式化(%s )
export function sprintf(str: string) {
  let args = arguments,
    flag = true,
    i = 1;
  str = str.replace(/%s/g, function () {
    const arg = args[i++];
    if (typeof arg === "undefined") {
      flag = false;
      return "";
    }
    return arg;
  });
  return flag ? str : "";
}

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str: string) {
  if (!str || str == "undefined" || str == "null") {
    return "";
  }
  return str;
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(
  data: any,
  id: string,
  parentId: string,
  children: string,
  rootId: string,
) {
  id = id || "id";
  parentId = parentId || "pId";
  children = children || "children";
  rootId = rootId || "0";
  //对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data));
  //循环所有项
  const treeData = cloneData.filter(
    (father: { [x: string]: any; children: any }) => {
      const branchArr = cloneData.filter((child: { [x: string]: any }) => {
        //返回每一项的子级数组
        return father[id] === child[parentId];
      });
      branchArr.length > 0 ? (father.children = branchArr) : "";
      //返回第一层
      return father[parentId] === rootId;
    },
  );
  return treeData != "" ? treeData : data;
}
