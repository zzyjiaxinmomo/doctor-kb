import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import AiSearch from './components/AiSearch.vue'
import BackToTop from './components/BackToTop.vue'
import NavBarLogo from './components/NavBarLogo.vue'
import './style.css'

// 锚点跳转顶部留白（120px = 避开 VitePress "页面导航" outline）
const ANCHOR_OFFSET = 120

/**
 * 等目标元素渲染后，强制精确滚动到目标位置。
 *
 * 背景：VitePress dev 模式首次加载（刷新/直链）时，浏览器原生 hash
 * 行为在 markdown 还没渲染时就执行，找不到元素就停在 fallback 位置。
 * VitePress 内部 scrollTo 同样不工作（initialLoad=true 不触发）。
 *
 * 修复：
 * 1. 关闭 history.scrollRestoration，禁止浏览器恢复滚动 + 原生 hash 行为
 * 2. MutationObserver 监听目标元素出现
 * 3. 找到后立即 scrollTo，并锁定目标位置（防 VitePress 二次滚动覆盖）
 */
function waitAndScroll(rawHash: string) {
  if (!rawHash) return
  const id = decodeURIComponent(rawHash.replace(/^#/, ''))
  if (!id) return

  const scrollToTarget = () => {
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - ANCHOR_OFFSET
    window.scrollTo({ top, behavior: 'instant' as ScrollBehavior })
    // 锁定目标位置 300ms：覆盖 VitePress 内部延迟触发的 scroll
    // 否则 VitePress 自己的 onAfterRouteChange / focus 等操作会覆盖
    let lockCount = 0
    const lock = () => {
      const cur = document.getElementById(id)
      if (cur && Math.abs(cur.getBoundingClientRect().top) > 5) {
        const t = cur.getBoundingClientRect().top + window.scrollY - ANCHOR_OFFSET
        window.scrollTo({ top: t, behavior: 'instant' as ScrollBehavior })
      }
      if (++lockCount < 6) setTimeout(lock, 50)
    }
    setTimeout(lock, 50)
  }

  if (document.getElementById(id)) {
    scrollToTarget()
    return
  }
  const obs = new MutationObserver(() => {
    if (document.getElementById(id)) {
      obs.disconnect()
      scrollToTarget()
    }
  })
  obs.observe(document.body, { childList: true, subtree: true })
  setTimeout(() => obs.disconnect(), 5000)
}

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'nav-bar-title-before': () => h(NavBarLogo),
    'layout-bottom': () => h('div', { class: 'floating-widgets' }, [
      h(AiSearch),
      h(BackToTop)
    ])
  }),
  enhanceApp({ app, router }) {
    app.component('AiSearch', AiSearch)
    if (typeof window === 'undefined') return

    // 关键：禁用浏览器原生滚动恢复 + hash 行为
    // 否则浏览器会在 markdown 还没渲染时就 hash scroll，停在错位置
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    // 1) 同页 hash 变化
    window.addEventListener('hashchange', () => {
      waitAndScroll(window.location.hash)
    })

    // 2) 路由切换（含跨页 hash）：覆盖 VitePress 默认 hook
    //    不链式调用 prev，避免 VitePress 的 scrollTo 用错元素
    router.onAfterRouteChange = (to: string) => {
      const hashIdx = to.indexOf('#')
      if (hashIdx >= 0) {
        setTimeout(() => waitAndScroll(to.slice(hashIdx)), 100)
      }
    }

    // 3) 初次加载时若带 hash，立即处理
    if (window.location.hash) {
      setTimeout(() => waitAndScroll(window.location.hash), 100)
    }
  }
} satisfies Theme
