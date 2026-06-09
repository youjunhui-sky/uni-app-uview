# 部署说明

## 缓存处理方案

本项目采用以下策略处理 nginx 缓存问题：

### 1. 文件哈希策略

- **JS/CSS 文件**：带哈希值，长期缓存（1年）
- **图片/字体**：带哈希值，长期缓存（1年）
- **HTML 文件**：不缓存，每次请求最新版本

### 2. 构建配置

```bash
# 构建 H5 版本
npm run build:h5

# 构建微信小程序版本
npm run build:mp-weixin

# 一键部署（包含缓存处理）
npm run deploy
```

### 3. nginx 配置要点

#### 静态资源缓存

```nginx
# 带哈希的文件长期缓存
location ~* \.[a-f0-9]{8,}\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

#### HTML 文件不缓存

```nginx
# HTML 文件不缓存
location ~* \.html$ {
    expires -1;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

### 4. 部署流程

1. **构建项目**

    ```bash
    npm run build:h5
    ```

2. **部署到服务器**

    ```bash
    # 复制文件到 nginx 目录
    cp -r unpackage/dist/h5/* /var/www/html/

    # 重载 nginx
    nginx -s reload
    ```

3. **验证部署**
    - 检查文件是否包含哈希值
    - 验证 HTML 文件不被缓存
    - 测试静态资源缓存策略

### 5. 版本更新机制

#### 自动版本检查

- 页面加载时检查 `/version.txt`
- 发现新版本时提示用户刷新
- 定期检查（每5分钟）

#### 手动清理缓存

```javascript
// 在浏览器控制台执行
clearAllCache();
```

### 6. 常见问题

#### Q: 用户仍然看到旧版本？

A: 检查以下几点：

1. nginx 配置是否正确
2. HTML 文件是否被缓存
3. 浏览器是否强制刷新（Ctrl+F5）

#### Q: 静态资源加载失败？

A: 检查：

1. 文件路径是否正确
2. nginx 是否正确配置静态资源
3. 文件权限是否正确

#### Q: 版本检查不生效？

A: 确保：

1. `/version.txt` 文件存在
2. 服务器正确返回版本信息
3. 网络请求没有被拦截

### 7. 监控和调试

#### 检查缓存状态

```bash
# 检查文件是否被缓存
curl -I http://your-domain.com/static/js/app.abc123.js

# 应该返回：
# Cache-Control: public, immutable
# Expires: ...
```

#### 检查版本文件

```bash
# 检查版本文件
curl http://your-domain.com/version.txt
```

### 8. 最佳实践

1. **开发环境**：禁用缓存，便于调试
2. **生产环境**：启用缓存，提升性能
3. **版本发布**：使用版本号或时间戳
4. **回滚机制**：保留历史版本备份
5. **监控告警**：监控部署状态和用户反馈

## 快速部署命令

```bash
# 一键部署
./deploy.sh

# 或者使用 npm 脚本
npm run deploy
```

## 注意事项

- 确保 nginx 配置正确
- 定期清理旧版本文件
- 监控用户反馈
- 保持版本文件更新
