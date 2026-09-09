/**
 * kaze-tachinu skin — behavioral hooks (SkinHooks contract v1alpha1).
 *
 * Delivers what a declarative skin cannot:
 *   1. themed placeholder copy (Japanese film lines, language-aware),
 *   2. the "sink the scroll viewport into the pure message list" rework,
 *      together with its bottom-gradient fade,
 *   3. composer / popup wheel isolation.
 *
 * Drift-resilience contract (v2):
 *   This skin never re-targets DSH's build-time hash classes (._7mWUNa_/…
 *   style prefixes) from CSS. Instead hooks.mjs LOCATES the message scroller
 *   and the session-stats pill at runtime — by stable data-* attributes and
 *   by class-token *suffixes* (…_scroll / …_root), which come from the
 *   author's own CSS-module names and stay stable across DSH upgrades.
 *   Whatever the code finds, it applies as INLINE styles + kaze-injected
 *   attributes ([data-kaze-scroll], [data-kaze-scroll-inner],
 *   [data-kaze-stats], [data-kaze-stats-sep]) that patches.css then styles.
 *   If anything cannot be located the hooks do nothing → native scrolling and
 *   default chrome remain fully functional (worst case: cosmetic only).
 *
 * Contract constraints honored: default-exported factory, no top-level side
 * effects, no module-level mutable state, cleanup idempotent.
 */

