
/// <reference types="vite/client" />

//环境变量 TypeScript的智能提示
interface ImportMetaEnv {
    VITE_VUE_APP_TITLE: string;
    VITE_VUE_APP_PORT: number;
    VITE_APP_BASE_API: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}


declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}