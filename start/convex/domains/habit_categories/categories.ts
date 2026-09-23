import { v } from 'convex/values'
import { mutation, query } from '../../_generated/server'
import { LOCAL_OWNER_ID } from '../habits/lib/local_owner'

export const list = query({
    args: {},
    handler: async (ctx) => {
        return ctx.db.query('habitCategories').withIndex('by_owner', (q) => q.eq('ownerId', LOCAL_OWNER_ID)).collect()
    },
})

export const create = mutation({
    args: { name: v.string() },
    handler: async (ctx, args) => {
        const name = args.name.trim()
        if (!name) throw new Error('Le nom de la catégorie est requis.')
        const categories = await ctx.db.query('habitCategories').withIndex('by_owner', (q) => q.eq('ownerId', LOCAL_OWNER_ID)).collect()
        const existing = categories.find((category) => category.name.toLocaleLowerCase('fr') === name.toLocaleLowerCase('fr'))
        if (existing) return existing._id
        return ctx.db.insert('habitCategories', { ownerId: LOCAL_OWNER_ID, name, createdAt: Date.now() })
    },
})

export const rename = mutation({
    args: { categoryId: v.id('habitCategories'), name: v.string() },
    handler: async (ctx, args) => {
        const name = args.name.trim()
        if (!name) throw new Error('Le nom de la catégorie est requis.')
        const category = await ctx.db.get(args.categoryId)
        if (!category || category.ownerId !== LOCAL_OWNER_ID) throw new Error('Catégorie introuvable.')
        const categories = await ctx.db.query('habitCategories').withIndex('by_owner', (q) => q.eq('ownerId', LOCAL_OWNER_ID)).collect()
        const duplicate = categories.find((item) => item._id !== args.categoryId && item.name.toLocaleLowerCase('fr') === name.toLocaleLowerCase('fr'))
        if (duplicate) throw new Error('Une catégorie porte déjà ce nom.')
        await ctx.db.patch(args.categoryId, { name })
    },
})

export const remove = mutation({
    args: { categoryId: v.id('habitCategories') },
    handler: async (ctx, args) => {
        const category = await ctx.db.get(args.categoryId)
        if (!category || category.ownerId !== LOCAL_OWNER_ID) throw new Error('Catégorie introuvable.')
        const habits = await ctx.db.query('habits').withIndex('by_owner', (q) => q.eq('ownerId', LOCAL_OWNER_ID)).collect()
        for (const habit of habits) {
            if (habit.categoryId === args.categoryId) await ctx.db.patch(habit._id, { categoryId: undefined })
        }
        await ctx.db.delete(args.categoryId)
    },
})
