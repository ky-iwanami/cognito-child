/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EXTERNAL_API_NAME: string;
  readonly VITE_EXTERNAL_API_ENDPOINT: string;
  readonly VITE_EXTERNAL_API_REGION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}