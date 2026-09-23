import { api } from '@convex/_generated/api'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import type { FunctionReturnType } from 'convex/server'

export function useCompletions(date: string) {
    return useQuery(
        convexQuery(api.domains.habits.queries.completions_for_date_range.completionsForDateRange, {
            startDate: date,
            endDate: date,
        }),
    )
}

export type HabitCompletions = FunctionReturnType<
    typeof api.domains.habits.queries.completions_for_date_range.completionsForDateRange
>
