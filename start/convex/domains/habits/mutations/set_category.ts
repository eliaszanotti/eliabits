import { v } from 'convex/values'
import { mutation } from '../../../_generated/server'
import { LOCAL_OWNER_ID } from '../lib/local_owner'

export const setCategory = mutation({
    args: { habitId: v.id('habits'), categoryId: v.optional(v.id('habitCategories')) },
    handler: async (ctx, args) => {
        const habit = await ctx.db.get(args.habitId)
        if (!habit || habit.ownerId !== LOCAL_OWNER_ID) throw new Error('Habitude introuvable.')
        if (args.categoryId) {
            const category = await ctx.db.get(args.categoryId)
            if (!category || category.ownerId !== LOCAL_OWNER_ID) throw new Error('Catégorie introuvable.')
        }
        await ctx.db.patch(args.habitId, { categoryId: args.categoryId })
    },
})
