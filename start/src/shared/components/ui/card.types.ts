import type { ComponentProps } from 'react'

export type CardSectionProps = ComponentProps<'div'>

export type CardProps = CardSectionProps & {
    size?: 'default' | 'sm'
}
