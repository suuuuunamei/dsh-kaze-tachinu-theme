# dsh-kaze-tachinu-theme · 風立ちぬ Theme

中文 | [English](README.en.md)

<p align="center">
  <img src="assets/logo/logo.svg" alt="Kaze Tachinu (The Wind Rises)" width="460">
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/Snamei/dsh-kaze-tachinu-theme?style=flat-square" alt="License">
  &nbsp;
  <img src="https://img.shields.io/github/v/tag/Snamei/dsh-kaze-tachinu-theme?style=flat-square" alt="Version">
  &nbsp;
  <img src="https://img.shields.io/github/stars/Snamei/dsh-kaze-tachinu-theme?style=flat-square" alt="Stars">
</p>

<p align="center">
  <strong>宫崎骏《起风了》（風立ちぬ / The Wind Rises）主题，为 DeepSeek Harness (DSH) Web GUI 而作</strong><br>
  <em>天蓝玻璃拟态 · 晴空电影壁纸 · 自绘矢量徽标 · 输入卡重绘 · 主题化占位文案 · 会话统计胶囊 · 消息列底部渐隐 · 统一滚动条</em>
</p>

<div align="center">

[是什么](#是什么) · [主题细节](#主题细节) · [抗哈希漂移设计](#抗哈希漂移设计) · [快速开始](#快速开始) · [自定义](#自定义) · [常见问题](#常见问题) · [已知限制](#已知限制) · [许可证](#许可证与素材版权)

</div>

## 是什么

dsh-kaze-tachinu-theme 把 DSH Web GUI 变成宫崎骏《起风了》的模样：一张飞机飞越云海的晴空电影壁纸垫底，全部界面表面换成半透明毛玻璃，交互色统一为天蓝（`#1C96B5`），侧边栏品牌与首页 hero 标题替换为自绘矢量徽标（红翼飞机 + The Wind Rises 字标），输入卡重绘为云海蓝玻璃胶囊，占位文案换成「风起了，要努力活下去。」。

它是一个标准的 dsh 插件包：一条 `dsh plugin` 命令装进 profile，随 DSH 启动常驻，不修改任何 DSH 源码；卸载后页面完全还原。

| 维度 | 原生 dsh web | dsh-kaze-tachinu-theme |
| --- | --- | --- |
| 背景 | 纯色 / 纯色渐变 | 晴空电影壁纸 + 全局模糊遮罩 |
| 界面表面 | 不透明分层 | 半透明毛玻璃（backdrop-filter） |
| 品牌标识 | DSH 默认 | 自绘红翼飞机徽标（展开态 + 折叠态纸飞机） |
| 交互色 | DSH 默认 | 天蓝 `#1C96B5`（按钮/选中/高亮/描边/滚动条） |
| 输入卡 | 默认样式 | 云海蓝玻璃胶囊，占位文案主题化 |
| 会话统计栏 | 默认样式 | 居中轻玻璃胶囊 + 分隔符配色 |
| 消息列底部 | 直切 | 40px 渐变淡出蒙版（输入框零裁切） |
| 安装 | — | `dsh plugin --profile web add ...` 一条命令 |
| 还原 | — | 卸载即完全还原 |

<p align="center">
  <img src="docs/screenshots/home-hero.png" alt="主页：居中大尺寸徽标" width="760">
</p>

## 主题细节

### 天蓝玻璃拟态

主题通过官方 `theme.overrideTokens` API 叠加一层约 60 项的 design token 覆盖：背景层全部半透明化（露出壁纸）、边框换成低饱和天蓝描边、交互态（悬停/激活/选中）统一为天蓝系、状态色（错误/成功/警告）微调至与深色玻璃协调。亮色与暗色模式共用同一套视觉。完整 token 清单见 [docs/theme-tokens.md](docs/theme-tokens.md)。

### 壁纸与徽标

- 壁纸由插件宿主半区以 `/kaze-tachinu/current.jpg` 路由提供（包内 `assets/current.jpg`），叠加一层轻微的深色渐变保证文字可读性；
- 侧边栏展开态显示横向徽标（红翼飞机 + The Wind Rises 字标），折叠态显示纸飞机字母标记（两个 SVG 均为本仓库自绘原创矢量，由插件路由提供）；
- 首页（hero）标题替换为居中大尺寸徽标。

<p align="center">
  <img src="docs/screenshots/sidebar.png" alt="侧边栏：展开态的品牌标识" width="123">
  <img src="docs/screenshots/chat-main.png" alt="主界面：壁纸上的玻璃拟态会话视图" width="676">
</p>

### 输入卡与占位文案

输入卡重绘为云海蓝玻璃胶囊，占位文案按界面语言自动替换。当前 DSH 为**单一输入框**，只显示「输入框」一列；仅当宿主版本另提供独立的“描述/新会话”输入框（占位以 `描述你想要构建的内容` / `Describe what you want to build` 开头）时，「新会话」列的文案才会出现。替换基于**前缀匹配**：即使宿主在默认提示后追加「… / 调用指令 @ 文件或对话」这类说明也能命中。

| 界面语言 | 输入框（统一入口） | 新会话描述（仅独立描述框的版本） |
| --- | --- | --- |
| 中文 | `风起了，要努力活下去。` | `風立ちぬ——让想法随风飘去` |
| 英文 | `風立ちぬ。いざ生きめやも。` | `Kaze Tachinu — let your thoughts ride the wind` |

### 消息滚动下沉 + 底部渐隐蒙版

DSH 原生把输入框与消息列放在同一个可滚动容器里，直接给容器加蒙版会裁到输入框。本主题把**滚动视口下沉到纯消息列**：外层滚动容器退化为布局（固定输入框），消息列表成为有界滚动视口并承载 40px 底部渐隐；滚到最底时消息文本完整停在渐变区上方。

### 会话统计栏胶囊

输入卡上方（composer 区）的会话统计行（「20 轮 · 185 步 | LLM …」）重绘为居中轻玻璃胶囊：内容自动撑宽、暗色半透明底 + 毛玻璃，把文字从壁纸中托出，分隔符弱化为天蓝细点。

### 统一滚动条

全局滚动条统一为天蓝玻璃风格，适配主流 Chromium 内核浏览器（含 Firefox 的 `scrollbar-color` 兜底）。

## 抗哈希漂移设计

DSH 前端的组件类名是**构建期哈希**（形如 `.Md3f7G_*`、`._7mWUNa_*`、`.wSkVaW_*`），前端升级后必然漂移——历史上这类漂移曾导致「滚动下沉」直接失效、外层容器被禁滚而内层没人接棒，表现为**对话滚不动**。

本主题自 v2 起采用运行时定位 + 安全回退：

- **CSS 不再引用任何消息滚动/统计栏相关的哈希类名**；凡是可能影响可用性的布局都由 `hooks.mjs` / `bundle` 浏览器半区的运行时引擎处理：
  - 用稳定属性（`[data-conversation-scroll]`、`[data-slot="conversation.session"]`、`[data-chat-flow]`）与类名**后缀**（`…_scroll`，后缀来自组件作者命名，跨构建稳定）定位消息滚动器；
  - 定位成功后以**内联样式 + 自定义标记**落地：`data-kaze-scroll`（会话根）、`data-kaze-scroll-inner`（内层滚动器）、`data-kaze-stats` / `data-kaze-stats-sep`（统计栏胶囊及其分隔符）；
  - 统计栏通过文本特征在 `[data-composer-seat]` 内定位后打标记，样式选择器只挂在这些 `data-kaze-*` 属性上。
- **安全回退**：任何一步定位失败，运行时引擎直接不动手——原生滚动与默认外观完好（最坏只丢装饰，绝不冻结对话）；引擎内部还有 try/catch 兜底，异常只写 `console.warn`。

**标记探测**（打开任一会话的「对话」页签后在 Console 运行，预期 `1 / 1 / 1 / 2`）：

```js
console.log('kaze-scroll根=', document.querySelectorAll('[data-kaze-scroll]').length,
  '| 内层=', document.querySelectorAll('[data-kaze-scroll-inner]').length,
  '| 统计栏=', document.querySelectorAll('[data-kaze-stats]').length,
  '| conv-scroll=', document.querySelectorAll('[data-conversation-scroll]').length);
```

仍在依赖少量哈希类名的只剩**纯装饰**区域（首页 hero 徽标、侧边栏品牌、输入卡内的高亮/hint），漂移只会造成局部视觉降级，不会影响可用性（见「已知限制」）。

## 快速开始

> **浏览器建议**：主题大量使用 backdrop-filter 毛玻璃、滚动条定制与 CSS 蒙版，推荐使用 **Microsoft Edge** 或 **Google Chrome**；Firefox 下部分显示效果不兼容（滚动条、渐变蒙版等可能打折）。

### 系统要求

- 已安装 DeepSeek Harness，`dsh web` 可正常启动；
- 机器上有 pnpm（`dsh plugin` 内部使用；Node.js 自带的 corepack 可提供）。
- DSH Desktop 用户：dsh 的 profile 位于 `%APPDATA%/dsh-desktop/harness/profiles/`（命令行环境需先设置 `DSH_HOME` 指向对应 harness 目录）。

### 安装（发布版）

```sh
dsh plugin --profile web add dsh-kaze-tachinu-theme
dsh web   # 重启 DSH 生效
```

也可以直接从 GitHub 安装：

```sh
dsh plugin --profile web add github:Snamei/dsh-kaze-tachinu-theme
```

壁纸出现、侧边栏徽标替换生效，即安装成功。安装后随 DSH 启动常驻，无需每次重装。

### 安装（本地开发 / 未发布版本）

仓库本地包未发布到 npm 时，可先以本地目录安装（`file:` 为快照拷贝；想「改代码即生效」可改用 `link:`）：

```sh
dsh plugin --profile web add file:/绝对路径/dsh-kaze-tachinu-theme
# 或
dsh plugin --profile web add link:/绝对路径/dsh-kaze-tachinu-theme
```

> Windows 提示：跨盘 `file:E:/...` 会被 pnpm 解析异常。稳妥做法是在 profile 目录内建 junction 指向仓库，再用相对路径安装，例如在 `profiles/web` 下执行
> `mklink /J kaze-local E:\绝对路径\dsh-kaze-tachinu-theme`
> 然后 `dsh plugin --profile web add file:./kaze-local`。
> 每次改完仓库代码需重跑一次该 add 刷新快照。

### 更新

```sh
dsh plugin --profile web update dsh-kaze-tachinu-theme
dsh web   # 重启生效
```

### 暂时关闭（不卸载）

编辑 profile 的 `package.json`，删掉 `dsh.profile.bundles` 数组中的 `"dsh-kaze-tachinu-theme"` 一行，重启生效；加回该行再重启即恢复。长期不用请直接卸载。

### 卸载

```sh
dsh plugin --profile web remove dsh-kaze-tachinu-theme
dsh web   # 重启后页面完全还原
```

### 皮肤中心方式（可选）

若使用 dsh-web-ui 的皮肤中心（skin-center），可改以皮肤包形式安装：把仓库 `skin/kaze-tachinu/` 整个目录拷到 `~/.dsh/skins/kaze-tachinu/`（DSH Desktop 为 `%APPDATA%/dsh-desktop/harness/skins/kaze-tachinu/`），刷新页面即出现在「设置 → 皮肤中心」，支持试穿 / 一键切换 / 互斥管理。

> 说明：手工投放的皮肤因皮肤中心的溯源安全门不带 `hooks.mjs` 行为增强（运行时滚动下沉、占位文案、统计栏标记）——壁纸、配色、徽标、玻璃样式等视觉完整；经 dsh-market 安装则功能全量。皮肤与插件两条通道共享同一份 v2 抗漂移引擎代码。与插件安装方式二选一。

## 自定义

需本地克隆并改用 `link:` 安装（见上文“本地开发”）。

### 换壁纸

替换克隆目录中的 `assets/current.jpg`（保持文件名不变），浏览器强刷（Ctrl+F5）即可。

### 换徽标

替换 `assets/logo/` 下的两个 SVG，强刷生效。

### 换占位文案

文案映射集中在运行时引擎的占位规则表中（`bundle/client.js`、`plugin/client.js`、`skin/kaze-tachinu/hooks.mjs` 三处同源），按需修改后重启生效。

### 调色

颜色集中在 token 覆盖表（`bundle/client.js` 与 `skin/kaze-tachinu/skin.css`）与组件装饰样式中，改完重启并强刷。速查表见 [docs/theme-tokens.md](docs/theme-tokens.md)。

## 架构

主题是一个标准的 dsh 插件包（bundle）：`package.json` 声明 `dsh.bundle` 与 `dsh.client`，`dsh plugin add` 装进 profile 并挂上插件行——不修改 DSH 源码。

```
bundle/host.js       # 插件宿主半区（Node）：壁纸/徽标资产路由 /kaze-tachinu/*（路径相对包内解析，装哪都能用）
bundle/client.js     # 插件浏览器半区（./client 导出）：token 覆盖 + 装饰样式 + 运行时滚动/统计栏引擎 + 占位文案
plugin/client.js     # Cordis 动态注入同源源码（与 bundle 逻辑一致，一般无需关心）
cordis.patch.yml     # 插件行清单：dsh plugin add 挂载的入口
assets/              # 壁纸与徽标（Logo 为自绘矢量）
skin/kaze-tachinu/   # 皮肤中心（skin-center）皮肤包：skin.json + skin.css + patches.css + hooks.mjs（hooks 与插件同源）
```

所有副作用（token 层、样式标签、事件监听、DOM 属性、路由、运行时标记）都注册在插件生命周期上，禁用/卸载即完全还原。

## 常见问题

<details>
<summary><strong>装完重启了，页面没变化？</strong></summary>

A: 确认命令里带 `--profile web`（装进了正确的 profile）；浏览器 Ctrl+F5 强刷一次；仍不行时看 `dsh web` 启动日志有没有 `[kaze-tachinu-theme] host half active` 与安装时的警告信息。

</details>

<details>
<summary><strong>背景图 / 徽标 404？</strong></summary>

A: 静态安装的资产路径相对包内解析，正常不会发生。多为 profile 的 node_modules 被手动清理或链接损坏所致：重新执行一次安装命令即可修复。

</details>

<details>
<summary><strong>占位文案没有变成主题台词？</strong></summary>

A: 占位替换作用于宿主输入组件的 placeholder 属性（前缀匹配可命中带后缀的默认文案）。个别桌面发行版若以自绘视觉层渲染占位文本而非真实 placeholder 属性，则该替换不适用；标准 DSH Web 客户端下生效。

</details>

<details>
<summary><strong>对话滚不动了？</strong></summary>

A: 先跑「抗哈希漂移设计」一节的标记探测：若 `kaze-scroll根 / 内层 / 统计栏` 全为 0 而 `conv-scroll=2`，说明页面加载的仍是旧版 client（`styleEl` 时代或更早），或运行时引擎未生效——确认已安装的是本仓库当前版本并彻底重启；若三标记为 1/1/1 仍滚不动，把 Console 的 `[kaze] …` 警告发到 issue。

</details>

<details>
<summary><strong>DSH 升级后样式错乱 / 部分没生效？</strong></summary>

A: 自 v2 起，消息滚动、底部渐隐与统计栏胶囊**不再依赖哈希类名**（运行时定位 + 安全回退，升级后最坏仅装饰缺失、不会滚不动）。仍依赖哈希类名的仅剩纯装饰区（首页 hero 徽标、侧边栏品牌、输入卡高亮/hint）——升级后这些可能需对照新版类名小修，token 层与稳定 data 属性样式不受影响。欢迎提 issue 附截图。

</details>

<details>
<summary><strong>安装后 DSH 进入「启动修复」页？</strong></summary>

A: 通常是插件浏览器半区在 apply 阶段抛错（历史上有过 `styleEl is not defined` 类问题）。处理：在修复页先「退出 DSH Desktop」，卸载该插件恢复正常模式，然后安装仓库**当前最新版**并彻底重启；本地 `file:` 安装请先同步仓库代码再重装。仍复现就把 `harness.log` 末尾发到 issue。

</details>

<details>
<summary><strong>亮色模式下文字看不清？</strong></summary>

A: 主题按「壁纸上的深色玻璃」设计，亮/暗模式共用同一套视觉。若在亮色模式下觉得整体偏暗，属预期行为；可自行调亮 token 中的玻璃底色（见「自定义 - 调色」）。

</details>

<details>
<summary><strong>和其他皮肤/主题插件能共存吗？</strong></summary>

A: token 层是叠加式的，但视觉上会互相覆盖。建议同一时间只启用一个主题类插件。

</details>

## 已知限制

- 主题的毛玻璃、滚动条与渐变蒙版按 Chromium 内核（Edge / Chrome）打磨，Firefox 下部分显示效果不兼容，推荐使用 Edge 或 Chrome。
- 首页 hero 徽标、侧边栏品牌、输入卡高亮/hint 等**纯装饰**选择器仍依赖 DSH 构建期哈希类名，DSH 大版本升级后可能需跟随小修；消息滚动/统计栏等可用性相关部分已哈希无关（见「抗哈希漂移设计」）。
- 主题强制深色玻璃视觉，亮色模式不做单独适配（见常见问题）。
- 壁纸与徽标路由缓存 1 小时，替换素材后需强刷浏览器。
- 个别 DSH Desktop 发行版不执行插件浏览器半区（只加载宿主半区），此类环境下品牌替换、占位文案与运行时滚动下沉等 DOM 级效果受限——与 dsh-kimino-theme 在同类发行版的限制一致；标准 DSH Web 客户端可完整生效。

## 许可证与素材版权

代码以 [MIT](LICENSE) 授权。

`assets/` 中的壁纸素材源自电影《起风了》（風立ちぬ, Kaze Tachinu, 2013）的宣传物料，版权归 Studio Ghibli、Nibariki、KDDI、Toho 等原权利方所有。`assets/logo/` 下的徽标为本仓库自绘原创矢量作品。本仓库仅作个人桌面美化之用，不主张任何素材版权，也不从中获利；如权利方提出异议，将立即移除相关素材。

## 参与贡献

- 提交信息遵循 Conventional Commits（如 `feat(client): fix xxx`），代码、文档与提交信息不使用 emoji；
- 用户可见的变更请在 PR 中附截图或验证证据；
- 改动主题 token 时同步更新 [docs/theme-tokens.md](docs/theme-tokens.md)。

<div align="center">

**喜欢这个主题？点个 Star。**

[报告问题](https://github.com/Snamei/dsh-kaze-tachinu-theme/issues) · [功能建议](https://github.com/Snamei/dsh-kaze-tachinu-theme/issues)

</div>
