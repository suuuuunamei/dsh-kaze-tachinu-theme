// Kimi no Na wa theme — browser half of the dsh-kaze-tachinu-theme bundle.
// Registered with the web module loader via the package's ./client export;
// the cordis loader adopts `exports` (apply/inject) as the plugin object.
// Delivers: comet-blue token layer, wallpaper + glassmorphism component
// styles, logo swap, composer re-skin, placeholder copy, unified
// scrollbars, and the message-scroll patch-ups. Every side effect is
// registered through ctx.effect so disable/remove fully reverts the page.
window.__ModuleLoader__.load({
  id: 'dsh-kaze-tachinu-theme',
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

    const inject = ['theme'];

    const apply = (ctx) => {
      const patchPlaceholders = () => {
        // The composer is a Lexical editor: [data-composer-input] carries the
        // placeholder in data-placeholder + aria-label; legacy builds use a
        // <textarea placeholder>. Choose the copy by UI language (CJK ⇒ zh).
        const themeCopyFor = (text) => {
          if (!text) return null;
          const zh = /[\u4e00-\u9fff]/.test(text);
          if (/描述你想要构建的内容|Describe what you want to build/i.test(text)) {
            return zh ? '風立ちぬ——让想法随风飘去' : 'Kaze Tachinu — let your thoughts ride the wind';
          }
          return zh ? '風立ちぬ——让想法随风飘去' : '風立ちぬ。いざ生きめやも。';
        };
        const walk = () => {
          document.querySelectorAll('[data-composer-card] [data-composer-input], [data-composer-card] textarea').forEach((el) => {
            const attr = el.tagName === 'TEXTAREA' ? 'placeholder' : 'data-placeholder';
            const copy = themeCopyFor(el.getAttribute(attr) || el.getAttribute('aria-label') || '');
            if (!copy) return;
            if (el.getAttribute(attr) !== copy) el.setAttribute(attr, copy);
            if (el.hasAttribute('aria-label') && el.getAttribute('aria-label') !== copy) el.setAttribute('aria-label', copy);
          });
        // The visible grey text is a dedicated absolute placeholder layer
        // (class token ending "_placeholder") whose textContent the host owns.
        document.querySelectorAll('[data-composer-card] [class*="_placeholder"]').forEach((ph) => {
          const ownsToken = [...(typeof ph.className === 'string' ? ph.className.split(/\s+/) : [])].some((c) => c.endsWith('_placeholder'));
          if (!ownsToken) return;
          const copy = themeCopyFor(ph.textContent || '');
          if (copy && ph.textContent.trim() !== copy) ph.textContent = copy;
        });
        };
        walk();
        const observer = new MutationObserver(walk);
        observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['placeholder', 'data-placeholder', 'aria-label'] });
        return () => observer.disconnect();
      };
      const disposePlaceholders = patchPlaceholders();
      const pair = (v) => ({ light: v, dark: v });
      const dispose = ctx.theme.overrideTokens('kaze-tachinu-bg', {
        '--dsw-alias-bg-base': pair('rgba(5,8,20,0)'),
        '--dsw-alias-bg-layer-1': pair('rgba(15,23,42,0.75)'),
        '--dsw-alias-bg-layer-2': pair('rgba(15,23,42,0.8)'),
        '--dsw-alias-bg-layer-3': pair('rgba(15,23,42,0.85)'),
        '--dsw-alias-bg-overlay': pair('rgba(10,14,26,0.9)'),
        '--dsw-alias-bg-module-platform': pair('rgba(255,255,255,0.08)'),
        '--dsw-alias-bg-multi-select': pair('rgba(28,150,181,0.15)'),
        '--dsw-alias-border-l1': pair('rgba(28,150,181,0.14)'),
        '--dsw-alias-border-l2': pair('rgba(28,150,181,0.22)'),
        '--dsw-alias-border-l3': pair('rgba(28,150,181,0.28)'),
        '--dsw-alias-border-l2-darkmode-thin': pair('rgba(28,150,181,0.16)'),
        '--dsw-alias-brand-primary': pair('#1C96B5'),
        '--dsw-alias-button-elevated-fill': pair('rgba(255,255,255,0.08)'),
        '--dsw-alias-button-floating-fill': pair('rgba(255,255,255,0.1)'),
        '--dsw-alias-button-floating-hover': pair('rgba(255,255,255,0.15)'),
        '--dsw-alias-button-primary-dimmed': pair('rgba(28,150,181,0.18)'),
        '--dsw-alias-button-ghost-active-fill': pair('rgba(28,150,181,0.16)'),
        '--dsw-alias-button-ghost-active-hover': pair('rgba(28,150,181,0.22)'),
        '--dsw-alias-button-ghost-active-border': pair('rgba(28,150,181,0.5)'),
        '--dsw-alias-button-tool-bar-fill': pair('rgba(255,255,255,0.1)'),
        '--dsw-alias-button-tool-bar-hover': pair('rgba(255,255,255,0.15)'),
        '--dsw-alias-button-tool-bar-fill-invisible': pair('rgba(255,255,255,0.1)'),
        '--dsw-alias-button-info-fill': pair('#1C96B5'),
        '--dsw-alias-button-info-hover': pair('#137F9B'),
        '--dsw-alias-interactive-bg-hover': pair('rgba(255,255,255,0.08)'),
        '--dsw-alias-interactive-bg-hover-solid': pair('rgba(255,255,255,0.1)'),
        '--dsw-alias-interactive-bg-active': pair('rgba(28,150,181,0.16)'),
        '--dsw-alias-interactive-bg-hover-accent': pair('rgba(28,150,181,0.2)'),
        '--dsw-alias-interactive-bg-hover-danger': pair('rgba(248,113,113,0.12)'),
        '--dsw-alias-label-primary': pair('#F8FAFC'),
        '--dsw-alias-label-secondary': pair('#CBD5E1'),
        '--dsw-alias-label-tertiary': pair('#1C96B5'),
        '--dsw-alias-label-caption': pair('#94A3B8'),
        '--dsw-alias-label-primary-dimmed': pair('#86C9DC'),
        '--dsw-alias-markdown-inline-code': pair('rgba(28,150,181,0.12)'),
        '--dsw-alias-markdown-code-block': pair('rgba(13,17,23,0.55)'),
        '--dsw-alias-markdown-code-block-banner': pair('rgba(28,150,181,0.08)'),
        '--dsw-alias-markdown-tag': pair('rgba(28,150,181,0.1)'),
        '--dsw-alias-markdown-citation': pair('rgba(28,150,181,0.1)'),
        '--dsw-alias-markdown-code-segment-unselected': pair('rgba(255,255,255,0.06)'),
        '--dsw-alias-markdown-code-segment-selected': pair('rgba(28,150,181,0.2)'),
        '--dsw-alias-markdown-placeholder': pair('rgba(255,255,255,0.05)'),
        '--dsw-alias-state-error-primary': pair('#F87171'),
        '--dsw-alias-state-error-secondary': pair('#FCA5A5'),
        '--dsw-alias-state-error-tertiary': pair('rgba(248,113,113,0.14)'),
        '--dsw-alias-state-success-primary': pair('#7FE0C8'),
        '--dsw-alias-state-success-tertiary': pair('rgba(127,224,200,0.14)'),
        '--dsw-alias-state-warn-primary': pair('#FBBF24'),
        '--dsw-alias-state-warn-secondary': pair('#FCD34D'),
        '--dsw-alias-state-warn-tertiary': pair('rgba(251,191,36,0.14)'),
        '--dsw-alias-state-business-primary': pair('#1C96B5'),
        '--dsw-alias-state-business-tertiary': pair('rgba(28,150,181,0.14)'),
        '--dsw-specific-sidebar-fill': pair('rgba(15,23,42,0.42)'),
        '--dsw-specific-sidebar-nav-item-hover': pair('rgba(255,255,255,0.08)'),
        '--dsw-specific-sidebar-nav-item-active': pair('rgba(28,150,181,0.16)'),
        '--dsw-specific-sidebar-nav-item-active-accent': pair('rgba(28,150,181,0.85)'),
        '--dsw-specific-input-major': pair('rgba(15,23,42,0.85)'),
        '--dsw-specific-bubble': pair('rgba(15,23,42,0.75)'),
        '--dsw-specific-tip': pair('rgba(13,17,23,0.75)'),
        '--dsw-specific-menu': pair('rgba(12,66,90,0.94)'),
        '--dsw-specific-selector': pair('rgba(255,255,255,0.1)'),
        '--dsw-alias-scrollbar-bg-l2': pair('rgba(28,150,181,0.32)'),
        '--dsw-alias-scrollbar-hover-l2': pair('rgba(28,150,181,0.55)'),
        '--dsw-shadow-lv2': pair('0 8px 24px rgba(0,0,0,0.28)'),
      });
      ctx.effect(() => dispose);
      ctx.effect(() => disposePlaceholders);
      document.documentElement.setAttribute('data-kaze-tachinu-theme', 'on');
      ctx.effect(() => () => document.documentElement.removeAttribute('data-kaze-tachinu-theme'));
      // Wheel isolation: while the composer textarea has focus, only the input
      // card's own scroll container may consume the wheel. Defaults (InputBar
      // onWheel) forward the delta to the conversation scrollport when the
      // inner scroller is at top/bottom or cannot scroll, which makes the page
      // backdrop scroll through the composer. Capture first and swallow the
      // event whenever there is no inner scroll to perform.
      const composerWheel = (event) => {
        // Hover semantics: decide by where the mouse pointer is (event.target),
        // not by keyboard focus, so moving the pointer back onto the chat area
        // restores backdrop scrolling even while the composer keeps focus.
        const target = event.target;
        if (!(target instanceof Element)) return;
        const card = target.closest('[data-composer-card]');
        const scroller = target.closest('[data-input-scroll]');
        if (!card || !(scroller instanceof HTMLElement)) return;
        const canScroll = scroller.scrollHeight > scroller.clientHeight + 1;
        if (canScroll) return;
        event.preventDefault();
        event.stopImmediatePropagation();
      };
      document.addEventListener('wheel', composerWheel, { capture: true, passive: false });
      ctx.effect(() => () => document.removeEventListener('wheel', composerWheel, { capture: true }));
      // ── 消息滚动重构 + 统计栏胶囊（抗哈希漂移 v2）────────────────
    // 运行时定位：稳定 data-* 属性 + 类名“后缀”(…_scroll)。任何一步
    // 找不到 → 什么都不改 → 原生滚动完好（最坏只丢装饰，绝不冻结聊天）。
    const states = new Map();
    const remembers = (el, props) => {
      const prior = {};
      for (const key of props) prior[key] = el.style.getPropertyValue(key);
      return prior;
    };
    const conversationRoot = (outer) => {
      let n = outer.parentElement;
      while (n) {
        if (n.hasAttribute('data-phase')) return n;
        n = n.parentElement;
      }
      return null;
    };
    const findInnerScroller = (outer) => {
      const scope = outer.querySelector('[data-slot="conversation.session"]') || outer;
      const first = scope.querySelector('[data-chat-flow], [data-chat-flow-key]');
      if (!(first instanceof HTMLElement)) return null;
      let n = first.parentElement;
      while (n && n !== outer) {
        if ([...n.classList].some((c) => /_scroll$/.test(c))) return n;
        n = n.parentElement;
      }
      return null;
    };
    const hasStatsText = (text) =>
      /\d+\s*轮/.test(text) || /\d+\s*步/.test(text) || /(LLM|tok\/s)/.test(text);
    const tagStats = (root) => {
      const seat = root.querySelector('[data-composer-seat]');
      if (!(seat instanceof HTMLElement)) return;
      const leaves = [...seat.querySelectorAll('div, span, dd')].filter(
        (n) => n.children.length === 0 && n.textContent.trim().length > 0 && n.textContent.trim().length < 160,
      );
      const hit = leaves.find((l) => hasStatsText(l.textContent));
      if (!hit) return;
      let pill = hit.parentElement;
      for (let i = 0; pill instanceof HTMLElement && i < 4 && pill !== seat; i += 1) {
        if (pill.children.length >= 3 && hasStatsText(pill.textContent)) break;
        pill = pill.parentElement;
      }
      if (!(pill instanceof HTMLElement) || pill === seat) return;
      if (!pill.hasAttribute('data-kaze-stats')) pill.setAttribute('data-kaze-stats', '');
      [...pill.children].forEach((c) => {
        if (/^[\s•·|,，、.\-\u2013\u2014]{1,5}$/.test(c.textContent) && !c.hasAttribute('data-kaze-stats-sep')) {
          c.setAttribute('data-kaze-stats-sep', '');
        }
      });
    };
    const revertConversation = (state) => {
      const { outer, root, inner, attrs, prior } = state;
      if (outer instanceof HTMLElement) {
        for (const [key, value] of Object.entries(prior.outer)) {
          if (value === '' || value === undefined) outer.style.removeProperty(key);
          else outer.style.setProperty(key, value);
        }
      }
      if (inner instanceof HTMLElement) {
        for (const [key, value] of Object.entries(prior.inner)) {
          if (value === '' || value === undefined) inner.style.removeProperty(key);
          else inner.style.setProperty(key, value);
        }
        if (attrs.innerScroll) inner.removeAttribute('data-conversation-scroll');
        inner.removeAttribute('data-kaze-scroll-inner');
        if (state.relay) inner.removeEventListener('scroll', state.relay);
      }
      for (const entry of prior.chain) {
        for (const [key, value] of Object.entries(entry.before)) {
          if (value === '' || value === undefined) entry.el.style.removeProperty(key);
          else entry.el.style.setProperty(key, value);
        }
      }
      if (root instanceof HTMLElement) {
        root.removeAttribute('data-kaze-scroll');
        const seat = root.querySelector('[data-composer-seat]');
        if (seat) {
          const pill = seat.querySelector('[data-kaze-stats]');
          if (pill) {
            pill.removeAttribute('data-kaze-stats');
            [...pill.querySelectorAll('[data-kaze-stats-sep]')].forEach((s) => s.removeAttribute('data-kaze-stats-sep'));
          }
        }
      }
    };
    const prepareConversation = (outer) => {
      if (!(outer instanceof HTMLElement) || states.has(outer)) return;
      const root = conversationRoot(outer);
      const inner = findInnerScroller(outer);
      if (!root || !(inner instanceof HTMLElement)) return; // 定位失败 → 安全不动
      const prior = {
        outer: remembers(outer, ['overflow']),
        inner: remembers(inner, ['overflow-y', 'flex', 'min-height', 'padding-bottom', 'mask-image', '-webkit-mask-image', '--dsh-composer-height']),
        chain: [],
      };
      let n = inner.parentElement;
      while (n && n !== outer) {
        const el = n;
        prior.chain.push({ el, before: remembers(el, ['flex', 'min-height']) });
        el.style.setProperty('flex', '1 1 0');
        el.style.setProperty('min-height', '0');
        n = n.parentElement;
      }
      outer.style.setProperty('overflow', 'hidden');
      const innerProps = {
        'flex': '1 1 0',
        'min-height': '0',
        'overflow-y': 'auto',
        'padding-bottom': '24px',
        '--dsh-composer-height': '28px',
        '-webkit-mask-image': 'linear-gradient(to bottom, black 0%, black calc(100% - 40px), transparent 100%)',
        'mask-image': 'linear-gradient(to bottom, black 0%, black calc(100% - 40px), transparent 100%)',
      };
      for (const [key, value] of Object.entries(innerProps)) inner.style.setProperty(key, value);
      const attrs = { innerScroll: !inner.hasAttribute('data-conversation-scroll') };
      if (attrs.innerScroll) inner.setAttribute('data-conversation-scroll', '');
      inner.setAttribute('data-kaze-scroll-inner', '');
      root.setAttribute('data-kaze-scroll', '');
      const relay = () => { if (outer instanceof HTMLElement) outer.dispatchEvent(new Event('scroll')); };
      inner.addEventListener('scroll', relay);
      states.set(outer, { outer, root, inner, attrs, prior, relay });
      try { tagStats(root); } catch (err) { console.warn('[kaze] stats tag failed', err); }
    };
    const sweepConversations = () => {
      try {
        document.querySelectorAll('[data-conversation-scroll]:not([data-kaze-scroll-inner])').forEach((outer) => {
          const root = conversationRoot(outer);
          if (root && root.getAttribute('data-phase') === 'active') prepareConversation(outer);
        });
        states.forEach((state, outer) => {
          if (!outer.isConnected) { revertConversation(state); states.delete(outer); }
        });
      } catch (err) { console.warn('[kaze] sweep failed', err); }
    };
    let sweepFrame = 0;
    const scheduleSweep = () => {
      if (sweepFrame) return;
      sweepFrame = requestAnimationFrame(() => { sweepFrame = 0; sweepConversations(); });
    };
    scheduleSweep();
    const sweepObserver = new MutationObserver(scheduleSweep);
    sweepObserver.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-phase', 'data-composer-seat'] });
    ctx.effect(() => () => {
      sweepObserver.disconnect();
      if (sweepFrame) cancelAnimationFrame(sweepFrame);
      states.forEach((state) => revertConversation(state));
      states.clear();
    });

    // 2) 输入卡非文本区（附件行 / 按钮等）滚轮：原生时代由外层 scrollBody
      //    承接，重构后补一条转发到内层消息滚动器，保持既有手感。文本区
      //    （[data-input-scroll]）仍由上面的 composerWheel 守卫全权处理。
      //    例外：输入卡内的弹出面板（模型选择 / effort 菜单等）自带滚动区——
      //    目标与卡根之间若存在中间滚动容器，滚轮归它所有：面板滚得动就滚
      //    面板，滚到边界就吞掉，绝不转发给外层会话（否则会出现
      //    「在模型菜单上滚动 → 背后聊天区跟着滚」）。
      const cardChromeWheel = (event) => {
        if (event.deltaY === 0) return;
        const target = event.target;
        if (!(target instanceof Element)) return;
        if (target.closest('[data-input-scroll]')) return;
        const card = target.closest('[data-composer-card]');
        if (!card) return;
        let node = target;
        while (node instanceof HTMLElement && node !== card) {
          const oy = getComputedStyle(node).overflowY;
          if (oy === 'auto' || oy === 'scroll') {
            const canConsume = node.scrollHeight > node.clientHeight + 1
              && !((event.deltaY < 0 && node.scrollTop <= 0)
                || (event.deltaY > 0 && node.scrollTop + node.clientHeight >= node.scrollHeight - 1));
            if (canConsume) node.scrollTop += event.deltaY;
            event.preventDefault();
            event.stopImmediatePropagation();
            return;
          }
          node = node.parentElement;
        }
      const real = document.querySelector('[data-kaze-scroll-inner]');
      if (!(real instanceof HTMLElement)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      real.scrollTop += event.deltaY;
      };
      document.addEventListener('wheel', cardChromeWheel, { capture: true, passive: false });
      ctx.effect(() => () => document.removeEventListener('wheel', cardChromeWheel, { capture: true }));
        const styleEl = document.createElement('style');
        styleEl.setAttribute('data-plugin', 'dsh-kaze-tachinu-theme');
        styleEl.textContent = `html { background-color: transparent !important; }
body {
  background-image:
    linear-gradient(180deg, rgba(4,7,18,0.12) 0%, rgba(8,11,28,0.06) 45%, rgba(14,8,26,0.10) 100%),
    url('/kaze-tachinu/current.jpg') !important;
  background-size: cover, cover !important;
  background-position: center, center !important;
  background-attachment: fixed, fixed !important;
  background-repeat: no-repeat, no-repeat !important;
  -webkit-font-smoothing: antialiased !important;
  text-rendering: optimizeLegibility !important;
  font-weight: 500 !important;
}
body[data-ds-dark-theme] {
  background-image:
    linear-gradient(180deg, rgba(4,7,18,0.12) 0%, rgba(8,11,28,0.06) 45%, rgba(14,8,26,0.10) 100%),
    url('/kaze-tachinu/current.jpg') !important;
}
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  backdrop-filter: blur(6px) saturate(140%);
  -webkit-backdrop-filter: blur(6px) saturate(140%);
}
[data-chat-flow] {
  background: rgba(13,17,23,0.45);
  backdrop-filter: blur(8px) saturate(140%);
  -webkit-backdrop-filter: blur(8px) saturate(140%);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 20px;
  padding: 12px 14px 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}
body[data-ds-dark-theme] [data-chat-flow] {
  background: rgba(13,17,23,0.45);
  border-color: rgba(255,255,255,0.12);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

/* ── 消息滚动重构 + 统计栏：抗哈希漂移 v2 ─────────────
 * 布局由 apply() 内的运行时引擎完成（内联样式 + data-kaze-* 标记）。
 * 此处仅保留纯装饰，选择器只用 kaze 注入属性或稳定 data-*，不含任何
 * 构建哈希类名。探测失败 → JS 不动手 → 原生滚动完好（最坏丢装饰）。 */
[data-kaze-stats] {
  width: fit-content !important;
  max-width: 100% !important;
  margin: 4px auto 0 !important;
  padding: 3px 14px !important;
  text-align: center !important;
  font-size: 11px !important;
  color: rgba(134, 201, 220, 0.92) !important;
  background: rgba(10, 14, 26, 0.55) !important;
  border: 1px solid rgba(28, 150, 181, 0.18) !important;
  border-radius: 999px !important;
  backdrop-filter: blur(10px) saturate(130%) !important;
  -webkit-backdrop-filter: blur(10px) saturate(130%) !important;
}
[data-kaze-stats-sep] {
  color: rgba(28, 150, 181, 0.42) !important;
  margin: 0 6px !important;
}


[data-composer-card] {
  background: rgba(12, 66, 90, 0.85) !important;
  backdrop-filter: blur(20px) saturate(130%) !important;
  -webkit-backdrop-filter: blur(20px) saturate(130%) !important;
  border: 1px solid rgba(28, 150, 181, 0.45) !important;
  border-radius: 20px !important;
  box-shadow: none !important;
}
[data-composer-card] ::placeholder {
  color: rgba(122, 205, 225, 0.62) !important;
  -webkit-text-fill-color: rgba(122, 205, 225, 0.62) !important;
  opacity: 1 !important;
}
[data-composer-card] textarea {
  color: transparent !important;
  -webkit-text-fill-color: transparent !important;
  caret-color: #f1f5f9 !important;
  text-shadow: none !important;
  -webkit-text-stroke: 0 !important;
}
[data-composer-card] [data-input-backdrop] {
  color: #ffffff !important;
}
[data-composer-card] [data-input-backdrop] * {
  text-shadow: none !important;
  -webkit-text-stroke: 0 !important;
}
[data-composer-card] .uV2eYG_hlToken {
  color: #ffffff !important;
  background: transparent !important;
}
[data-composer-card] .uV2eYG_hint {
  color: rgba(255, 255, 255, 0.45) !important;
}
[data-composer-card] .uV2eYG_scroll {
  scrollbar-width: none !important;
}
[data-composer-card] .uV2eYG_scroll::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}
[data-composer-card] textarea,
[data-composer-card] .uV2eYG_input,
[data-composer-card] .uV2eYG_mirror,
[data-composer-card] .uV2eYG_backdrop,
[data-composer-card] [data-input-backdrop],
[data-composer-card] [data-input-backdrop] *,
[data-composer-card] [data-input-mirror] {
  font-weight: 500 !important;
  letter-spacing: 0 !important;
  font-variant-ligatures: none !important;
}
[data-composer-card] button {
  background: rgba(255, 255, 255, 0.12) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  color: #7fcfe2 !important;
}
[data-composer-card] button:hover {
  background: rgba(255, 255, 255, 0.2) !important;
}
[data-composer-card] [data-input-mirror] {
  visibility: hidden !important;
}
[data-composer-seat] > * {
  background: rgba(12, 66, 90, 00.85) !important;
  backdrop-filter: blur(20px) saturate(130%) !important;
  -webkit-backdrop-filter: blur(20px) saturate(130%) !important;
  border: 1px solid rgba(28, 150, 181, 0.5) !important;
  border-radius: 20px !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35) !important;
  z-index: 100 !important;
}
[data-radix-popper-content-wrapper] > div,
div[role="menu"],
div[role="dialog"][class*="popover"],
div[class*="popover"],
div[class*="dropdown-menu"] {
  background: rgba(12, 66, 90, 0.94) !important;
  background-color: rgba(12, 66, 90, 0.94) !important;
  backdrop-filter: blur(16px) saturate(130%) !important;
  -webkit-backdrop-filter: blur(16px) saturate(130%) !important;
  border: 1px solid rgba(28, 150, 181, 0.35) !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4) !important;
  border-radius: 12px !important;
}
div[role="menu"] > div {
  background: transparent !important;
}
[role="menuitem"] {
  border: none !important;
  background: transparent !important;
  color: #e2e8f0 !important;
  border-radius: 8px !important;
  margin-bottom: 2px !important;
  transition: background 0.2s ease !important;
}
[role="menuitem"]:hover,
[role="menuitem"][data-highlighted] {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
}
[data-phase="hero"] .pXSMma_fish,
[data-phase="hero"] .pXSMma_headlineText,
[data-phase="hero"] .pXSMma_previewBadge {
  display: none !important;
}
[data-phase="hero"] .pXSMma_headline {
  display: block !important;
  text-align: center !important;
}
[data-phase="hero"] .pXSMma_headline::before {
  content: '' !important;
  display: inline-block !important;
  width: 360px !important;
  height: 90px !important;
  background-image: url('/kaze-tachinu/logo.svg') !important;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.35));
}
.hHd-Xa_brand {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  position: relative !important;
}
.hHd-Xa_brand svg {
  display: none !important;
}
.hHd-Xa_brand::before {
  content: '' !important;
  display: inline-block !important;
  width: 144px !important;
  height: 36px !important;
  background-image: url('/kaze-tachinu/logo.svg') !important;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center center !important;
  flex: none !important;
  transform: translateX(10px) !important;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}
.hHd-Xa_brand::after {
  display: none !important;
}
.hHd-Xa_collapsed .hHd-Xa_toggle {
  position: relative !important;
}
.hHd-Xa_collapsed .hHd-Xa_toggle > * {
  display: none !important;
}
.hHd-Xa_collapsed .hHd-Xa_toggle::before {
  content: '' !important;
  display: block !important;
  width: 24px !important;
  height: 24px !important;
  flex: none !important;
  background-image: url('/kaze-tachinu/logo-letter.svg') !important;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}
[data-cordis-panel] {
  position: fixed !important;
  background: rgba(15, 23, 42, 0.92) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6) !important;
  z-index: 9999 !important;
  color-scheme: dark !important;
}
[data-cordis-panel] select {
  background: rgba(15, 23, 42, 0.9) !important;
  color: #F8FAFC !important;
  border: 1px solid rgba(28, 150, 181, 0.2) !important;
  border-radius: 6px !important;
  padding: 2px 8px !important;
}
[data-cordis-panel] option {
  background-color: #0f172a !important;
  color: #F8FAFC !important;
}
[data-cordis-row] {
  margin: 6px 2px !important;
  padding: 4px !important;
}
/* 全局滚动条：kaze-tachinu 蓝紫玻璃统一风格（webkit/Electron 核心 + Firefox 标准属性兜底） */
* {
  scrollbar-width: thin  !important;
  scrollbar-color: rgba(28, 150, 181, 0.42) rgba(15, 23, 42, 0.35) !important;
}
*::-webkit-scrollbar {
  width: 10px !important;
  height: 10px !important;
}
*::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.35) !important;
  border-radius: 5px !important;
}
*::-webkit-scrollbar-thumb {
  background: rgba(28, 150, 181, 0.42) !important;
  border: 2px solid rgba(15, 23, 42, 0.55) !important;
  border-radius: 5px !important;
  background-clip: padding-box !important;
}
*::-webkit-scrollbar-thumb:hover {
  background: rgba(28, 150, 181, 0.62) !important;
  border: 2px solid rgba(15, 23, 42, 0.55) !important;
  border-radius: 5px !important;
  background-clip: padding-box !important;
}
*::-webkit-scrollbar-corner {
  background: transparent !important;
}`;
      document.head.append(styleEl);
      ctx.effect(() => () => styleEl.remove());
    };

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  },
});
