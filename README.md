# 赵盟熙 · 个人简历网站

面向求职场景的单页简历/作品集网站，高级简约风格，支持本地预览与 Vercel 一键部署。

## 本地预览

- 直接双击根目录下的 **`index.html`** 在浏览器中打开即可完整预览，无需安装任何依赖或启动服务器。
- 若需本地服务器（可选）：`npx serve .` 或 `python -m http.server 8000`。

## PDF 简历

- 将你的 PDF 简历文件命名为 **`resume.pdf`** 并放在本目录下，与 `index.html` 同级。
- 导航栏「下载PDF简历」按钮会提供「下载PDF」与「在线预览」两个选项。

## 推送到 GitHub

首次推送与部署步骤见 **`GitHub部署说明.md`**。简要命令（在项目根目录执行）：

```bash
git init
git add .
git commit -m "初始提交：个人简历网站"
git branch -M main
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
```

## 部署到 Vercel

1. 将本项目推送到 GitHub 仓库（见上）。
2. 登录 [Vercel](https://vercel.com)，选择 **Import Project**，导入该仓库。
3. 无需修改配置，直接 **Deploy** 即可。根目录已包含 `vercel.json`，部署后所有页面与资源可正常访问。

## 部署到腾讯云

使用 **腾讯云对象存储 COS** 的静态网站托管即可部署。完整步骤见 **`腾讯云部署说明.md`**。简要流程：

1. 在腾讯云 COS 控制台创建存储桶（公有读私有写），并开启「静态网站」；索引文档与错误文档均设为 `index.html`，错误文档响应码为 `200`。
2. 上传方式二选一：**控制台手动上传**（拖拽 `index.html`、`styles.css`、`script.js`、`images` 文件夹、`resume.pdf` 到存储桶根目录），或使用 **COSCMD** 配置后运行 `deploy-to-tencent.bat`（Windows）/ `deploy-to-tencent.sh`（Mac/Linux）一键上传。
3. 在存储桶「静态网站」中查看访问地址；建议绑定自定义域名以便国内访问更稳定。

## 图片怎么放

所有图片都放在 **`images`** 文件夹里。**若首屏头像不显示**，请确认 `images/avatar.png` 存在（把个人照片命名为 `avatar.png` 放进 `images` 文件夹）。不放图时首屏会显示默认渐变圆形。

| 文件名 | 用途 | 建议尺寸 |
|--------|------|----------|
| `avatar.jpg` 或 `avatar.png` | 首屏个人头像 | 正方形，至少 400×400 |
| `project1.jpg` | 项目一封面（五酿营销策划） | 宽≥600px，比例 16:10 或 4:3 |
| `project2.jpg` | 项目二封面（抖店运营） | 同上 |
| `project3.jpg` | 项目三封面（跨境电商） | 同上 |
| `og-image.jpg` | 分享到微信/微博时的预览图 | 1200×630 |

详细说明见 **`images/图片说明.txt`**。  
部署到 Vercel 后，若要用分享预览图，请把 `index.html` 里 `og:image` 和 `twitter:image` 的 `content` 改成你的完整网址，例如：`https://你的域名.vercel.app/images/og-image.jpg`。

## 文件说明

- `index.html`：单页结构，含全部 10 个模块与 SEO / 结构化数据。
- `styles.css`：全局样式、双主题、响应式与动效。
- `script.js`：导航、锚点、主题、项目筛选/模态框、技能进度条、表单校验与 mailto 提交。
- `vercel.json`：Vercel 部署配置。
- `resume.pdf`：需自行添加，用于「下载PDF简历」功能。
- `images/`：存放头像、项目封面、分享预览图，见上方「图片怎么放」。

## 技术栈

HTML5 + 原生 CSS3 + 原生 JavaScript（ES6+），使用 Google Fonts（Inter）、Font Awesome 图标 CDN，无前端框架与构建步骤。

## 版权

© 2024 赵盟熙. All Rights Reserved.
