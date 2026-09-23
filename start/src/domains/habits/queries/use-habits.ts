import { api } from '@convex/_generated/api'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import type { FunctionReturnType } from 'convex/server'

export function useHabits() {
    return useQuery(convexQuery(api.domains.habits.queries.list.list, {}))
}

export type Habits = FunctionReturnType<typeof api.domains.habits.queries.list.list>
