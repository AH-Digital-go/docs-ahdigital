import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/n8n": {
        target: "https://n8n-supabase-7soe.onrender.com", // ton n8n local
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/n8n/, ""), // supprime le préfixe /n8n
      },
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
