/**
 * 缓存清理工具
 * 用于在开发时清理浏览器缓存
 */

// 清理 localStorage
function clearLocalStorage() {
	try {
		localStorage.clear();
		console.log("✅ localStorage 已清理");
	} catch (e) {
		console.error("❌ 清理 localStorage 失败:", e);
	}
}

// 清理 sessionStorage
function clearSessionStorage() {
	try {
		sessionStorage.clear();
		console.log("✅ sessionStorage 已清理");
	} catch (e) {
		console.error("❌ 清理 sessionStorage 失败:", e);
	}
}

// 清理 IndexedDB
function clearIndexedDB() {
	return new Promise((resolve) => {
		if ("indexedDB" in window) {
			const deleteReq = indexedDB.deleteDatabase("uni-app");
			deleteReq.onsuccess = () => {
				console.log("✅ IndexedDB 已清理");
				resolve();
			};
			deleteReq.onerror = () => {
				console.error("❌ 清理 IndexedDB 失败");
				resolve();
			};
		} else {
			resolve();
		}
	});
}

// 强制刷新页面
function forceRefresh() {
	// 添加时间戳参数强制刷新
	const url = new URL(window.location);
	url.searchParams.set("_t", Date.now().toString());
	window.location.href = url.toString();
}

// 清理所有缓存
async function clearAllCache() {
	console.log("🧹 开始清理缓存...");

	clearLocalStorage();
	clearSessionStorage();
	await clearIndexedDB();

	// 等待一下再刷新
	setTimeout(() => {
		console.log("🔄 强制刷新页面...");
		forceRefresh();
	}, 500);
}

// 在控制台暴露清理函数
if (typeof window !== "undefined") {
	window.clearAllCache = clearAllCache;
	console.log("💡 在控制台输入 clearAllCache() 可清理所有缓存");
}

export { clearAllCache, clearLocalStorage, clearSessionStorage, clearIndexedDB };
