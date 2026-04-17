import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/campaign": {
        target: "https://api.dev-directoai.com.br",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
