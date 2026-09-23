import { v } from 'convex/values'

import { authComponent } from '../../../auth'
import { mutation } from '../../../_generated/server'

export const create = mutation({
    args: { name: v.string() },
    handler: async (ctx, args) => {
        const user = await authComponent.getAuthUser(ctx)
        if (!user) throw new Error('Vous devez être connecté pour gérer vos habitudes.')
        const name = args.name.trim()
        if (!name) throw new Error('Le nom de l’habitude est requis.')
        return ctx.db.insert('habits', { ownerId: user._id, name, createdAt: Date.now() })
    },
})
