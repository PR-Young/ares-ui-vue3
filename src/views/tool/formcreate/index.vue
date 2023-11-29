<template>
  <div class="container">
    <el-row class="action-bar">
      <el-button :icon="ElIconPlus" link @click="handleForm"> 保存 </el-button>
      <el-button :icon="ElIconView" link @click="showJson">
        查看json
      </el-button>
      <el-button :icon="Upload" link @click="setJson"> 导入JSON</el-button>
      <el-button :icon="Upload" link @click="setOption"> 导入Options</el-button>
      <el-button :icon="ElIconPlus" link @click="showOption"
        >生成Options</el-button
      >
      <el-button :icon="ElIconPlus" link @click="showTemplate"
        >生成组件</el-button
      >
    </el-row>
    <el-row class="empty-info">
      <fc-designer ref="designer" style="height: 780px" />
    </el-row>

    <el-dialog :title="title[type]" v-model="state" class="_fc-t-dialog">
      <div ref="editor" v-if="state"></div>
      <span style="color: red" v-if="err">输入内容格式有误!</span>
      <template v-slot:footer v-if="type > 2">
        <div class="dialog-footer">
          <el-button @click="state = false" size="small">取 消</el-button>
          <el-button type="primary" @click="onOk" size="small">确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <!--表单配置详情-->
    <el-dialog
      :title="formTitle"
      v-model="formOpen"
      width="500px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="表单名称" prop="formName">
          <el-input v-model="form.formName" placeholder="请输入表单名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import "codemirror/lib/codemirror.css";
import "codemirror/addon/lint/lint.css";
import CodeMirror from "vue-codemirror6";
import "codemirror/addon/lint/lint";
import "codemirror/addon/lint/json-lint";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/vue/vue";
import "codemirror/mode/xml/xml";
import "codemirror/mode/css/css";
import "codemirror/addon/mode/overlay";
import "codemirror/addon/mode/simple";
import "codemirror/addon/selection/selection-pointer";
import "codemirror/mode/handlebars/handlebars";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/pug/pug";

import {
  Plus as ElIconPlus,
  VideoPlay as ElIconVideoPlay,
  View as ElIconView,
  Download as ElIconDownload,
  DocumentCopy as ElIconDocumentCopy,
  Delete as ElIconDelete,
  Upload,
} from "@element-plus/icons";
import formCreate from "@form-create/element-ui";
import { getForm, addForm, updateForm } from "@/api/flowable/form";
import store from "@/store";
import useTagsViewStore from "@/store/modules/tagsView";
const tagsView = useTagsViewStore(store);

