# 发布与调试指南（Publishing & local iteration）

本文件是给维护者的操作清单。核心交付物（bundle 插件 + 皮肤包）已就绪并在 DSH Desktop 上实测通过。

## 本地迭代（改完立即验证）

本机 DSH Desktop 的 web profile 位于：

```
C:\Users\24979\AppData\Roaming\dsh-desktop\harness\profiles\web
```

改仓库代码后，把 `bundle/`、`plugin/`、`assets/`、`cordis.patch.yml`、`package.json` 重新复制到：

```
...\profiles\web\node_modules\dsh-kaze-tachinu-theme\
```

再完全退出并重开 DSH Desktop 生效（皮肤中心皮肤目录在 `harness\skins\`，仅对支持 skin-center 的 DSH Web 版本生效）。

### 在 kaze / kimino 主题间手动切换

编辑 `profiles\web\package.json` 的 `dsh.profile.bundles` 数组：把 `dsh-kaze-tachinu-theme` 与 `dsh-kimino-theme` 换成想要激活的名字，重启生效。两个包都保持在 `dependencies` 中，随时可切。

## 发布到 GitHub

1. 在 GitHub 创建空仓库 `Snamei/dsh-kaze-tachinu-theme`（默认分支 main）；
2. 关联并推送：

```sh
git remote add origin https://github.com/Snamei/dsh-kaze-tachinu-theme.git
git push -u origin main
```

3. 发布 tag（与 npm 版本一致）：

```sh
git tag v1.0.0
git push origin v1.0.0
```

## 发布到 npm

> 仓库内 `.npmrc` 已把 registry 指向官方源（覆盖用户级镜像配置）。

```sh
npm login                    # 或在 package.json 未发布前先用 dry-run 检查
npm publish --dry-run        # 检查发布内容（files: bundle/ plugin/ assets/ cordis.patch.yml）
npm publish
```

若包名冲突先 `npm view dsh-kaze-tachinu-theme` 确认可用。

## 用户安装方式

```sh
# 已发布 npm 后
dsh plugin --profile web add dsh-kaze-tachinu-theme

# 或直接从 GitHub 安装
dsh plugin --profile web add github:Snamei/dsh-kaze-tachinu-theme

# 卸载
dsh plugin --profile web remove dsh-kaze-tachinu-theme
```

## 收尾清单（发布前）

- [ ] `docs/screenshots/home-hero.png` / `chat-main.png`：用真实界面截图替换（README 引用处）；
- [ ] `skin/kaze-tachinu/preview/light.png` / `dark.png`：建议替换为真实界面截图；
- [ ] 素材版权提示保持现状（壁纸 © Studio Ghibli / Toho 等，Logo 为自绘原创，仅个人美化用途）。

## 维护提醒

- 改色时保持 `bundle/client.js`、`plugin/client.js`、`skin/kaze-tachinu/skin.css`、`patches.css` 四处一致，并同步 `docs/theme-tokens.md`；
- 更新皮肤后需重算 `skin/kaze-tachinu/dsh-market.provenance.json` 中的 SHA-256；
- DSH 前端升级后若哈希类名（`.Md3f7G_*` 等）变化，需要同步更新相关选择器（见 README FAQ）。
