/// <reference types="vite/client" />
/// <reference types="@dcloudio/types/uni-app/index.d.ts" />

declare module "*.vue" {
	import { DefineComponent } from "vue";
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
	const component: DefineComponent<{}, {}, any>;
	export default component;
}

declare module "@dcloudio/vite-plugin-uni";
declare module "uqrcodejs";