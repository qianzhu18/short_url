# 解决 short.qianzhu.me 页面 “无效域” 错误（Turnstile）

## 快速判断问题类型

### 情况 A：页面能打开，但验证码区域提示“无效域”
这是 **Cloudflare Turnstile 域名未授权** 导致的，不是 Worker 路由或 DNS 问题。

### 情况 B：页面打不开或出现 Cloudflare 1016 等错误
这是 **DNS / Worker 路由** 未正确绑定导致的。

> 你现在的截图属于 **情况 A**。

## 修复 Turnstile “无效域”

### 步骤 1：创建或更新 Turnstile Widget
1. 登录 Cloudflare 控制台：https://dash.cloudflare.com/
2. 进入 **Turnstile**（或 **Security → Turnstile**）
3. 创建新 Widget，或编辑现有 Widget
4. **添加授权域名**：
   - `short.qianzhu.me`
   - （可选）`atomic-url.jeaninegallardi.workers.dev`
5. 保存并复制 **Site Key** 和 **Secret Key**

### 步骤 2：配置 Worker 变量
把这两个值配置进 Worker：

- `TURNSTILE_SITE_KEY` → Site Key（非敏感，可放变量）
- `TURNSTILE_SECRET` → Secret Key（敏感，建议用 secret）

示例（设置 Secret）：
```bash
npx wrangler secret put TURNSTILE_SECRET
```

Site Key 可以放在：
- Cloudflare Dashboard → Workers → Settings → Variables
- 或 `wrangler.toml` 的 `vars`（不推荐提交到公共仓库）

### 步骤 3：重新部署
```bash
npx wrangler deploy --env production
```

### 验证
- 访问：https://short.qianzhu.me
- Turnstile 正常显示，不再提示“无效域”
- 可以成功生成短链接

## 如果仍无法访问页面
请再检查 DNS 和 Worker 路由绑定是否正确，避免误判为 Turnstile 问题。
