import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import type { RootDocumentProps } from '../types/root-document'
import { AppProviders } from '../lib/convex'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
    head: () => ({
        meta: [
            {
                charSet: 'utf-8',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                title: 'TanStack Start Starter',
            },
        ],
        links: [
            {
                rel: 'stylesheet',
                href: appCss,
            },
        ],
    }),
    shellComponent: RootDocument,
})

function RootDocument({ children }: RootDocumentProps) {
    return (
        <html lang="en">
            <head>
                <HeadContent />
            </head>
            <body>
                <AppProviders>{children}</AppProviders>

                <Scripts />
            </body>
        </html>
    )
}
