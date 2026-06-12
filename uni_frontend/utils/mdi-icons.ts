/**
 * 本地 MDI 图标数据
 * 用途：局域网环境下替代 Iconify CDN 加载图标
 * 数据来源：https://api.iconify.design/mdi.json
 * 当前已收录图标：arrow-left, arrow-right, chevron-right, dots-vertical, arrow-down, pencil, home, wrench,
 *                clipboard-pulse, pill, image-outline, phone, flask-outline, calendar-clock, refresh, account
 * 如需新增图标，从 Iconify 下载对应 SVG body 后补充到 icons 字段
 *
 * 重要：此文件必须放在源码目录（utils/）而非 static/，否则 Vite 不会编译 .ts
 */

export interface MdiIconSet {
	prefix: string;
	width: number;
	height: number;
	icons: Record<string, { body: string }>;
}

export const mdiIcons: MdiIconSet = {
	prefix: "mdi",
	width: 24,
	height: 24,
	icons: {
		"arrow-left": {
			body: '<path fill="currentColor" d="M20 11v2H8l5.5 5.5l-1.42 1.42L4.16 12l7.92-7.92L13.5 5.5L8 11z"/>',
		},
		"arrow-right": {
			body: '<path fill="currentColor" d="M4 11v2h12l-5.5 5.5l1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5L16 11z"/>',
		},
		"chevron-right": {
			body: '<path fill="currentColor" d="M8.59 16.58L13.17 12L8.59 7.41L10 6l6 6l-6 6z"/>',
		},
		"dots-vertical": {
			body: '<path fill="currentColor" d="M12 16a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0-6a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0-6a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2"/>',
		},
		"arrow-down": {
			body: '<path fill="currentColor" d="M11 4h2v12l5.5-5.5l1.42 1.42L12 19.84l-7.92-7.92L5.5 10.5L11 16z"/>',
		},
		"pencil": {
			body: '<path fill="currentColor" d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z"/>',
		},
		"home": {
			body: '<path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8z"/>',
		},
		"wrench": {
			body: '<path fill="currentColor" d="m22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9c-2-2-5-2.4-7.4-1.3L9 6L6 9L1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4"/>',
		},
		// SWL 诊疗模块图标
		"clipboard-pulse": {
			body: '<path fill="currentColor" d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-7 0c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1m-2 14l-1-2l-1 2H7l2.5-4.5L7 8h2l1 2l1-2h2l-2.5 4.5L15 17z"/>',
		},
		"pill": {
			body: '<path fill="currentColor" d="M19.8 19.8L4.2 4.2L2.8 5.6l3.7 3.7C4.8 10.6 4 12.7 4 15c0 3.3 2.7 6 6 6c2.3 0 4.4-.8 5.7-2.5l3.7 3.7zM10 13c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1m10-3c0-3.3-2.7-6-6-6c-2.3 0-4.4.8-5.7 2.5L4.2 2.5L2.8 3.9l15.6 15.6l1.4-1.4l-3.7-3.7C17.2 12.4 20 10.3 20 10"/>',
		},
		"image-outline": {
			body: '<path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H5V5h14zm-5-7l-3 3.72L9 13l-4 5h14z"/>',
		},
		"phone": {
			body: '<path fill="currentColor" d="M20 15.5c-1.2 0-2.5-.2-3.6-.6c-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1c-.3-1.1-.5-2.4-.5-3.6c0-.5-.5-1-1-1H4c-.5 0-1 .5-1 1c0 9.4 7.6 17 17 17c.5 0 1-.5 1-1v-3.5c0-.5-.5-1-1-1"/>',
		},
		"flask-outline": {
			body: '<path fill="currentColor" d="M9 2v2H7v3c0 1.1.9 2 2 2v1c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2v-1c1.1 0 2-.9 2-2V4h-2V2zm8 4v3H11V6zM7 9V6h2v3zm6 4h2v2h-2zm-2 0v2H9v-2zm0-2v-2h2v2zm4 0v-2h2v2zm-6 4h2v2H9zm6 0h2v2h-2z"/>',
		},
		"calendar-clock": {
			body: '<path fill="currentColor" d="M15 13h1.5v2.82L18 17.28l-.78 1.27l-2.22-1.5zM21 7v12c0 1.11-.89 2-2 2H5c-1.11 0-2-.89-2-2V7c0-1.11.89-2 2-2h1V3h2v2h8V3h2v2h1c1.11 0 2 .89 2 2m-2 2v-.01H5V19h14zM18 11c-2.76 0-5 2.24-5 5s2.24 5 5 5s5-2.24 5-5s-2.24-5-5-5"/>',
		},
		"refresh": {
			body: '<path fill="currentColor" d="M17.65 6.35A7.95 7.95 0 0 0 12 4a8 8 0 1 0 7.74 10h-2.08A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z"/>',
		},
		"account": {
			body: '<path fill="currentColor" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4"/>',
		},
	},
};

/**
 * 解析 "prefix:iconName" 格式的图标名
 * @param name 例如 "mdi:arrow-left"
 * @returns 找到则返回 icon 数据，否则返回 null
 */
export function getMdiIcon(name: string): { body: string } | null {
	const [prefix, iconName] = name.split(":");
	if (prefix !== mdiIcons.prefix) return null;
	return mdiIcons.icons[iconName] ?? null;
}
