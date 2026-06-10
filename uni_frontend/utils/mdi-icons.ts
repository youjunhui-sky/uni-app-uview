/**
 * 本地 MDI 图标数据
 * 用途：局域网环境下替代 Iconify CDN 加载图标
 * 数据来源：https://api.iconify.design/mdi.json
 * 当前已收录图标：arrow-left, arrow-right, chevron-right, dots-vertical, arrow-down, pencil, home, wrench
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
