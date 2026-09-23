import { authComponent } from '../../../auth'
import { query } from '../../../_generated/server'
import type { GenericCtx } from '@convex-dev/better-auth'
import type { DataModel } from '../../../_generated/dataModel'

async function requireUserId(ctx: GenericCtx<DataModel>) {
    const user = await authComponent.getAuthUser(ctx)
    if (!user) throw new Error('Vous devez être connecté pour gérer vos habitudes.')
    return user._id
}

export const list = query({
    args: {},
    handler: async (ctx) => {
        const ownerId = await requireUserId(ctx)
        return ctx.db.query('habits').withIndex('by_owner', (q) => q.eq('ownerId', ownerId)).filter((q) => q.eq(q.field('archivedAt'), undefined)).order('asc').collect()
    },
})
