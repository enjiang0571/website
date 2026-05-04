# BeeFintech Vercel + Supabase 部署说明

## 1. 初始化 Supabase 数据表

打开 Supabase 项目，进入 `SQL Editor`，复制并执行：

```text
docs/supabase-schema.sql
```

执行后会创建并初始化：

- `faqs`
- `news`
- `bookings`

## 2. 配置 Vercel 环境变量

Vercel 导入 GitHub 仓库后，进入：

```text
Project Settings -> Environment Variables
```

添加：

```text
SUPABASE_URL=你的 Project URL
SUPABASE_SERVICE_ROLE_KEY=你的 service_role key
ADMIN_PASSWORD=后台登录密码
ADMIN_SESSION_SECRET=任意长随机字符串
```

不要把这些值提交到 GitHub。

## 3. Vercel 项目设置

导入仓库时选择默认设置即可：

```text
Framework Preset: Other
Build Command: 留空
Output Directory: 留空
Install Command: 留空或默认
```

部署完成后访问：

```text
https://你的项目名.vercel.app/
https://你的项目名.vercel.app/admin-login.html
```

## 4. 本地说明

当前项目保留了 `server.js`，它是本地 SQLite 演示备用服务。本地启动命令为：

```bash
npm run local
```

Vercel 部署时使用的是：

```text
api/
lib/
```

也就是 Vercel Functions + Supabase，不使用本地 SQLite 数据库。
