import { defineConfig, type Plugin } from 'vitepress'

function serveAdmin(): Plugin {
  return {
    name: 'serve-admin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/admin' || req.url === '/admin/') {
          res.writeHead(302, { Location: '/admin/index.html' })
          res.end()
          return
        }
        next()
      })
    }
  }
}

export default defineConfig({
  lang: 'zh-CN',
  title: '可丽尔帮助中心',
  description: '可丽尔医生端使用指南与知识库',

  search: {
    provider: 'local'
  },

  vite: {
    plugins: [serveAdmin()]
  },

  themeConfig: {
    logo: '/images/logo.png',

    nav: [
      { text: '首页', link: '/' },
      { text: '使用指南', link: '/guide/case-management' },
      { text: '常见问题', link: '/faq' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '使用指南',
          items: [
            { text: '病例管理', link: '/guide/case-management' },
            { text: 'AI报告', link: '/guide/ai-report' },
            { text: '排产/发货申请', link: '/guide/delivery' },
            { text: '临床服务', link: '/guide/clinical-service' },
            { text: '初步方案', link: '/guide/preliminary' },
            { text: '快速定位', link: '/guide/fast-target' },
            { text: '患者管理', link: '/guide/patient' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-org/doctor-kb' }
    ],

    footer: {
      message: '可丽尔医生端帮助中心',
      copyright: 'Copyright © 2024-present 博恩云'
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    outline: {
      label: '页面导航',
      level: [2, 3]
    },

    lastUpdated: {
      text: '最后更新于'
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  }
})
