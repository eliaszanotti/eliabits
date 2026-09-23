import { v } from 'convex/values'
import type { GenericCtx } from '@convex-dev/better-auth'

import { authComponent } from '../../../auth'
import { query } from '../../../_generated/server'
import type { DataModel } from '../../../_generated/dataModel'

export const completionsForDateRange = query({
    args: { startDate: v.string(), endDate: v.string() },
    handler: async (ctx, args) => {
        const user = await authComponent.getAuthUser(ctx as GenericCtx<DataModel>)
        if (!user) throw new Error('Vous devez être connecté pour gérer vos habitudes.')
        return ctx.db.query('habitCompletions').withIndex('by_owner_and_date', (q) => q.eq('ownerId', user._id).gte('date', args.startDate).lte('date', args.endDate)).collect()
    },
})
