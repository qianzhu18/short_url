# Atomic URL 部署指南

## 部署状态：✅ 成功

你的 Atomic URL 链接缩短服务已成功部署到 Cloudflare Workers！

## 🎉 部署信息

- **Worker URL**: https://atomic-url.jeaninegallardi.workers.dev
- **Cloudflare Account ID**: 1e1b04d71f7d0f223bc1f2af2a56bac9
- **KV Namespace**: URL_DB (ID: ffe1778b6dcb4067b65d6f56ca092246)
- **部署时间**: 2026-01-29

## 🚀 如何使用

### 方法一：通过网页界面（推荐）

1. 打开浏览器访问：https://atomic-url.jeaninegallardi.workers.dev
2. 在输入框中粘贴你的长链接，例如：
   ```
   https://qianzhu.me/article/2bbe45c4-da1e-80e0-a82e-e725a80b5926
   ```
3. 点击 "Shorten" 按钮
4. 系统会生成一个简短的链接，例如：
   ```
   https://atomic-url.jeaninegallardi.workers.dev/Xy9K2
   ```
5. 点击 "Copy" 按钮复制短链接
6. 现在你可以在任何地方分享这个短链接了！

### 方法二：通过 API

如果你想通过编程方式创建短链接，可以使用 API：

```bash
curl -X POST https://atomic-url.jeaninegallardi.workers.dev/api/url \
  -H "Content-Type: application/json" \
  -d '{"originalUrl":"https://qianzhu.me/article/2bbe45c4-da1e-80e0-a82e-e725a80b5926","turnstileToken":"<token>"}'
```

> 如果启用了 Turnstile，必须携带有效的 `turnstileToken`。建议通过网页表单获取，或在测试环境配置 `TEST_URL` 跳过验证。

响应示例：
```json
{
  "urlKey": "Xy9K2",
  "shortUrl": "https://atomic-url.jeaninegallardi.workers.dev/Xy9K2",
  "originalUrl": "https://qianzhu.me/article/2bbe45c4-da1e-80e0-a82e-e725a80b5926"
}
```

## 📋 原始链接 vs 短链接对比

### 之前：
```
https://qianzhu.me/article/2bbe45c4-da1e-80e0-a82e-e725a80b5926
```
- 长度：67 个字符
- 包含复杂的 UUID
- 不够美观

### 现在：
```
https://atomic-url.jeaninegallardi.workers.dev/Xy9K2
```
- 长度：52 个字符（更短！）
- 简洁易记
- 专业外观

## 🔧 配置自定义域名（可选）

如果你想把服务部署到自己的域名（例如 s.qianzhu.me），需要以下步骤：

1. 在 Cloudflare DNS 中添加 CNAME 记录：
   ```
   s.qianzhu.me → atomic-url.jeaninegallardi.workers.dev
   ```

2. 更新 `wrangler.toml` 中的路由配置：
   ```toml
   [env.production]
   route = "s.qianzhu.me/*"
   ```

3. 重新部署：
   ```bash
   npx wrangler deploy --env production
   ```

## 📊 管理和监控

### 查看 Worker 日志
```bash
npx wrangler tail atomic-url
```

### 查看 KV 存储数据
```bash
npx wrangler kv:key list --namespace-id=ffe1778b6dcb4067b65d6f56ca092246
```

### 获取特定短链接的目标
```bash
npx wrangler kv:key get "Xy9K2" --namespace-id=ffe1778b6dcb4067b65d6f56ca092246
```

## 🔐 安全配置

### Turnstile 验证（需要配置）
项目启用了 Cloudflare Turnstile 来防止滥用，需要你配置以下变量：
- `TURNSTILE_SITE_KEY`（Site Key）
- `TURNSTILE_SECRET`（Secret Key）

并确保 Turnstile Widget 的授权域名包含 `short.qianzhu.me`，否则会提示“无效域”。

### URL 过滤
可以在代码中添加域名白名单或黑名单来控制可以缩短哪些链接。

## 🎯 功能特性

✅ **图形化界面** - 无需命令行，网页操作简单直观
✅ **链接缩短** - 将长链接转换为短链接
✅ **自动重定向** - 访问短链接自动跳转到原始链接
✅ **缓存加速** - 使用 Cloudflare Cache 提升访问速度
✅ **防滥用** - 内置 Turnstile 验证
✅ **全球 CDN** - 基于 Cloudflare Workers，全球低延迟访问
✅ **免费使用** - Cloudflare Workers 免费套餐足够个人使用

## 📝 技术栈

- **Cloudflare Workers** - 无服务器计算平台
- **Cloudflare KV** - 分布式键值存储
- **Cloudflare Cache** - HTTP 缓存
- **Cloudflare Turnstile** - 机器人防护

## 🔍 测试脚本

项目包含一个测试脚本来验证部署：
```bash
./test-deployment.sh
```

## 📚 相关资源

- [Cloudflare Workers 文档](https://workers.cloudflare.com/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [项目源代码](https://github.com/ngshiheng/atomic-url)

## 💡 使用建议

1. **博客分享**: 将你的博客文章链接缩短后分享到社交媒体
2. **营销活动**: 创建易于记忆的短链接用于营销推广
3. **隐藏参数**: 缩短包含追踪参数的长链接
4. **QR 码**: 短链接生成的 QR 码更简洁

## 🛠️ 故障排除

### 如果网页无法访问
1. 检查 Cloudflare 账户状态
2. 验证 Worker 是否正确部署：`npx wrangler deployments list`
3. 查看实时日志：`npx wrangler tail atomic-url`

### 如果创建短链接失败
1. 检查 KV 命名空间是否正确绑定
2. 查看浏览器控制台是否有错误
3. 验证 Turnstile 验证是否通过

## 📞 支持

如果遇到问题，可以：
1. 查看 [Cloudflare Workers 社区](https://community.cloudflare.com/c/workers/workers)
2. 阅读 [项目 GitHub Issues](https://github.com/ngshiheng/atomic-url/issues)

---

**恭喜！你的链接缩短服务已经可以使用了！** 🎉

现在你可以：
1. 访问 https://atomic-url.jeaninegallardi.workers.dev
2. 粘贴你的博客链接
3. 获得一个简洁的短链接
4. 分享到任何地方！

享受更美观的链接分享体验吧！ ✨
