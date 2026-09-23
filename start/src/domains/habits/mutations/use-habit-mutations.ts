import { api } from '@convex/_generated/api'
import { useConvexMutation } from '@convex-dev/react-query'
import { useMutation } from '@tanstack/react-query'
import type { FunctionReturnType } from 'convex/server'

export function useCreateHabit() {
    return useMutation({ mutationFn: useConvexMutation(api.domains.habits.mutations.create.create) })
}

export type CreateHabitResult = FunctionReturnType<typeof api.domains.habits.mutations.create.create>

export function useToggleHabitCompletion() {
    return useMutation({ mutationFn: useConvexMutation(api.domains.habits.mutations.toggle_completion.toggleCompletion) })
}

export type ToggleHabitCompletionResult = FunctionReturnType<
    typeof api.domains.habits.mutations.toggle_completion.toggleCompletion
>
