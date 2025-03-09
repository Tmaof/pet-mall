// 默认情况下，Vite 在 vite/client.d.ts 中为 import.meta.env 提供了类型定义。随着在 .env[mode] 文件中自定义了越来越多的环境变量，
// 你可能想要在代码中获取这些以 VITE_ 为前缀的用户自定义环境变量的 TypeScript 智能提示。
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  // 更多环境变量...
  readonly VITE_APP_baseUrl: string;
  readonly VITE_APP_uploadUrl: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
