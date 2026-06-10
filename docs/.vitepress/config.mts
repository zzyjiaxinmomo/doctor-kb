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

  base: '/doctor-kb/',

  search: {
    provider: 'local'
  },

  vite: {
    plugins: [serveAdmin()]
  },

  themeConfig: {
    logo: undefined,
    siteTitle: '可丽尔帮助中心',

    nav: [
      { text: '首页', link: '/' },
      { text: '使用指南', link: '/guide/login' },
      { text: '常见问题', link: '/faq' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '使用指南',
          items: [
            { text: '系统登录', link: '/guide/login' },
            { text: '工作台', link: '/guide/workbench' },
            { text: '新建初诊病例', link: '/guide/new-case' },
            { text: '病例管理', link: '/guide/case-management' },
            { text: '复诊监控', link: '/guide/follow-up' },
            { text: '正畸学苑', link: '/guide/academy' },
            { text: '个人中心', link: '/guide/profile' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-org/doctor-kb' }
    ],

    footer: {
      message: '',
      copyright: '© Copyright 2020-2026 ©2017可丽尔医疗科技（常州）有限公司版权所有 <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">苏公网安备 32041202001648号</a> 苏ICP备16050379号'
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
