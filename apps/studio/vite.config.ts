import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
	root: fileURLToPath(new URL(".", import.meta.url)),
	plugins: [react()],
	resolve: { alias: { "@cage/schema": fileURLToPath(new URL("../../packages/schema/src/index.ts", import.meta.url)) } },
	build: { outDir: "../../dist/studio", emptyOutDir: true },
});
