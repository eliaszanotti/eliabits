import { v } from 'convex/values'

import { authComponent } from '../../../auth'
import { mutation } from '../../../_generated/server'

export const toggleCompletion = mutation({
    args: { habitId: v.id('habits'), date: v.string() },
    handler: async (ctx, args) => {
        const user = await authComponent.getAuthUser(ctx)
        if (!user) throw new Error('Vous devez être connecté pour gérer vos habitudes.')
        const habit = await ctx.db.get(args.habitId)
        if (!habit || habit.ownerId !== user._id) throw new Error('Habitude introuvable.')

        const existing = await ctx.db.query('habitCompletions').withIndex('by_habit_and_date', (q) => q.eq('habitId', args.habitId).eq('date', args.date)).unique()
        if (existing) {
            await ctx.db.delete(existing._id)
            return false
        }
        await ctx.db.insert('habitCompletions', { ownerId: user._id, habitId: args.habitId, date: args.date, completedAt: Date.now() })
        return true
    },
})
