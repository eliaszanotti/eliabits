import { defineTable } from 'convex/server'
import { v } from 'convex/values'

export const habitCategories = defineTable({
    ownerId: v.string(),
    name: v.string(),
    createdAt: v.number(),
}).index('by_owner', ['ownerId'])
