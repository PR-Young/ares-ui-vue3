<template>
  <div class="app-container">
    <el-button class="toggle-button" @click="collapse">|||</el-button>

    <div class="flow-context" :style="'width: 100%; height:' + height">
      <Tinyflow
        ref="tinyflow"
        :className="'custom-class'"
        :style="{ width: '100%', height: '100%' }"
        :data="initialData"
        :provider="provider"
      />
      <el-drawer
        v-model="state.isCollapse"
        v-if="state.mounted"
        :append-to-body="false"
        append-to=".flow-context"
        :modal="false"
        direction="rtl"
      >
        <template #header>
          <h4>测试</h4>
        </template>
        <template #default>
          <div>
            <div>
              <p>请输入运行参数：</p>
            </div>
            <div ref="paramsContainer"></div>

            <div class="modal-right">
              <p>执行结果：</p>
              <pre ref="resultText"></pre>
            </div>
          </div>
        </template>
        <template #footer>
          <div style="flex: auto">
            <el-button @click="submitParams()">提交</el-button>
            <el-button @click="save()">保存</el-button>
            <el-button @click="openModal()">运行</el-button>
          </div>
        </template>
      </el-drawer>
    </div>
  </div>
</template>

<script setup lang="ts" name="Tinyflow">
import { useRouter } from "vue-router";
import { Tinyflow } from "@tinyflow-ai/vue";
import "@tinyflow-ai/vue/dist/index.css";
import { ref, reactive, onMounted } from "vue";
import {
  updateSysWorkflows,
  getSysWorkflows,
  execute,
} from "@/api/ai/workflow";

const router = useRouter();
const height = document.documentElement.clientHeight - 94.5 + "px;";
const params = router.currentRoute.value.query;

const state = reactive({
  isCollapse: false,
  mounted: false,
});

const tinyflow = ref();
const paramsContainer = ref();
const resultText = ref();

const provider = {
  llm: () => [
    {
      value: "llm",
      label: "llm",
    },
  ],
  knowledge: () => [
    {
      value: "llm",
      label: "llm",
    },
  ],
  searchEngine: () => [
    {
      value: "llm",
      label: "llm",
    },
  ],
};
const initialData = ref({
  nodes: [],
  edges: [],
});

onMounted(() => {
  state.mounted = true;
  load();
});
const collapse = () => {
  state.isCollapse = !state.isCollapse;
  console.log(state.isCollapse);
};
const load = () => {
  getSysWorkflows(params.id).then((res) => {
    initialData.value = JSON.parse(res.data.graph);
    tinyflow.value = {
      data: JSON.parse(res.data.graph),
      provider: {
        llm: () => [
          {
            value: "llm",
            label: "llm",
          },
        ],
        knowledge: () => [],
      },
    };
  });
};

const openModal = () => {
  debugger;
  var paramArr = tinyflow.value.getData().nodes;
  console.log(paramArr);
  for (let i = 0; i < paramArr.length; i++) {
    if (paramArr[i].type === "startNode") {
      var params = paramArr[i].data.parameters;
      paramsContainer.value.innerHTML = ""; // 清空之前的参数
      for (var key in params) {
        paramsContainer.value.innerHTML += `<label>${params[key].name}: <input type="text" id="${key}" value=""/></label><br/>`;
      }
      break;
    }
  }
};

const submitParams = () => {
  var paramArr = tinyflow.value.getData().nodes;
  var paramsObj = {};
  for (let i = 0; i < paramArr.length; i++) {
    if (paramArr[i].type === "startNode") {
      var params = paramArr[i].data.parameters;
      for (var key in params) {
        var param = params[key];
        var element = document.getElementById(key);
        if (!element) {
          console.error("未找到元素:", key);
          continue;
        }
        var value;
        switch (param.dataType) {
          case "Boolean":
            // 假设使用checkbox，获取checked属性
            value = element.checked;
            break;
          case "Number":
            // 转换为数字，无效值转为NaN
            value = Number(element.value);
            break;
          case "File":
            // 获取文件对象
            value = element.files[0] || null;
            break;
          case "Object":
          case "Array":
            // 尝试解析JSON
            try {
              value = JSON.parse(element.value);
            } catch (e) {
              console.error(`参数“${param.name}”的JSON解析失败:`, e);
              value = element.value; // 保留原始值或根据需求处理
            }
            break;
          default: // String及其他未指定类型
            value = element.value;
        }
        paramsObj[param.name] = value;
      }
      break;
    }
  }
  exec(paramsObj);
};

