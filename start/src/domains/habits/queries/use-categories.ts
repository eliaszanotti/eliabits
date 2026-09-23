import { api } from '@convex/_generated/api'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'

export function useCategories() {
    return useQuery(convexQuery(api.domains.habit_categories.categories.list, {}))
}
