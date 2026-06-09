import uni from "@dcloudio/vite-plugin-uni";
import { defineConfig } from "vite";
import path from "path";
import { proxy } from "./config/proxy";

function resolve(dir: string) {
	return path.resolve(__dirname, dir);
}

// https://vitejs.dev/config/

export default defineConfig(() => {
	return {
		plugins: [uni()],
		resolve: {
			alias: {
				"/@": resolve("./"),
				"/$": resolve("./uni_modules/"),
			},
		},
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `
						@import "uview-plus/theme.scss";
						@import "uview-plus/libs/css/mixin.scss";
					`,
				},
			},
		},
		server: {
			port: 9900,
			proxy,
			hmr: {
				overlay: true,
			},
		},
		build: {
			outDir: "unpackage/dist/h5",
			assetsDir: "static",
			rollupOptions: {
				output: {
					entryFileNames: "static/js/[name].[hash].js",
					chunkFileNames: "static/js/[name].[hash].js",
					assetFileNames: "static/[ext]/[name].[hash].[ext]",
				},
			},
		},
	};
});