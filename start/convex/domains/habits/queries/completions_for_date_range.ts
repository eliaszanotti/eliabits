import { v } from 'convex/values'
import { query } from '../../../_generated/server'
import { LOCAL_OWNER_ID } from '../lib/local_owner'

export const completionsForDateRange = query({
    args: { startDate: v.string(), endDate: v.string() },
    handler: async (ctx, args) => {
        return ctx.db.query('habitCompletions').withIndex('by_owner_and_date', (q) => q.eq('ownerId', LOCAL_OWNER_ID).gte('date', args.startDate).lte('date', args.endDate)).collect()
    },
})
