import { defineContentConfig, defineCollection, z } from '@nuxt/content'

/**
 * Single `content` collection (one collection, many categories).
 *
 * Schema is intentionally ADDITIVE and OPTIONAL:
 * - Existing required behavior is preserved (Nuxt Content's page `title`).
 * - `chinese`, `category`, `status` remain the active fields used by current
 *   pages and components. Do NOT migrate existing pages to `titleZh` yet.
 * - `titleZh` is provided only as a future-compatible optional alias.
 * - Every new field is `.optional()` so no existing page can break.
 *
 * This mirrors a future "pages" DB table with a `section` discriminator:
 * file -> record, frontmatter -> columns, path -> primary key,
 * relationship arrays -> join tables.
 */
export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**',
      schema: z.object({
        // --- Existing active fields (keep using these) ---
        chinese: z.string().optional(),
        category: z.string().optional(),
        status: z.string().optional(),

        // --- Shared base fields (all optional, additive) ---
        titleZh: z.string().optional(), // future alias for `chinese`; not yet used by pages
        pinyin: z.string().optional(),
        section: z.string().optional(),
        subcategory: z.string().optional(),
        importance: z.enum(['primary', 'major', 'minor', 'background']).optional(),
        image: z.string().optional(),
        banner: z.string().optional(),
        video: z.string().optional(),
        seal: z.string().optional(),
        description: z.string().optional(),
        tags: z.array(z.string()).optional(),
        related: z.array(z.string()).optional(),
        verificationStatus: z
          .enum(['verified', 'to-be-verified', 'disputed', 'speculative'])
          .optional(),
        sourceNotes: z.string().optional(),
        firstAppearance: z.string().optional(),
        lastUpdated: z.string().optional(),

        // --- Relationship primitives (path-string references) ---
        relationships: z
          .array(
            z.object({
              name: z.string(),
              relation: z.string().optional(),
              link: z.string().optional(),
            }),
          )
          .optional(),

        // --- Character ---
        affiliations: z.array(z.string()).optional(),
        realm: z.string().optional(),
        titles: z.array(z.string()).optional(),
        origin: z.string().optional(),
        abilities: z.array(z.string()).optional(),

        // --- Faction / Sect ---
        factionType: z.string().optional(),
        headquarters: z.string().optional(),
        leader: z.union([z.string(), z.array(z.string())]).optional(),
        members: z.array(z.string()).optional(),
        teachings: z.array(z.string()).optional(),

        // --- Artifact / Weapon ---
        artifactType: z.string().optional(),
        tier: z.string().optional(),
        owners: z.array(z.string()).optional(),

        // --- World / Location ---
        locationType: z.string().optional(),
        governingFaction: z.string().optional(),
        parentLocation: z.string().optional(),
        inhabitants: z.array(z.string()).optional(),

        // --- Cultivation ---
        realmLevel: z.number().optional(),
        pathType: z.string().optional(),
        practitioners: z.array(z.string()).optional(),

        // --- Swordsmanship / Ability ---
        abilityType: z.string().optional(),
        users: z.array(z.string()).optional(),
        lineage: z.string().optional(),

        // --- Ranking / List ---
        listType: z.string().optional(),
        entries: z
          .array(
            z.object({
              rank: z.union([z.number(), z.string()]).optional(),
              name: z.string(),
              link: z.string().optional(),
              note: z.string().optional(),
            }),
          )
          .optional(),

        // --- Teaching / School ---
        teachingType: z.string().optional(),
        keyFigures: z.array(z.string()).optional(),
        relatedFactions: z.array(z.string()).optional(),

        // --- Pantheon (God / Demon / Spirit) ---
        beingType: z.string().optional(),
        domain: z.string().optional(),
        territory: z.string().optional(),

        // --- Title / Office ---
        titleType: z.string().optional(),
        holders: z.array(z.string()).optional(),
        grantedBy: z.string().optional(),

        // --- Timeline Event ---
        date: z.string().optional(),
        era: z.string().optional(),
        eraOrder: z.number().optional(),
        participants: z.array(z.string()).optional(),
        location: z.string().optional(),

        // --- Glossary ---
        termType: z.string().optional(),
        relatedTerms: z.array(z.string()).optional(),
      }),
    }),
  },
})
