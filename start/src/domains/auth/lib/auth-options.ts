import type { BetterAuthOptions } from 'better-auth'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

export const authOptions = {
    appName: 'eliabits',
    emailAndPassword: {
        enabled: true,
    },
    plugins: [tanstackStartCookies()],
} satisfies BetterAuthOptions
