import { defineConfig } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig(({ mode }) => {
  const useHttps = mode === "https";

  return {
    plugins: useHttps ? [basicSsl()] : [],
    server: {
      host: true,
      port: 5173
    },
    preview: {
      host: true,
      port: 4173
    }
  };
});
