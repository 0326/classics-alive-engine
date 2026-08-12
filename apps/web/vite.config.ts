import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
	root: fileURLToPath(new URL(".", import.meta.url)),
	plugins: [react()],
	resolve: {
		alias: {
			"@cage/schema": fileURLToPath(new URL("../../packages/schema/src/index.ts", import.meta.url)),
			"@cage/ink-vn-core": fileURLToPath(new URL("../../packages/ink-vn-core/src/index.ts", import.meta.url)),
			"@cage/historical-adapter": fileURLToPath(new URL("../../packages/historical-adapter/src/index.ts", import.meta.url)),
		},
	},
	server: { port: 4173 },
	build: { outDir: "../../dist/web", emptyOutDir: true },
});
