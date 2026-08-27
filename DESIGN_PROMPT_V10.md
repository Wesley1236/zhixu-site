# V10 · 一体式 K 与每日表达训练

## 优化后的执行提示词

保持明亮湖景、浅色透明玻璃和圆润字体。重新设计干净通透的立体 K 标识：K 物理嵌入玻璃主体，只有一个图像层，统一缓慢转动和悬停，避免文字与主体分离、悬停重启动画或模块居中偏移。保留已有首页布局与知识库功能。

新增可从首页和导航进入的「表达训练」。中文与英文分别制定 28 天递进计划，每天给出具体话题、第一轮时长、组织结构、开场示例及 10 分钟练习流程。分别设置训练阶段，生成带当天任务的 ChatGPT 语音教练提示词，要求一次一问、完整听完、最多三项关键纠错、重新表达和复盘。不得在没有音频时虚构发音评价。

网站继续使用 GitHub Pages。真实语音在用户主动打开的 ChatGPT 客户端中进行；本站不录音、不传密钥、不自动发送提示词或同步对话。语音入口与额度取决于用户账号，提供官方说明。回填真实原话、纠错和重练收获后才允许完成；中英文记录独立本地保存，可回顾、修改、导出 Markdown。处理存储失败，支持键盘、窄屏和减少动态效果偏好。

## 图像资产

- 文件：`prototype/public/k-core-unified-v10.png`
- 内建 ImageGen 生成；透明背景，K 已嵌入图像，无 HTML 字母覆盖。
- 生成提示词：

> Use case: stylized-concept. Asset type: single transparent 3D UI knowledge-core emblem, one self-contained object for a bright lakeside glass dashboard. Primary request: an exquisitely minimal sculptural glass medallion with a capital letter "K" physically embedded inside it, K and glass are ONE unified object, not a separate overlay. A softly rounded hexagonal lens with thick polished beveled edges, subtle 3D depth, restrained icy blue translucency and very faint lavender edge refraction. The K is a crisp cobalt-blue three-dimensional inlay inside the lens, perfectly centered and very readable. Premium calm industrial design, daylight, soft specular highlights. Nearly front-facing, slight three-quarter depth. One object centered on a genuinely transparent alpha background, square composition with 15 percent transparent padding. Avoid chaotic diamond facets, sparkles, satellite beads, orbit rings, rainbow effects, purple neon, extra lettering, captions, scenery, floor, cast background shadows, watermarks. Only exact text: "K". High quality raster asset with clean alpha edges, suitable for a gentle whole-object 3D turning animation.

## 技术与交互边界

- 18 秒浅角度往返转动整个标识，保证 K 正面可读；外层悬停缩放不改变内部动画相位。不是实时 WebGL 三维模型。
- 每个语言计划从首次进入模块的本地日期起计算，最多第 28 天；可以选择任意一天提前练习或复习，完成不会覆盖历史。
- 倒计时只是练习辅助，不是录音或开口时长统计；切换天数/语言会重置计时。
- 语音流程依照 [ChatGPT Voice](https://learn.chatgpt.com/docs/features/voice)；若要站内实时语音，需要另行配置后端与 [Realtime WebRTC](https://developers.openai.com/api/docs/guides/realtime-webrtc) 短期凭证。
