<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      style="height: 500px; overflow-y: hidden"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
    />
  </div>
</template>

<script lang="ts">
import { Boot, IButtonMenu, IDomEditor } from "@wangeditor/editor";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { getUpdateInfo, save } from "@/api/blog";
import {
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
} from "vue";
export default {
  name: "AresUpdateInfo",
  components: {
    Editor,
    Toolbar,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef();

    // 内容 HTML
    const valueHtml = ref("<p>hello</p>");

    // 模拟 ajax 异步获取内容
    onMounted(() => {
      setTimeout(() => {
        valueHtml.value = "<p>模拟 Ajax 异步设置内容</p>";
        getUpdateInfo().then((res) => {
          valueHtml.value = res.data;
        });
      }, 1500);
    });
    debugger;
    const toolbarConfig = {};
    const editorConfig = { placeholder: "请输入内容..." };

    const saveMenuConf = {
      key: "saveMenu", // 定义 menu key ：要保证唯一、不重复（重要）
      factory() {
        return new MyButtonMenu(); // 把 `YourMenuClass` 替换为你菜单的 class
      },
    };

    Boot.registerMenu(saveMenuConf);
    toolbarConfig.insertKeys = {
      index: 60, // 插入的位置，基于当前的 toolbarKeys
      keys: ["saveMenu"],
    };

    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
      const editor = editorRef.value;
      if (editor == null) return;
      editor.destroy();
    });

    const handleCreated = (editor: any) => {
      editorRef.value = editor; // 记录 editor 实例，重要！
    };

    const saveData = () => {
      const editor = editorRef.value;
      const data = { content: editor.getHtml() };
      save(data).then((res) => {
        console.log(res);
        if (res.data) {
          proxy.msgSuccess("保存成功");
        } else {
          proxy.msgError("保存失败");
        }
      });
      //console.log(this.detail.mdContent);
    };

    return {
      editorRef,
      valueHtml,
      mode: "default", // 或 'simple'
      toolbarConfig,
      editorConfig,
      handleCreated,
    };
  },
};

class MyButtonMenu implements IButtonMenu {
  title: string;
  tag: string;
  constructor() {
    this.title = "保存"; // 自定义菜单标题
    this.tag = "button";
  }

  // 获取菜单执行时的 value ，用不到则返回空 字符串或 false
  getValue(editor: IDomEditor): string | boolean {
    return " hello ";
  }

  // 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false
  isActive(editor: IDomEditor): boolean {
    return false;
  }

  // 菜单是否需要禁用（如选中 H1 ，“引用”菜单被禁用），用不到则返回 false
  isDisabled(editor: IDomEditor): boolean {
    return false;
  }

  // 点击菜单时触发的函数
  exec(editor: IDomEditor, value: string | boolean) {
    if (this.isDisabled(editor)) return;

    const data = { content: editor.getHtml() };
    console.log(data);
    save(data).then((res) => {
      console.log(res);
    });
  }
}
</script>
<style scoped>
.md {
  box-shadow: none;
  min-height: 600px;
}
.v-note-wrapper.shadow {
  box-shadow: none !important;
}
.v-note-wrapper .v-note-panel .v-note-show .v-show-content,
.v-note-wrapper .v-note-panel .v-note-show .v-show-content-html {
  background: #fff !important;
}
#editor {
  margin: auto;
  width: 100%;
  height: 580px;
  margin: 15px 0;
}
</style>
