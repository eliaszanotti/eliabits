import { query } from '../../../_generated/server'
import { LOCAL_OWNER_ID } from '../lib/local_owner'

export const list = query({
    args: {},
    handler: async (ctx) => {
        return ctx.db.query('habits').withIndex('by_owner', (q) => q.eq('ownerId', LOCAL_OWNER_ID)).filter((q) => q.eq(q.field('archivedAt'), undefined)).order('asc').collect()
    },
})
