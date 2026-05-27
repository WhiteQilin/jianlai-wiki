import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '剑来 · Jian Lai Wiki',
  description: 'A fan-made archive of characters, realms, swordsmanship, locations, factions, artifacts, and chronology from Jian Lai.',
  lang: 'en-US',

  themeConfig: {
    search: {
      provider: 'local'
    },

    nav: [
      { text: '首页 Home', link: '/' },
      { text: '人物 Characters', link: '/characters/' },
      {
        text: '天下 World',
        items: [
          { text: 'Locations', link: '/locations/' },
          { text: 'Factions', link: '/factions/' },
          { text: 'Artifacts', link: '/artifacts/' }
        ]
      },
      {
        text: '修行 Cultivation',
        items: [
          { text: 'Realms', link: '/cultivation/' },
          { text: 'Sword Techniques', link: '/sword-techniques/' }
        ]
      },
      {
        text: '典籍 Lore',
        items: [
          { text: 'Timeline', link: '/timeline/' },
          { text: 'Glossary', link: '/glossary/' }
        ]
      }
    ],

    sidebar: {
      '/characters/': [
        {
          text: 'Characters',
          items: [
            { text: 'Overview', link: '/characters/' },
            { text: 'Chen Ping\'an', link: '/characters/chen-pingan' }
          ]
        }
      ],
      '/locations/': [
        {
          text: 'Locations',
          items: [
            { text: 'Overview', link: '/locations/' }
          ]
        }
      ],
      '/factions/': [
        {
          text: 'Factions',
          items: [
            { text: 'Overview', link: '/factions/' }
          ]
        }
      ],
      '/artifacts/': [
        {
          text: 'Artifacts',
          items: [
            { text: 'Overview', link: '/artifacts/' }
          ]
        }
      ],
      '/cultivation/': [
        {
          text: 'Cultivation Realms',
          items: [
            { text: 'Overview', link: '/cultivation/' }
          ]
        }
      ],
      '/sword-techniques/': [
        {
          text: 'Sword Techniques',
          items: [
            { text: 'Overview', link: '/sword-techniques/' }
          ]
        }
      ],
      '/timeline/': [
        {
          text: 'Timeline',
          items: [
            { text: 'Overview', link: '/timeline/' }
          ]
        }
      ],
      '/glossary/': [
        {
          text: 'Glossary',
          items: [
            { text: 'Overview', link: '/glossary/' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/WhiteQilin/jianlai-wiki' }
    ],

    footer: {
      message: 'Jian Lai Wiki · A Xianxia Archive',
      copyright: 'Fan-made wiki. All rights belong to the original author.'
    },

    outline: {
      level: [2, 3],
      label: 'On this page'
    }
  }
})
