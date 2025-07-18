export const inputComponents = [
  {
    label: "单行输入框",
    dataType: "string",
    showLabel: true,
    tag: "el-input",
    tagIcon: "input",
    placeholder: "请输入",
    defaultValue: undefined,
    span: 24,
    labelWidth: null,
    style: { width: "100%" },
    clearable: true,
    prepend: "",
    append: "",
    "prefix-icon": "",
    "suffix-icon": "",
    maxlength: null,
    "show-word-limit": false,
    readonly: false,
    disabled: false,
    required: true,
    regList: [],
    __slot__: {},
    changeTag: true,
    proCondition: false,
    asSummary: false,
  },
  {
    label: "多行输入框",
    type: "textarea",
    showLabel: true,
    tag: "el-input",
    tagIcon: "textarea",
    dataType: "string",
    placeholder: "请输入",
    defaultValue: undefined,
    span: 24,
    labelWidth: null,
    autosize: {
      minRows: 4,
      maxRows: 4,
    },
    style: { width: "100%" },
    maxlength: null,
    "show-word-limit": false,
    readonly: false,
    disabled: false,
    required: true,
    regList: [],
    changeTag: true,
    proCondition: false,
    asSummary: false,
  },
  {
    label: "密码",
    dataType: "string",
    showLabel: true,
    tag: "el-input",
    tagIcon: "password",
    placeholder: "请输入",
    defaultValue: undefined,
    span: 24,
    "show-password": true,
    labelWidth: null,
    style: { width: "100%" },
    clearable: true,
    prepend: "",
    append: "",
    "prefix-icon": "",
    "suffix-icon": "",
    maxlength: null,
    "show-word-limit": false,
    readonly: false,
    disabled: false,
    required: true,
    regList: [],
    changeTag: true,
    proCondition: false,
    asSummary: false,
  },
  {
    label: "数字输入框",
    showLabel: true,
    tag: "el-input-number",
    tagIcon: "number",
    dataType: "number",
    placeholder: "",
    defaultValue: undefined,
    style: { width: null },
    span: 24,
    labelWidth: null,
    min: undefined,
    max: undefined,
    step: undefined,
    "step-strictly": false,
    precision: undefined,
    "controls-position": "right",
    disabled: false,
    required: true,
    regList: [],
    changeTag: true,
    proCondition: true,
  },
];

