import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { adminApiPlugin } from "./server/admin-api.js";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react(),
      adminApiPlugin({
        user: env.ADMIN_USER || "shaurya",
        password: env.ADMIN_PASSWORD || "Shaurya@2026",
        inbox: env.CONTACT_TO || "shaurya13822@gmail.com",
        smtpUser: env.SMTP_USER || "",
        smtpPass: String(env.SMTP_PASS || "").trim().replace(/^["']|["']$/g, "").replace(/\s/g, ""),
        mailHook: env.MAIL_HOOK || "",
        mailSecret: env.MAIL_SECRET || "",
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      "process.env.REACT_APP_BACKEND_URL": JSON.stringify(env.REACT_APP_BACKEND_URL || ""),
    },
    server: {
      allowedHosts: ["shaurya-dev.onrender.com"],
    },
  };
});
