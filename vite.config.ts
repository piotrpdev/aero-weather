import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const isProduction = process.env.NODE_ENV === "production";

const profiling = isProduction && {
	"react-dom/client": "react-dom/profiling",
};

// https://vitejs.dev/config/
export default defineConfig(async () => ({
	plugins: [react()],
	resolve: {
		alias: {
			...profiling,
		},
	},
	esbuild: {
		minifyIdentifiers: false,
	},

	// Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
	//
	// 1. prevent vite from obscuring rust errors
	clearScreen: false,
	// 2. tauri expects a fixed port, fail if that port is not available
	server: {
		port: 1420,
		strictPort: true,
		watch: {
			// 3. tell vite to ignore watching `src-tauri`
			ignored: ["**/src-tauri/**"],
		},
	},
}));