export const selectComponents = [
  {
    label: "下拉选择",
    dataType: "select",
    showLabel: true,
    orgTag: "el-select",
    tag: "my-select",
    tagIcon: "select",
    placeholder: "请选择",
    style: { width: "100%" },
    defaultValue: undefined,
    span: 24,
    labelWidth: null,
    clearable: true,
    disabled: false,
    required: true,
    filterable: false,
    multiple: false,
    ///
    customDefaultValue: true,

    options: [
      {
        label: "选项一",
        value: "选项一",
      },
      {
        label: "选项二",
        value: "选项二",
      },
    ],
    regList: [],
    changeTag: true,
    proCondition: true,
  },
  {
    label: "级联选择",
    showLabel: true,
    dataType: "select",
    tag: "el-cascader",
    tagIcon: "cascader",
    placeholder: "请选择",
    defaultValue: [],
    span: 24,
    labelWidth: null,
    style: { width: "100%" },
    props: {
      props: {
        multiple: false,
      },
    },
    "show-all-levels": true,
    disabled: false,
    clearable: true,
    filterable: false,
    required: true,

    options: [
      {
        id: 1,
        value: "选项1",
        label: "选项1",
        children: [
          {
            id: 2,
            value: "选项1-1",
            label: "选项1-1",
          },
        ],
      },
    ],
    optionType: "static",
    labelKey: "label",
    valueKey: "value",
    childrenKey: "children",
    separator: "/",
    regList: [],
    changeTag: true,
    proCondition: false,
    asSummary: false,
  },
  {
    label: "单选框组",
    showLabel: true,
    orgTag: "el-radio-group",
    tag: "my-radio-group",
    tagIcon: "radio",
    defaultValue: undefined,
    span: 24,
    labelWidth: null,
    style: {},
    optionType: "default",
    border: false,
    disabled: false,
    required: true,
    options: [
      {
        label: "选项一",
        value: "选项一",
      },
      {
        label: "选项二",
        value: "选项二",
      },
    ],
    regList: [],
    changeTag: true,
    proCondition: true,
  },
  {
    label: "多选框组",
    showLabel: true,
    orgTag: "el-checkbox-group",
    tag: "my-checkbox-group",
    tagIcon: "checkbox",
    dataType: "checkbox",
    defaultValue: undefined,
    span: 24,
    labelWidth: null,
    style: {},
    optionType: "default",
    border: false,
    disabled: false,
    required: true,
    multiple: true,
    options: [
      {
        label: "选项一",
        value: "选项一",
      },
      {
        label: "选项二",
        value: "选项二",
      },
    ],
    regList: [],
    changeTag: true,
    proCondition: false,
    asSummary: false,
  },
  {
    label: "开关",
    showLabel: true,
    dataType: "bool",
    tag: "el-switch",
    tagIcon: "switch",
    defaultValue: false,
    span: 24,
    labelWidth: null,
    style: {},
    disabled: false,
    required: true,
    "active-text": "",
    "inactive-text": "",
    "active-color": null,
    "inactive-color": null,
    "active-value": true,
    "inactive-value": false,
    regList: [],
    changeTag: true,
    proCondition: false,
    asSummary: false,
  },
  {
    label: "滑块",
    dataType: "number",
    showLabel: true,
    tag: "el-slider",
    tagIcon: "slider",
    defaultValue: null,
    span: 24,
    labelWidth: null,
    disabled: false,
    required: true,
    min: 0,
    max: 100,
    step: 1,
    "show-stops": false,
    range: false,
    regList: [],
    changeTag: true,
    proCondition: false,
    asSummary: false,
  },

  {
    // el-time-picker
    label: "时间选择",
    showLabel: true,
    dataType: "range",
    tag: "el-time-picker",
    tagIcon: "time",
    placeholder: "请选择",
    defaultValue: undefined,
    span: 24,
    labelWidth: null,
    style: { width: "100%" },
    disabled: false,
    clearable: true,
    required: true,
    "picker-options": {
      selectableRange: "00:00:00-23:59:59",
    },
    format: "HH:mm:ss",
    "value-format": "HH:mm:ss",
    regList: [],
    changeTag: true,
    proCondition: false,
    asSummary: false,
  },
  {
    label: "时间范围",
    showLabel: true,
    dataType: "range",
    tag: "ai-time-duration",
    showDuration: false,
    tagIcon: "time-range",
    defaultValue: undefined,
    span: 24,
    labelWidth: null,
    style: { width: "100%" },
    disabled: false,
    clearable: true,
    required: true,
    "is-range": true,
    "range-separator": "至",
    "start-placeholder": "开始时间",
    "end-placeholder": "结束时间",
    format: "HH:mm:ss",
    "value-format": "HH:mm:ss",
    regList: [],
    changeTag: true,
    proCondition: true,
    asSummary: false,
  },
  {
    label: "日期选择",
    showLabel: true,
    dataType: "date",
    tag: "el-date-picker",
    tagIcon: "date",
    placeholder: "请选择",
    defaultValue: null,
    type: "date",
    span: 24,
    labelWidth: null,
    style: { width: "100%" },
    disabled: false,
    clearable: true,
    required: true,
    format: "YYYY-MM-DD",
    "value-format": "YYYY-MM-DD",
    readonly: false,
    regList: [],
    changeTag: true,
    proCondition: false,
    asSummary: false,
  },
  {
    label: "日期范围",
    showLabel: true,
    dataType: "range",
    tag: "ai-date-duration",
    showDuration: false,
    tagIcon: "date-range",
    defaultValue: null,
    span: 24,
    labelWidth: null,
    style: { width: "100%" },
    type: "daterange",
    "range-separator": "至",
    "start-placeholder": "开始日期",
    "end-placeholder": "结束日期",
    disabled: false,
    clearable: true,
    required: true,
    format: "YYYY-MM-DD",
    "value-format": "YYYY-MM-DD",
    readonly: false,
    regList: [],
    changeTag: true,
    proCondition: true,
    asSummary: false,
  },
  {
    label: "评分",
    dataType: "number",
    showLabel: true,
    tag: "el-rate",
    tagIcon: "rate",
    defaultValue: 0,
    span: 24,
    labelWidth: null,
    style: {},
    max: 5,
    "allow-half": false,
    "show-text": false,
    "show-score": false,
    disabled: false,
    required: true,
    regList: [],
    changeTag: true,
    proCondition: false,
    asSummary: false,
  },
  {
    label: "颜色选择",
    showLabel: true,
    tag: "el-color-picker",
    tagIcon: "color",
    defaultValue: null,
    labelWidth: null,
    "show-alpha": true,
    "color-format": "",
    predefine: [
      "#ff4500",
      "#ff8c00",
      "#ffd700",
      "#90ee90",
      "#00ced1",
      "#1e90ff",
      "#c71585",
      "rgba(255, 69, 0, 0.68)",
      "rgb(255, 120, 0)",
      "hsv(51, 100, 98)",
      "hsva(120, 40, 94, 0.5)",
      "hsl(181, 100%, 37%)",
      "hsla(209, 100%, 56%, 0.73)",
      "#c7158577",
    ],
    disabled: false,
    required: true,
    regList: [],
    changeTag: true,
    proCondition: false,
    asSummary: false,
  },

  {
    label: "附件",
    showLabel: true,
    orgTag: "el-upload",
    tag: "my-upload",
    tagIcon: "upload",
    action: "htts://192.168.1.71:8000/api/admin/file/upload-file",
    defaultValue: [],
    labelWidth: null,
    disabled: false,
    required: true,
    accept: "",
    name: "file",
    "auto-upload": true,
    showTip: false,
    buttonText: "点击上传附件",
    fileSize: 20,
    sizeUnit: "MB",
    "list-type": "text",
    multiple: false,
    regList: [],
    changeTag: true,
    proCondition: false,
    asSummary: false,
    span: 24,
  },
];
// 容器组件
export const layoutComponents = [
  {
    layout: "rowFormItem",
    orgTag: "el-row",
    tag: "my-row",
    //cols:[{span:12,children:[]},{span:12,children:[]}],
    rowType: "layout",
    tagIcon: "row",
    type: "default",
    justify: "start",
    align: "top",
    label: "行容器",
    layoutTree: true,
    children: [],

    showDivider: true,
    description: "",
    span: 24,
  },
  {
    layout: "rowFormItem",
    orgTag: "el-card",
    tag: "my-card",
    span: 24,
    width: "100%",
    header: "卡片名称",
    rowType: "layout",
    tagIcon: "card",
    type: "default",
    justify: "start",
    align: "top",
    label: "卡片容器",
    layoutTree: true,
    children: [],
    showDivider: true,
    description: "",
    shadow: "always",
  },

  {
    layout: "rowFormItem",
    showLabel: false,
    orgTag: "el-tabs",
    tag: "my-tabs",
    span: 24,
    tabPosition: "top",
    disabled: false,
    tagIcon: "tab",
    rowType: "layout",
    children: [
      {
        label: "Tab1",
        value: "Tab1",
        rowType: "layout",
        layout: "rowFormItem",
        content: "tab1",
        children: [],
      },
      {
        rowType: "layout",
        layout: "rowFormItem",
        label: "Tab2",
        value: "Tab2",
        content: "tab2",
        children: [],
      },
    ],
    activeName: "Tab1",
    type: "border-card",
    align: "top",
    label: "标签页",
    layoutTree: false,
    showDivider: true,
    defaultValue: "Tab1",
  },

  {
    layout: "rowFormItem",
    showLabel: false,
    orgTag: "table",
    tag: "my-table",
    disabled: false,
    tagIcon: "table",
    rowType: "layout",
    children: [
      {
        rowType: "layout",
        layout: "rowFormItem",
        children: [
          {
            rowType: "layout",
            layout: "rowFormItem",
            colSpan: 1,
            rowSpan: 1,
            children: [],
            state: 0,
          },
        ],
      },
    ],
    border: true,
    span: 24,
    label: "表格",
    type: "flex",
  },
];

export const commonComponents = [
  ...inputComponents,
  ...selectComponents,
  ...layoutComponents,
].map((t) => Object.assign({ cmpType: "common" }, t));

// .map( t => Object.assign( { cmpType: 'custom', t } ) )

export default {
  inputComponents,
  selectComponents,
  layoutComponents,
};
