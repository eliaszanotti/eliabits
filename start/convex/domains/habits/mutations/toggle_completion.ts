import { v } from 'convex/values'

import { mutation } from '../../../_generated/server'
import { LOCAL_OWNER_ID } from '../lib/local_owner'

export const toggleCompletion = mutation({
    args: { habitId: v.id('habits'), date: v.string() },
    handler: async (ctx, args) => {
        const habit = await ctx.db.get(args.habitId)
        if (!habit || habit.ownerId !== LOCAL_OWNER_ID) throw new Error('Habitude introuvable.')

        const existing = await ctx.db.query('habitCompletions').withIndex('by_habit_and_date', (q) => q.eq('habitId', args.habitId).eq('date', args.date)).unique()
        if (existing) {
            await ctx.db.delete(existing._id)
            return false
        }
        await ctx.db.insert('habitCompletions', { ownerId: LOCAL_OWNER_ID, habitId: args.habitId, date: args.date, completedAt: Date.now() })
        return true
    },
})
