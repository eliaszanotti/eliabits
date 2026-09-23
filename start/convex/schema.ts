import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
    habits: defineTable({
        ownerId: v.string(),
        name: v.string(),
        createdAt: v.number(),
        archivedAt: v.optional(v.number()),
    }).index('by_owner', ['ownerId']),

    habitCompletions: defineTable({
        ownerId: v.string(),
        habitId: v.id('habits'),
        date: v.string(),
        completedAt: v.number(),
    })
        .index('by_owner_and_date', ['ownerId', 'date'])
        .index('by_habit_and_date', ['habitId', 'date']),
})
