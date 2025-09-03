export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      welcome: 'Welcome',
      home: 'Home',
      document: 'Document',
      api: 'API',
      marketplace: 'Marketplace',
      about: 'About',
      qa: 'Q & A'
    },
    zh: {
      welcome: '欢迎',
      home: '首页',
      document: '文档',
      api: 'API',
      marketplace: '市场',
      about: '关于',
      qa: '问答'
    }
  }
}))