import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'

const config = defineConfig({
    resolve: { tsconfigPaths: true },
    ssr: {
        noExternal: ['@convex-dev/better-auth'],
    },
    plugins: [
        tailwindcss(),
        tanstackStart({
            router: {
                entry: 'shared/router.tsx',
                routesDirectory: 'shared/routes',
                generatedRouteTree: 'shared/routeTree.gen.ts',
            },
        }),
        viteReact(),
    ],
})

export default config
