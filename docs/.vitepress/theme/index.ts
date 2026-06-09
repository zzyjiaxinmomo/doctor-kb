import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import AiSearch from './components/AiSearch.vue'
import BackToTop from './components/BackToTop.vue'
import NavBarLogo from './components/NavBarLogo.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'nav-bar-title-before': () => h(NavBarLogo),
    'layout-bottom': () => h('div', { class: 'floating-widgets' }, [
      h(AiSearch),
      h(BackToTop)
    ])
  }),
  enhanceApp({ app }) {
    app.component('AiSearch', AiSearch)
  }
} satisfies Theme
