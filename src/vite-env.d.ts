/// <reference types="@spiriit/vite-plugin-svg-spritemap/dist/client" />
/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/vue" />

declare module '*.vue' {
  import type { defineComponent } from 'vue'

  const component: ReturnType<typeof defineComponent>
  export default component
}

declare module '*.svg?use' {
  const src: string // Обычно ?use возвращает URL для вставки в спрайт
  export default src
}
declare module '*.svg?view' {
  const src: string
  export default src
}

interface ImportMetaEnv {
  readonly VITE_API_TARGET: string
  readonly VITE_MERCURE_TARGET: string
  readonly VITE_MERCURE_TOKEN: string
  readonly PACKAGE_VERSION: string
  readonly VITE_DEBUG_SW_FEATURE: boolean
  readonly VITE_FEATURE_DEBUG_ENABLE: boolean
  readonly VITE_YANDEX_METRIC_ID: string
  readonly VITE_IS_LOCAL_REFRESH_AUTH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
