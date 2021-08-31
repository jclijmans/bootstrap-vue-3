import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'

export default defineUserConfig<DefaultThemeOptions>({
  lang: 'en-US',
    base: '/bootstrap-vue-3/',
    title: 'BootstrapVue 3',
    head: [['link', { rel: 'icon', href: '/bootstrap-vue-3/favicon.ico' }]],
    themeConfig: {
      logo: '/logo.png',
      repo: 'https://github.com/cdmoro/bootstrap-vue-3',
      editLink: true,
      lastUpdated: true,
      navbar: [
        { text: 'Home', link: '/' },
        { text: 'Docs', link: '/getting-started/' },
        { text: 'Reference', children: [
          { text: 'Components', link: '/components/' },
          { text: 'Types', link: '/reference/types.md' },
          { text: 'Comparision with BootstrapVue', link: '/reference/parityList.md'}
        ]}
      ],
      sidebar: {
        '/components/': [
          {
            text: 'Components',
            children: [
              '/components/README.md',
              '/components/Accordion.md',
              '/components/Badge.md',
              '/components/FormCheckbox.md',
              '/components/Progress.md',
              '/components/Spinners.md',
              '/components/Table.md',
            ]
          }
        ]
      }
    }
})