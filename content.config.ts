import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**',
      schema: z.object({
        chinese: z.string().optional(),
        category: z.string().optional(),
        status: z.string().optional()
      })
    }),
  },
})