const save = () => {
  var id = params.id;
  var name; // 将 name 变量提升到函数作用域
  // 检查 id 是否为空
  if (id === undefined || id === "" || id == null) {
    // 弹出输入框，获取用户输入的 name
    name = prompt("请输入 name 值：");
    if (name === null || name === "") {
      alert("name 不能为空！");
      return; // 如果用户没有输入 name，直接返回，不执行后续操作
    }
  }
  // 创建 data 对象
  var data = {
    id: id,
    graph: JSON.stringify(tinyflow.value.getData()),
  };

  // 如果 id 为空，添加 name 字段到 data 中
  if (id === undefined || id === "" || id == null) {
    data.workflowName = name;
  }
  updateSysWorkflows(data).then((response) => {
    if (response.code != 200) throw new Error("请求失败");
  });
};

const exec = (param: string) => {
  const data = {
    param: param,
    data: tinyflow.value.getData(),
  };

  execute(data).then((response) => {
    showResult(response.data);
  });
};
const showResult = (result: any) => {
  resultText.value.innerHTML = ""; // 清空容器

  // 类型检查增强
  if (!isValidInput(result)) {
    resultText.value.innerHTML =
      '<div style="color: red">错误：参数必须是对象或数组</div>';
    return;
  }

  // 安全遍历自身可枚举属性
  Object.keys(result).forEach((key) => {
    try {
      const div = document.createElement("div");
      div.innerHTML = `
                <span class="key">${escapeHtml(key)}</span>:
                <span class="value">${formatValue(result[key])}</span>
            `;
      resultText.value.appendChild(div);
    } catch (e) {
      console.error(`渲染属性 ${key} 时出错:`, e);
    }
  });
};

// 类型校验函数
const isValidInput = (input: any) => {
  const type = Object.prototype.toString.call(input);
  return type === "[object Object]" || type === "[object Array]";
};

// 值格式化函数（核心改进）
const formatValue = (value: any): string => {
  if (value === null) return '<span class="null">null</span>';
  if (value === undefined) return '<span class="undefined">undefined</span>';

  switch (typeof value) {
    case "object":
      // 处理特殊对象类型
      if (Array.isArray(value)) {
        return `[ ${value.map((item) => formatValue(item)).join(", ")} ]`;
      } else if (value instanceof Date) {
        return `<time>${value.toISOString()}</time>`;
      }
      // 简单对象处理（限制递归深度可在此添加）
      return `{ ${Object.keys(value)
        .map((k) => `${k}: ${formatValue(value[k])}`)
        .join(", ")} }`;
    case "string":
      return `<span class="string">"${escapeHtml(value)}"</span>`;
    case "number":
      return `<span class="number">${value}</span>`;
    case "boolean":
      return `<span class="boolean">${value.toString()}</span>`;
    default:
      return escapeHtml(String(value));
  }
};

// HTML转义防止XSS
const escapeHtml = (str: any) => {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
};
</script>

<style>
.build-aside {
  z-index: 1;
  right: 0;
  position: fixed;
  background-color: #fefefe;
  border: 1px solid #eee;
  border-radius: 5px;
  box-shadow: 0 0 5px #0000001a;
  padding: 10px;
  transition: width 0.5s linear 0s;
}
.modal-right {
  background-color: #fefefe;
  padding: 0;
  margin: 0;
  width: 100%;
}
.toggle-button {
  z-index: 1;
  text-align: center;
  position: fixed;
  padding: 5px;
  margin: 5px;
  height: fit-content;
  width: fit-content;
  background: #fff;
  border: 1px solid #ccc;
  cursor: pointer;
  border-radius: 5px;
  right: 5px;
}
.flow-context {
  position: relative;
}
</style>
