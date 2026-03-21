/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GATEWAY_WS_URL: string;
  readonly VITE_ECHO_API_URL: string;
  readonly VITE_GATEWAY_TOKEN: string;
  readonly VITE_AZURE_CLIENT_ID: string;
  readonly VITE_AZURE_TENANT_ID: string;
  readonly VITE_API_SCOPE: string;
  readonly VITE_ENABLE_GPS: string;
  readonly VITE_ENABLE_PUSH: string;
  readonly VITE_ENABLE_OFFLINE: string;
  readonly VITE_VAPID_PUBLIC_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