export default function defineSkinHooks() {
  return {
    apply(ctx) {
      const { onCleanup } = ctx;

      // ── Bookkeeping helpers ──────────────────────────────────────────
      // Per-conversation state: what we styled + how to revert it.
      const states = new Map();
      const remembers = (el, prop) => {
        // Inline styles we set; keep their prior inline values to restore.
        const prior = {};
        for (const key of prop) prior[key] = el.style.getPropertyValue(key);
        return prior;
      };
      const revertState = (state) => {
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
          // Drop any stats tags we added inside this conversation root.
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

      // ── Runtime locators (no hash classes) ───────────────────────────
      /** Find the conversation "root" (the element carrying data-phase). */
      const conversationRoot = (outer) => {
        let n = outer.parentElement;
        while (n) {
          if (n.hasAttribute('data-phase')) return n;
          n = n.parentElement;
        }
        return null;
      };

      /** Message-list scroller: a node under the session slot that owns a
       *  class token ending in "_scroll" and contains the chat flow rows.
       *  Returns null when it cannot be found — callers must fall back. */
      const findInnerScroller = (outer) => {
        const scope = outer.querySelector('[data-slot="conversation.session"]') || outer;
        const first = scope.querySelector('[data-chat-flow], [data-chat-flow-key]');
        if (!(first instanceof HTMLElement)) return null;
        let n = first.parentElement;
        while (n && n !== outer) {
          const ownsScrollSuffix = [...n.classList].some((c) => /_scroll$/.test(c));
          if (ownsScrollSuffix) return n;
          n = n.parentElement;
        }
        return null; // unresolved → hooks bail out, native scrolling intact
      };

      const hasStatsText = (text) =>
        /\d+\s*轮/.test(text) || /\d+\s*步/.test(text) || /(LLM|tok\/s)/.test(text);

      /** Tag the session-stats pill + its separators inside a root. */
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

      // ── The scroll rework (safe: bail out = native scrolling) ────────
      const prepareConversation = (outer) => {
        if (!(outer instanceof HTMLElement)) return;
        if (states.has(outer)) return;
        const root = conversationRoot(outer);
        const inner = findInnerScroller(outer);
        if (!root || !(inner instanceof HTMLElement)) return; // cannot resolve → do nothing
        const prior = {
          outer: remembers(outer, ['overflow']),
          inner: remembers(inner, ['overflow-y', 'flex', 'min-height', 'padding-bottom', 'mask-image', '-webkit-mask-image', '--dsh-composer-height']),
          chain: [],
        };
        // Bound every flex ancestor between the inner scroller and the outer
        // scrollport so the inner element can actually overflow. (Inline
        // styles only — no selectors to drift.)
        let n = inner.parentElement;
        while (n && n !== outer) {
          const el = n;
          prior.chain.push({ el, before: remembers(el, ['flex', 'min-height']) });
          el.style.setProperty('flex', '1 1 0');
          el.style.setProperty('min-height', '0');
          n = n.parentElement;
        }
        // Pin the composer: the outer scrollport stops scrolling; the inner
        // list becomes the scroller and takes the bottom-gradient mask.
        prior.outer.overflow = outer.style.getPropertyValue('overflow');
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
        for (const [key, value] of Object.entries(innerProps)) {
          inner.style.setProperty(key, value);
        }
        // Route the component's own scroll wiring to the inner scroller, the
        // way the previous (hash-based) companion did:
        const attrs = { innerScroll: !inner.hasAttribute('data-conversation-scroll') };
        if (attrs.innerScroll) inner.setAttribute('data-conversation-scroll', '');
        inner.setAttribute('data-kaze-scroll-inner', '');
        root.setAttribute('data-kaze-scroll', '');
        // Keep any logic bound to the outer scrollport in the loop by
        // relaying inner scrolls to it.
        const relay = () => {
          if (outer instanceof HTMLElement) outer.dispatchEvent(new Event('scroll'));
        };
        inner.addEventListener('scroll', relay);
        const state = { outer, root, inner, attrs, prior, relay };
        states.set(outer, state);
        try { tagStats(root); } catch (err) { console.warn('[kaze] stats tag failed', err); }
      };

      const sweepConversations = () => {
        try {
          for (const outer of document.querySelectorAll('[data-conversation-scroll]:not([data-kaze-scroll-inner])')) {
            const root = conversationRoot(outer);
            if (root && root.getAttribute('data-phase') === 'active') prepareConversation(outer);
          }
        } catch (err) { console.warn('[kaze] sweep failed', err); }
      };

      // ── 1) Themed placeholder copy (unchanged behavior) ───────────────
      const RULES = [
        { starts: '给智能体发消息', to: '风起了，要努力活下去。' },
        { starts: 'Message the agent', to: '風立ちぬ。いざ生きめやも。' },
        { starts: '描述你想要构建的内容', to: '風立ちぬ——让想法随风飘去' },
        { starts: 'Describe what you want to build', to: 'Kaze Tachinu — let your thoughts ride the wind' },
      ];
      const walkPlaceholders = () => {
        document.querySelectorAll('textarea').forEach((ta) => {
          const cur = ta.placeholder;
          if (!cur) return;
          for (const rule of RULES) {
            if (cur.startsWith(rule.starts) && ta.placeholder !== rule.to) {
              ta.placeholder = rule.to;
              break;
            }
          }
        });
      };
      walkPlaceholders();
      const placeholderObserver = new MutationObserver(walkPlaceholders);
      placeholderObserver.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['placeholder'] });

      // ── 2) Conversation / stats sweep (debounced per frame) ───────────
      let frame = 0;
      const schedule = () => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          sweepConversations();
          for (const [outer] of states) {
            if (!outer.isConnected) {
              revertState(states.get(outer));
              states.delete(outer);
            }
          }
        });
      };
      schedule();
      const sweepObserver = new MutationObserver(schedule);
      sweepObserver.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-phase', 'data-composer-seat'] });

      // ── 3) Wheel guards: composer focus isolation + card-chrome
      //        forwarding + in-card popover ownership. ───────────────────
      const composerWheel = (event) => {
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
        // No inner scroller in reach — forward to the kaze sink when one is
        // live; otherwise leave the event alone (native fallback).
        const rootEl = card.closest('[data-kaze-scroll]');
        if (!rootEl) return;
        let inner = null;
        for (const [, state] of states) {
          if (state.root === rootEl) inner = state.inner;
        }
        if (!(inner instanceof HTMLElement)) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        inner.scrollTop += event.deltaY;
      };
      document.addEventListener('wheel', composerWheel, { capture: true, passive: false });
      document.addEventListener('wheel', cardChromeWheel, { capture: true, passive: false });

      // ── Cleanup ──────────────────────────────────────────────────────
      onCleanup(() => {
        placeholderObserver.disconnect();
        sweepObserver.disconnect();
        if (frame) cancelAnimationFrame(frame);
        document.removeEventListener('wheel', composerWheel, { capture: true });
        document.removeEventListener('wheel', cardChromeWheel, { capture: true });
        for (const state of states.values()) revertState(state);
        states.clear();
      });
    },
  };
}