export default {
  data() {
    return {
      state: false,
      value: null,
      title: [
        "查看JSON",
        "生成规则",
        "表单规则",
        "设置生成规则",
        "设置表单规则",
      ],
      editor: null,
      err: false,
      type: -1,
      formOpen: false,
      formTitle: "",
      // 表单参数
      form: {
        id: null,
        formName: null,
        formContent: null,
        remark: null,
      },
      // 表单校验
      rules: {},
      ElIconPlus,
      ElIconVideoPlay,
      ElIconView,
      ElIconDownload,
      ElIconDocumentCopy,
      ElIconDelete,
      Upload,
    };
  },
  components: {},
  computed: {},
  watch: {
    state(n) {
      if (!n) {
        this.value = null;
        this.err = false;
      }
    },
    value() {
      this.load();
    },
  },
  mounted() {
    debugger;
    const that = this;
    const formId = that.$route.query && that.$route.query.formId;
    if (formId) {
      getForm(formId).then((res) => {
        that.form = res.data;
        that.value = JSON.parse(res.data.formContent).config;
        this.$refs.designer.setRule(that.value);
      });
    } else {
    }
  },
  methods: {
    load() {
      let val;
      if (this.type === 2) {
        val = this.value;
      } else if (this.type === 0) {
        val = formCreate.toJson(this.value, 2);
      } else {
        val = JSON.stringify(this.value, null, 2);
      }
      this.$nextTick(() => {
        this.editor = CodeMirror(this.$refs.editor, {
          lineNumbers: true,
          mode: this.type === 2 ? { name: "vue" } : "application/json",
          gutters: ["CodeMirror-lint-markers"],
          lint: true,
          line: true,
          tabSize: 2,
          lineWrapping: true,
          value: val || "",
        });
        this.editor.on("blur", () => {
          this.err = this.editor.state.lint.marked.length > 0;
        });
      });
    },
    showJson() {
      this.state = true;
      this.type = 0;
      this.value = this.$refs.designer.getRule();
    },
    showOption() {
      this.state = true;
      this.type = 1;
      this.value = this.$refs.designer.getOption();
    },
    showTemplate() {
      this.state = true;
      this.type = 2;
      this.value = this.makeTemplate();
    },
    setJson() {
      this.state = true;
      this.type = 3;
      this.value = [];
    },
    setOption() {
      this.state = true;
      this.type = 4;
      this.value = { form: {} };
    },
    onOk() {
      if (this.err) return;
      const json = this.editor.getValue();
      let val = JSON.parse(json);
      if (this.type === 3) {
        if (!Array.isArray(val)) {
          this.err = true;
          return;
        }
        this.$refs.designer.setRule(formCreate.parseJson(json));
      } else {
        if (!is.Object(val) || !val.form) {
          this.err = true;
          return;
        }
        this.$refs.designer.setOption(val);
      }
      this.state = false;
    },
    makeTemplate() {
      const rule = this.$refs.designer.getRule();
      const opt = this.$refs.designer.getOption();
      return `<template>
                <form-create
                  v-model="fapi"
                  :rule="rule"
                  :option="option"
                  @submit="onSubmit"
                ></form-create>
              </template>
              <script>
              import formCreate from "@form-create/element-ui";
              export default {
                data () {
                  return {
                    fapi: null,
                    rule: formCreate.parseJson('${formCreate
                      .toJson(rule)
                      .replaceAll("\\", "\\\\")}'),
                    option: formCreate.parseJson('${JSON.stringify(opt)}')
                  }
                },
                 methods: {
                  onSubmit (formData) {
                    //todo 提交表单
                  }
                }
              }
              <\/script>`;
    },
    /** 表单基本信息 */
    handleForm() {
      debugger;
      let fields = [];
      let rules = this.$refs.designer.getRule();
      for (let i = 0; i < rules.length; i++) {
        fields[i] = { __config__: rules[i], __vModel__: rules[i].field };
      }
      this.formData = {
        fields: fields,
        config: this.$refs.designer.getRule(),
      };
      this.form.formContent = JSON.stringify(this.formData);
      this.formOpen = true;
      this.formTitle = "添加表单";
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        formName: null,
        formContent: null,
        remark: null,
      };
      this.resetForm("form");
    },
    // 取消按钮
    cancel() {
      this.formOpen = false;
      this.reset();
    },
    /** 保存表单信息 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateForm(this.form).then((response) => {
              this.msgSuccess("修改成功");
            });
          } else {
            addForm(this.form).then((response) => {
              this.msgSuccess("新增成功");
            });
          }
          this.formOpen = false;
          // 关闭当前标签页并返回上个页面
          tagsView.delView(this.$route);
          this.$router.go(-1);
        }
      });
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/home";
.el-tabs__nav {
  width: 100%;
}
.el-tabs__item {
  width: 50%;
  text-align: center;
}
.empty-info {
  position: absolute;
  top: 5.5%;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 18px;
  color: #ccb1ea;
  letter-spacing: 4px;
}
.action-bar {
  position: relative;
  height: 42px;
  text-align: right;
  padding: 10px 15px;
  // box-sizing: border-box;
  border: 1px solid #f1e8e8;
  border-top: none;
  border-left: none;
  right: 0;
  display: block;
  width: 100%;

  .delete-btn {
    color: #f56c6c;
  }
}

aside {
  background: #ffffff;
  padding: 8px 24px;
  margin-bottom: 20px;
  border-radius: 2px;
  display: block;
  line-height: 32px;
  font-size: 16px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  color: #2c3e50;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
