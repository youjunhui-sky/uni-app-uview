#!/bin/bash

# 部署脚本 - 处理缓存问题
# 使用方法: ./deploy.sh

echo "🚀 开始部署..."

# 1. 构建项目
echo "📦 构建项目..."
npm run build:h5

# 2. 检查构建结果
if [ ! -d "unpackage/dist/h5" ]; then
    echo "❌ 构建失败，未找到输出目录"
    exit 1
fi

echo "✅ 构建完成"

# 3. 生成版本号（基于时间戳）
VERSION=$(date +%Y%m%d%H%M%S)
echo "📝 版本号: $VERSION"

# 4. 创建版本文件
echo $VERSION > unpackage/dist/h5/version.txt

# 5. 备份当前版本（可选）
if [ -d "/var/www/html/backup" ]; then
    echo "💾 备份当前版本..."
    cp -r /var/www/html/* /var/www/html/backup/backup_$VERSION/
fi

# 6. 部署到 nginx 目录
echo "📤 部署到服务器..."
sudo cp -r unpackage/dist/h5/* /var/www/html/

# 7. 设置权限
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/

# 8. 重载 nginx 配置
echo "🔄 重载 nginx..."
sudo nginx -t && sudo nginx -s reload

# 9. 清理浏览器缓存（可选）
echo "🧹 清理 CDN 缓存..."
# 如果使用 CDN，在这里添加清理缓存的命令
# curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/purge_cache" \
#      -H "Authorization: Bearer YOUR_API_TOKEN" \
#      -H "Content-Type: application/json" \
#      --data '{"purge_everything":true}'

echo "✅ 部署完成！"
echo "🌐 访问地址: http://your-domain.com"
echo "📅 部署时间: $(date)"
echo "🔢 版本号: $VERSION"
