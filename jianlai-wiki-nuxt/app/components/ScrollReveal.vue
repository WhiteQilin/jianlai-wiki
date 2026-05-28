<script setup lang="ts">
import { useScrollReveal } from '~/composables/useScrollReveal'

const props = withDefaults(defineProps<{
  animation?: 'reveal-fade-up' | 'reveal-blur-clear' | 'reveal-line' | 'reveal-seal'
  delay?: 'stagger-1' | 'stagger-2' | 'stagger-3' | 'stagger-4' | 'stagger-5' | ''
  threshold?: number
  tag?: string
}>(), {
  animation: 'reveal-fade-up',
  delay: '',
  threshold: 0.1,
  tag: 'div'
})

const { el, isRevealed } = useScrollReveal({ threshold: props.threshold, rootMargin: '0px 0px -50px 0px' })
</script>

<template>
  <component 
    :is="tag" 
    ref="el" 
    :class="[animation, delay, { 'revealed': isRevealed }]"
  >
    <slot />
  </component>
</template>
