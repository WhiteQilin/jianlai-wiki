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
import WikiGrid from './components/WikiGrid.vue'
import WikiCard from './components/WikiCard.vue'
import CategoryFilter from './components/CategoryFilter.vue'
import HeroMedia from './components/HeroMedia.vue'
import MediaBanner from './components/MediaBanner.vue'
import ImageFrame from './components/ImageFrame.vue'
import VideoEmbed from './components/VideoEmbed.vue'

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
    app.component('WikiGrid', WikiGrid)
    app.component('WikiCard', WikiCard)
    app.component('CategoryFilter', CategoryFilter)
    app.component('HeroMedia', HeroMedia)
    app.component('MediaBanner', MediaBanner)
    app.component('ImageFrame', ImageFrame)
    app.component('VideoEmbed', VideoEmbed)
  }
} satisfies Theme
