import { defineTable } from 'convex/server'
import { v } from 'convex/values'

export const habits = defineTable({
    ownerId: v.string(),
    name: v.string(),
    createdAt: v.number(),
    categoryId: v.optional(v.id('habitCategories')),
    archivedAt: v.optional(v.number()),
}).index('by_owner', ['ownerId'])

export const habitCompletions = defineTable({
    ownerId: v.string(),
    habitId: v.id('habits'),
    date: v.string(),
    completedAt: v.number(),
})
    .index('by_owner_and_date', ['ownerId', 'date'])
    .index('by_habit_and_date', ['habitId', 'date'])
