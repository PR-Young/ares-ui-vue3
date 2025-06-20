/* eslint-disable prettier/prettier */
module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
        jest: true,
    },
    // 指定如何解析语法
    parser: "vue-eslint-parser",
    //优先级低于parse的语法解析配置
    parserOptions: {
        ecmaVersion: "latest",
        parser: "@typescript-eslint/parser",
        sourceType: "module",
        jsxPragma: "Recat",
        ecmaFeatures: {
            jsx: true,
        },
    },
    //   继承已有的规则
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:vue/vue3-essential",
        "plugin:prettier/recommended",
    ],
    overrides: [
        {
            env: {
                node: true,
            },
            files: [".eslintrc.{js,cjs}"],
            parserOptions: {
                sourceType: "script",
            },
        },
    ],
    /**
     * 'off' 或0  ==>关闭规则
     * 'warn'或1   ==>打开的规则作为警告
     * 'error'或2   ==>规则作为一个错误（代码不能执行，界面报错）
     */

    plugins: ["@typescript-eslint", "vue"],
    rules: {
        "no-var": "error", //要求使用let或const而不是var
        "no-multiple-empty-lines": ["warn", { max: 1 }], //不允许多个空行
        "no-console": process.env.NODE_ENV == "production" ? "error" : "off",
        "no-debugger": process.env.NODE_ENV == "production" ? "error" : "off",
        "no-unexpected-multiline": "error", //禁止空余的多行
        "no-useless-escape": "off", //禁止不必要的转移字符
        "@typescript-eslint/no-unused-vars": "off", //禁止定义未使用的变量
        "@typescript-eslint/prefer-ts-expect-error": "error", //禁止使用@ts-ignore
        "@typescript-eslint/no-explicit-any": "off", //禁止使用any类型
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-namespace": "off", //禁止使用自定义Typescript模板
        "@typescript-eslint/semi": "off",
        "vue/multi-word-component-names": "off", //要求组件名称始终为'-'链接的单词
        "vue/no-mutating-props": "off", //不允许组件props的改成
        "vue/attribute-hyphenation": "off", //对模板中的自定义组件强制执行属性命名样式
        "trailingComma": "none"
    },
};
