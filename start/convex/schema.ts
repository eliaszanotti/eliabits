import { defineSchema } from 'convex/server'
import { habitCategories } from './domains/habit_categories/schema'
import { habitCompletions, habits } from './domains/habits/schema'

export default defineSchema({
    habitCategories,
    habits,
    habitCompletions,
})
