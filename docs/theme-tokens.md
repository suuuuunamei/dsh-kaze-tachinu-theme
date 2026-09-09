# 主题 Token 参考（風立ちぬ / The Wind Rises）

`plugin/client.js` 通过 `theme.overrideTokens('kaze-tachinu-bg', {...})` 在当前主题上叠加一层部分 token 覆盖。所有值同时应用于亮色与暗色（`pair(v) = { light: v, dark: v }`）——壁纸底色的玻璃拟态在两种模式下保持同一套「晴空 × 云海」视觉。

完整清单以 `plugin/client.js`（静态安装用 `bundle/client.js`）中的 `overrideTokens` 调用为准，本文按用途分组摘录关键项。

## 调色板骨架

| Token | 值 | 用途 |
| --- | --- | --- |
| `--dsw-alias-brand-primary` | `#7FB5E3` | 品牌主色（天蓝） |
| `--dsw-alias-label-primary` | `#F8FAFC` | 主文字 |
| `--dsw-alias-label-secondary` | `#CBD5E1` | 次级文字 |
| `--dsw-alias-label-tertiary` | `#7FB5E3` | 三级文字（天蓝） |
| `--dsw-alias-label-caption` | `#94A3B8` | 说明文字 |
| `--dsw-alias-label-primary-dimmed` | `#9FC4E8` | 弱化主文字（银蓝） |

## 表面与玻璃层

| Token | 值 | 用途 |
| --- | --- | --- |
| `--dsw-alias-bg-base` | `rgba(5,8,20,0)` | 基底透明，露出壁纸 |
| `--dsw-alias-bg-layer-1/2/3` | `rgba(15,23,42,0.75/0.8/0.85)` | 三级毛玻璃表面 |
| `--dsw-alias-bg-overlay` | `rgba(10,14,26,0.9)` | 遮罩层 |
| `--dsw-specific-sidebar-fill` | `rgba(15,23,42,0.42)` | 侧边栏（更透，透出壁纸） |
| `--dsw-specific-bubble` | `rgba(15,23,42,0.75)` | 消息气泡 |
| `--dsw-specific-menu` | `rgba(23,59,108,0.94)` | 菜单/弹层（云海蓝） |
| `--dsw-alias-border-l1/l2/l3` | `rgba(127,181,227,0.14/0.22/0.28)` | 三级边框（天蓝描边） |

## 交互态

| Token | 值 | 用途 |
| --- | --- | --- |
| `--dsw-alias-interactive-bg-hover` | `rgba(255,255,255,0.08)` | 悬停 |
| `--dsw-alias-interactive-bg-active` | `rgba(127,181,227,0.16)` | 激活（天蓝） |
| `--dsw-alias-button-info-fill / hover` | `#7FB5E3` / `#6AA2D6` | 主要按钮 |
| `--dsw-alias-button-ghost-active-border` | `rgba(127,181,227,0.5)` | 幽灵按钮激活描边 |

## 状态色

| Token | 值 |
| --- | --- |
| `--dsw-alias-state-error-primary` | `#F87171` |
| `--dsw-alias-state-success-primary` | `#7FE0C8` |
| `--dsw-alias-state-warn-primary` | `#FBBF24` |
| `--dsw-alias-state-business-primary` | `#7FB5E3` |

## 代码与滚动条

| Token | 值 | 用途 |
| --- | --- | --- |
| `--dsw-alias-markdown-code-block` | `rgba(13,17,23,0.55)` | 代码块底 |
| `--dsw-alias-markdown-inline-code` | `rgba(127,181,227,0.12)` | 行内代码底 |
| `--dsw-alias-scrollbar-bg-l2` | `rgba(127,181,227,0.32)` | 滚动条拇指 |
| `--dsw-alias-scrollbar-hover-l2` | `rgba(127,181,227,0.55)` | 滚动条悬停 |
| `--dsw-shadow-lv2` | `0 8px 24px rgba(0,0,0,0.28)` | 二级阴影 |

## 颜色体系速查

- 天蓝（主交互色）：`#7FB5E3` / `rgba(127,181,227,*)`
- 银蓝（弱化文字/统计栏）：`#9FC4E8` / `rgba(159,196,232,*)`
- 云海蓝（输入卡/菜单/弹层）：`rgba(23,59,108,*)`
- 深空底（玻璃表面）：`rgba(15,23,42,*)`（slate-900）
