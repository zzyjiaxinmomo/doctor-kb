import { defineConfig, type Plugin } from 'vitepress'

const clearLogoSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><image href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIKADAAQAAAABAAAAIAAAAACshmLzAAAEoUlEQVRYCcWWW2wWVRDHfwdKaSmXXgQFam2hRCFQUQKUKtVIBI14CSFKvEAkMdb45q3ig7wYjZqoUUmUB7UJGqJFE4iaoA1KlYZLSxQEaQu12FYsVFtulks5zux2/Xa/7n4XX/gnX3a/s3Nm5sz8Z+aY6WsHLJcRwy6jbcd0xv9xID8HXrjDUD4FLkn8Wrrhk12Wul/T15a2A8bABysN0ybEjBWUQHmJ4cgJqP7ccuCP2LdkbymlYJgY9X45mfDlPkvDEei/EFQ/5QrYsNqwdFZwPdG/hBFYtQAeu9mQN8pV8fvf8NV+HAOH/oR3v7OIbyyeYZg12ZUZKRpfXWbIzrR81pjItPvNRFXBw/NhjeTZjz3tcLIfbrvWvwr7u+D7ZsucIpcX+nXgkji/wbKzLSgb/y8yBQ/NCxrXjX3/QP5gNPyKZk6CJ281TMqFmgbLsZMwXDS/db/hyrF+yaHvkQ4UCNPjMWK4cCFyBxTlw6oFhjYh49YDMDYLnr196EH8eiM50P4XzJjoF4WsEW4Ugqtw/BROCW5vtU6URo+E4gLo6hOHyg0b94CmLwyRDmhtxzswcRzUtwTVbNoLL39th1TED61u5TQdtU56Hq0Jb7iRAdVSi0eh5LizN7b+fj28uDloXPuEB21SJ04jKbFORLx1/zMyAj8ehoPHYPpVMXFV7pnf1wnrpAw9PFIOD8wxDg/aeuAXqQxNReU0uDAAnzbGZL09+oyMgH58RUIbj9xsd+UjYbuWmuK5xYbnlxhKpBEp+0vHw73Xw6LrQIk7SpqXkjMMCR1oPAof7wpu05arkdEIKbT0tGckw8LScImEDuiW17dafu6IbS4rhG8PWk5JQ1LoafXUyaDdNDMk4Um3VkyFlyQVWpYe8nNi4dT8pgJNV5hsQgcy5KuO3TeWG6o3WVqPu6Z02GheFZqmbukDydAsZW2HUioxCZffCIV57u/tFcYpOe3t44SIqyvcKJy/CE/Xug0okRO1TSHWZUNIVmJqlpbFQj1hjFtSu9stO2QUP77QUHdISlVmf5NE4e51ljtnirO5ht965E4gRNUyfGqRoV+crI2YjJEOZEvb9UasuqRNJTPDUFWBGIB3tlkenGtYX2/RMd1zRu4CO1UyeNK90glXzIWLgyWrEn5EcqBYalo54EFPWTY487XPV0vdz74a7psN18gQioc2Lb26VVUamuXuEIXICPRIC/VDldwl5PNDb0BqoKoSOiQKnb0u0zVarUI65c+YLHizzr8r+O47Y/CDMnub5NhDh8wAJV8U1Ni8YjhzHnYcdvmgbXjtlmBK4vdHRkAFn5HS03l+j7RVZXsYtLZ1LnwjzemcyCy7wbBErmiKNV9YJyph+7y1yCuZJ6BPveeNllA+IeHWbnZaumBXn6X3rDtybyo13CKn1XB7qGmA16SLJkPCCHib9WTnhBN6Lh3JmoqifPNfM/LkvOfG3akZV/mUHPAU5wmr55d4/4Y+lXxanuvlnpAqIkkYpuC97ZazQrIw6M145YfpGVc9KXHAb3CypEDLcep44/T2lm7r3Pd+6vBLpf6etgOpq05NMq0UpKYyPal/AVRtaoNiza5RAAAAAElFTkSuQmCC" width="32" height="32"/></svg>'

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
    plugins: [serveAdmin()],
    define: {
      'import.meta.env.VITE_AI_API_BASE': JSON.stringify(process.env.VITE_AI_API_BASE || '')
    },
    envPrefix: ['VITE_', 'PUBLIC_']
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
      {
        icon: { svg: clearLogoSvg },
        link: 'https://drapp.clearbos.com/clearsiteNew/index',
        ariaLabel: '可丽尔医生端'
      }
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
