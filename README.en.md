# dsh-kaze-tachinu-theme · Kaze Tachinu Theme

[中文](README.md) | English

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
  <strong>A <em>The Wind Rises</em> (風立ちぬ, Kaze Tachinu) theme for the DeepSeek Harness (DSH) Web GUI</strong><br>
  <em>Sky-blue glassmorphism · Cinematic sky wallpaper · Original vector logos · Composer re-skin · Themed placeholder copy · Session-stats pill · Message-list bottom fade · Unified scrollbars</em>
</p>

<div align="center">

[What it is](#what-it-is) · [Theme details](#theme-details) · [Drift-proof design](#drift-proof-design) · [Quick start](#quick-start) · [Customize](#customize) · [FAQ](#faq) · [Known limits](#known-limits) · [License & asset copyright](#license--asset-copyright)

</div>

## What it is

dsh-kaze-tachinu-theme turns the DSH Web GUI into Miyazaki's *The Wind Rises*: a cinematic sky wallpaper behind every surface, translucent frosted-glass panels, sky-blue (`#1C96B5`) as the single interaction color, an original red-wing logo with a "The Wind Rises" wordmark in place of the sidebar brand and home-hero headline, a navy-glass composer card, and themed placeholder copy.

It is a standard dsh plugin package: one `dsh plugin` command installs it into a profile, it stays resident with DSH, no DSH source is modified, and uninstalling fully restores the page.

| Dimension | Native dsh web | dsh-kaze-tachinu-theme |
| --- | --- | --- |
| Background | Solid / solid gradient | Cinematic sky wallpaper + global blur scrim |
| Surfaces | Opaque layers | Translucent frosted glass (backdrop-filter) |
| Brand | DSH default | Original red-wing logo (expanded) + paper-plane mark (collapsed) |
| Interaction color | DSH default | Sky-blue `#1C96B5` (buttons/active/highlight/borders/scrollbars) |
| Composer | Default | Sky-navy glass capsule, themed placeholder copy |
| Session stats | Default | Centered slim glass pill + dim separators |
| Message-list bottom | Hard edge | 40px gradient fade (composer never clipped) |
| Install | — | One `dsh plugin --profile web add ...` command |
| Revert | — | Fully restored on uninstall |

## Theme details

### Sky-blue glassmorphism

A ~60-entry design-token overlay via the official `theme.overrideTokens` API: translucent background layers (the wallpaper shows through), low-saturation sky-blue borders, sky-blue interaction states, and status colors tuned to dark glass. Light and dark modes share one look. See [docs/theme-tokens.md](docs/theme-tokens.md).

### Wallpaper and logos

- Wallpaper served by the plugin host half at `/kaze-tachinu/current.jpg` (from `assets/current.jpg`), with a subtle dark gradient for readability;
- Sidebar brand shows the horizontal logo when expanded and a paper-plane letter mark when collapsed (both original in-repo vectors);
- The home-hero headline is replaced by a large centered logo.

### Composer and placeholder copy

The composer is re-skinned as a navy glass capsule; placeholder copy is swapped per UI language using **prefix matching** (it still matches when the host appends suffixes like "… / call a command @ file or conversation"). Current DSH has a **single composer box**, so only the "Composer" column is visible; the "New-session" copy only appears on host builds that still provide a separate describe/new-session input (placeholder starting with "Describe what you want to build").

| UI language | Composer (unified box) | New-session (only on builds with a separate box) |
| --- | --- | --- |
| Chinese | `風立ちぬ——让想法随风飘去` | `風立ちぬ——让想法随风飘去` |
| English | `風立ちぬ。いざ生きめやも。` | `Kaze Tachinu — let your thoughts ride the wind` |

### Message-list scroll sink + bottom fade

DSH natively scrolls the composer and the message list inside one container, so a plain mask would clip the composer. This theme **sinks the scroll viewport into the pure message list**: the outer scrollport becomes layout-only (composer pinned), the message list becomes the bounded scroller and carries the 40px bottom fade; at the very bottom, message text still sits fully above the fade.

### Session-stats pill

The stats line above the composer ("20 turns · 185 steps | LLM …") is restyled as a centered glass pill: content-sized width, translucent navy background + blur to lift the text off the wallpaper, with dimmed separators.

### Unified scrollbars

Global sky-blue glass scrollbars for Chromium browsers, with a `scrollbar-color` fallback for Firefox.

## Drift-proof design

DSH component class names are **build-time hashes** (`.Md3f7G_*`, `._7mWUNa_*`, `.wSkVaW_*`, ...) that change on frontend upgrades. In the past, such drift disabled the scroll sink — the outer scroller was hidden while nothing took over, leaving the chat **unscrollable**.

Since v2 the theme uses runtime location + safe fallback:

- **CSS no longer references any hash class for the scroll or stats areas.** Everything that could affect usability is handled at runtime by the hooks engine in `bundle/client.js`, `plugin/client.js` and `skin/.../hooks.mjs`:
  - The message scroller is located via stable attributes (`[data-conversation-scroll]`, `[data-slot="conversation.session"]`, `[data-chat-flow]`) plus the class **suffix** (`…_scroll`, from the component author's own naming, stable across builds);
  - Once located, it applies **inline styles + custom markers**: `data-kaze-scroll` (conversation root), `data-kaze-scroll-inner` (inner scroller), and `data-kaze-stats` / `data-kaze-stats-sep` (stats pill and separators, found by text signature inside `[data-composer-seat]`);
  - Decorative CSS keys only off those `data-kaze-*` attributes.
- **Safe fallback:** if any step fails to locate its target, the engine does nothing — native scrolling and default chrome stay intact (worst case: cosmetic only). Engine steps are try/catch guarded and only ever `console.warn`.

**Marker probe** (open a session's Chat tab, then run in the console; expected `1 / 1 / 1 / 2`):

```js
console.log('kaze-scroll root=', document.querySelectorAll('[data-kaze-scroll]').length,
  '| inner=', document.querySelectorAll('[data-kaze-scroll-inner]').length,
  '| stats=', document.querySelectorAll('[data-kaze-stats]').length,
  '| conv-scroll=', document.querySelectorAll('[data-conversation-scroll]').length);
```

Remaining hash-class selectors are **decoration only** (home-hero logo, sidebar brand, composer highlight/hint) — a drift there is a local visual regression, never a usability break.

## Quick start

> **Browser**: the theme uses backdrop-filter glass, custom scrollbars and CSS masks heavily — use **Microsoft Edge** or **Google Chrome**. Firefox degrades (scrollbars, masks).

### Requirements

- DeepSeek Harness installed and `dsh web` booting;
- pnpm available (`dsh plugin` shells out to it; Node's corepack works).
- DSH Desktop: profiles live under `%APPDATA%/dsh-desktop/harness/profiles/` (point `DSH_HOME` there when using the CLI).

### Install (published release)

```sh
dsh plugin --profile web add dsh-kaze-tachinu-theme
dsh web   # restart DSH
```

or straight from GitHub:

```sh
dsh plugin --profile web add github:Snamei/dsh-kaze-tachinu-theme
```

Wallpaper and the sidebar logo appearing means success. It stays resident; no per-session installs.

### Install (local dev / unpublished)

```sh
dsh plugin --profile web add file:/absolute/path/to/dsh-kaze-tachinu-theme
# or, live-link your edits:
dsh plugin --profile web add link:/absolute/path/to/dsh-kaze-tachinu-theme
```

> Windows: a cross-drive `file:E:/...` spec is resolved wrongly by pnpm. Create a junction inside the profile dir and install relative to it, e.g. in `profiles/web`:
> `mklink /J kaze-local E:\absolute\path\dsh-kaze-tachinu-theme`
> then `dsh plugin --profile web add file:./kaze-local`.
> Re-run that add after each repo change to refresh the `file:` snapshot.

### Update / disable / uninstall

```sh
dsh plugin --profile web update dsh-kaze-tachinu-theme   # then restart
# disable without uninstalling: remove "dsh-kaze-tachinu-theme" from dsh.profile.bundles in the profile package.json
dsh plugin --profile web remove dsh-kaze-tachinu-theme   # then restart
```

### skin-center route (optional)

Copy the whole `skin/kaze-tachinu/` folder to `~/.dsh/skins/kaze-tachinu/` (DSH Desktop: `%APPDATA%/dsh-desktop/harness/skins/kaze-tachinu/`) and refresh — it appears under Settings → skin center. Manually dropped skins run without the `hooks.mjs` enhancements because of the provenance gate (visuals are complete; the runtime scroll sink, stats pill and placeholder copy need hooks). Use either the plugin or the skin route, not both.

## Customize

Clone and install with `link:` (see local dev above).

- Wallpaper: replace `assets/current.jpg` (keep the filename), hard-refresh.
- Logos: replace the two SVGs in `assets/logo/`, hard-refresh.
- Placeholder copy: edit the rule table in the runtime engine (`bundle/client.js`, `plugin/client.js`, `skin/.../hooks.mjs` — same source), restart.
- Colors: token overlays in `bundle/client.js` / `skin/kaze-tachinu/skin.css` plus decorative styles; restart and hard-refresh. See [docs/theme-tokens.md](docs/theme-tokens.md).

## Architecture

A standard dsh plugin bundle: `package.json` declares `dsh.bundle`/`dsh.client`; `dsh plugin add` mounts it into the profile.

```
bundle/host.js       # Node host half: serves /kaze-tachinu/* assets (wallpaper, logos)
bundle/client.js     # Browser half (./client export): tokens + decoration + runtime scroll/stats engine + placeholders
plugin/client.js     # Cordis dynamic-injection source of the same logic (usually irrelevant)
cordis.patch.yml     # Plugin manifest mounted by dsh plugin add
assets/              # Wallpaper and original-vector logos
skin/kaze-tachinu/   # skin-center package: skin.json + skin.css + patches.css + hooks.mjs
```

All side effects (tokens, style tags, listeners, DOM markers, routes) are tied to the plugin lifecycle and fully revert on disable/uninstall.

## FAQ

<details>
<summary><strong>Installed and restarted, nothing changed?</strong></summary>

Make sure the command targeted `--profile web`; hard-refresh the browser (Ctrl+F5); check the `dsh web` log for `[kaze-tachinu-theme] host half active`.

</details>

<details>
<summary><strong>Background / logo 404?</strong></summary>

Re-run the install command — usually a pruned or broken profile `node_modules`.

</details>

<details>
<summary><strong>Placeholder copy not themed?</strong></summary>

The swap reads the real placeholder attribute. Some desktop distributions draw placeholders in their own visual layer; standard DSH Web clients are supported.

</details>

<details>
<summary><strong>The chat won't scroll?</strong></summary>

Run the marker probe above: if the three `data-kaze-*` counts are 0 while `conv-scroll=2`, an outdated client bundle is loaded — install the current repo version and fully restart. If the markers are 1/1/1 and it still won't scroll, open an issue with the console `[kaze] …` warnings.

</details>

<details>
<summary><strong>DSH upgrade broke something?</strong></summary>

Since v2 the scroll sink, bottom fade and stats pill are hash-free (runtime located, safe fallback — at worst decoration degrades). Only purely decorative selectors (hero logo, sidebar brand, composer highlight/hint) may need a small retarget after an upgrade. Open an issue with a screenshot.

</details>

<details>
<summary><strong>DSH lands on the "startup repair" page after install?</strong></summary>

Usually the browser half threw during apply (historically: `styleEl is not defined`). Exit DSH Desktop on the repair page, uninstall the plugin to restore normal mode, then install the **current** repo version and restart. For local `file:` installs, sync the repo first, then re-add. If it reproduces, attach the tail of `harness.log`.

</details>

<details>
<summary><strong>Can it coexist with other themes?</strong></summary>

Token layers stack but visuals fight. Enable one theme-style plugin at a time.

</details>

## Known limits

- Frosted glass, scrollbars and masks are tuned for Chromium (Edge/Chrome); Firefox degrades.
- Hero logo, sidebar brand and composer highlight/hint still use build-time hash classes — decorative only (see drift-proof design).
- Dark-glass visuals are shared across light/dark modes; there is no separate light-mode pass.
- Wallpaper/logo routes are cached for ~1h; hard-refresh after swapping assets.
- Some DSH Desktop builds skip the plugin browser half (host half only): DOM-level effects (brand, placeholders, runtime scroll sink) are limited there — same as dsh-kimino-theme on those builds; standard DSH Web clients get everything.

## License & asset copyright

Code is [MIT](LICENSE) licensed.

Wallpaper artwork in `assets/` derives from promotional material of *The Wind Rises* (2013); rights belong to Studio Ghibli, Nibariki, KDDI, Toho et al. Logos in `assets/logo/` are original in-repo vector work. This repository is for personal desktop decoration only: it claims no rights and makes no profit; materials will be removed on request of the rights holders.

## Contributing

- Conventional Commits (e.g. `feat(client): fix xxx`); no emoji in code/docs/commits;
- Attach screenshots/verification for user-visible changes in PRs;
- Keep [docs/theme-tokens.md](docs/theme-tokens.md) in sync when touching tokens.

<div align="center">

**Enjoying the theme? Star it.**

[Report an issue](https://github.com/Snamei/dsh-kaze-tachinu-theme/issues) · [Feature request](https://github.com/Snamei/dsh-kaze-tachinu-theme/issues)

</div>
