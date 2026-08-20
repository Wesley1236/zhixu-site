# 知序 · Personal Growth OS

知序是一套以个人长期成长为核心的私域知识操作系统。它把知识收集、分类整理、目标行动、复盘证据与本地知识问答连接在一个 Apple 风格的透明玻璃界面中。

## 本地运行

```bash
cd prototype
npm install
npm run dev
```

## 构建

```bash
cd prototype
npm run build
```

生产文件输出到 `prototype/dist/client`。仓库内的 GitHub Actions 工作流可将该目录部署到 GitHub Pages。

## 数据与隐私

- 知识条目、目标、行动和复盘数据保存在浏览器 `localStorage` 中。
- TXT、Markdown、JSON、CSV 文件可读取正文并参与本地检索问答。
- PDF、Office、图片等二进制文件当前仅建立元数据索引，不会伪装成已完成全文解析。
- 项目不依赖 OpenAI 网站、GPT 网站或服务器密钥。

## 产品定位

系统围绕职业能力、AI 工具、英语沟通、知识输出、健康生活五个成长域组织内容。IBC 仅作为普通工作知识标签存在，不是产品核心目标。
