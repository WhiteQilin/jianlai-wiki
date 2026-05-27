// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'

import CharacterInfobox from './components/CharacterInfobox.vue'
import NameBlock from './components/NameBlock.vue'
import LoreCard from './components/LoreCard.vue'
import RealmBadge from './components/RealmBadge.vue'
import RelationshipList from './components/RelationshipList.vue'
import HomeArchive from './components/HomeArchive.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app }) {
    app.component('CharacterInfobox', CharacterInfobox)
    app.component('NameBlock', NameBlock)
    app.component('LoreCard', LoreCard)
    app.component('RealmBadge', RealmBadge)
    app.component('RelationshipList', RelationshipList)
    app.component('HomeArchive', HomeArchive)
  }
} satisfies Theme
